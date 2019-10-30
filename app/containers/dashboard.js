// @flow

import { connect } from 'react-redux';
import eres from 'eres';
import flow from 'lodash.flow';
import groupBy from 'lodash.groupby';
import dateFns from 'date-fns';
import { BigNumber } from 'bignumber.js';

import { DashboardView } from '../views/dashboard';

import rpc from '../../services/api';
import store from '../../config/electron-store';
import { SAPLING, SPROUT, MIN_CONFIRMATIONS_NUMBER } from '../constants/vidulum-network';
import { NODE_SYNC_TYPES } from '../constants/node-sync-types';
import { listShieldedTransactions } from '../../services/shielded-transactions';
import { sortByDescend } from '../utils/sort-by-descend';

import {
  loadWalletSummary,
  loadWalletSummarySuccess,
  loadWalletSummaryError,
} from '../redux/modules/wallet';
import type { TransactionsList } from '../redux/modules/transactions';

import type { AppState } from '../types/app-state';
import type { Dispatch, FetchState } from '../types/redux';

export type MapStateToProps = {|
  total: number,
  shielded: number,
  generated: number,
  immature: number,
  transparent: number,
  unconfirmed: number,
  error: null | string,
  fetchState: FetchState,
  vdlPrice: number,
  addresses: string[],
  transactions: TransactionsList,
  isDaemonReady: boolean,
|};

const mapStateToProps: AppState => MapStateToProps = ({ walletSummary, app }) => ({
  total: Math.round(walletSummary.total * 1000) / 1000,
  shielded: Math.round(walletSummary.shielded * 1000) / 1000,
  immature: walletSummary.immature,
  generated: walletSummary.generated,
  transparent: Math.round(walletSummary.transparent * 1000) / 1000,
  unconfirmed: walletSummary.unconfirmed,
  error: walletSummary.error,
  fetchState: walletSummary.fetchState,
  vdlPrice: walletSummary.vdlPrice,
  addresses: walletSummary.addresses,
  transactions: walletSummary.transactions,
  isDaemonReady: app.nodeSyncType === NODE_SYNC_TYPES.READY,
});

export type MapDispatchToProps = {|
  getSummary: () => Promise<void>,
|};

const mapDispatchToProps: (dispatch: Dispatch) => MapDispatchToProps = (dispatch: Dispatch) => ({
  getSummary: async () => {
    dispatch(loadWalletSummary());

    const [balanceErr, balanceSummary] = await eres(rpc.getbalance());
    const [walletErr, walletSummary] = await eres(rpc.z_gettotalbalance());
    const [zAddressesErr, zAddresses = []] = await eres(rpc.z_listaddresses());
    const [vAddressesErr, vAddresses = []] = await eres(rpc.getaddressesbyaccount(''));
    const [transactionsErr, transactions] = await eres(rpc.listtransactions('', 10080, 0)); // Load the last 10080 transactions - to guarantee at least 1 week of transactions
    const [unconfirmedBalanceErr, unconfirmedBalance] = await eres(rpc.getunconfirmedbalance());
    const [walletInfoDataErr, walletInfo] = await eres(rpc.getwalletinfo());

    await fetch('https://api.coingecko.com/api/v3/simple/price?ids=vidulum&vs_currencies=usd')
      .then(res => res.json())
      .then(
        (result) => {
          store.set('VDL_DOLLAR_PRICE', String(result.vidulum.usd));
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          store.set('VDL_DOLLAR_PRICE', '0');
        },
      );


    if (walletErr || zAddressesErr || vAddressesErr || transactionsErr
      || unconfirmedBalanceErr || walletInfoDataErr || balanceErr) {
      return dispatch(
        loadWalletSummaryError({
          error: 'Something went wrong!',
        }),
      );
    }

    const oneWeekAgo = new Date().getTime()/1000 - (60*60*24*7);
    const filteredTransactions = [];
    for (var i=transactions.length-1;i>=0;i--) {
      if (transactions[i].time > oneWeekAgo) {
        filteredTransactions.push(transactions[i]);
      } else {
        break;
      }
    }

    const formattedTransactions: Array<Object> = flow([
      arr => arr.map(transaction => ({
        confirmed: transaction.confirmations >= MIN_CONFIRMATIONS_NUMBER,
        confirmations: transaction.confirmations,
        transactionId: transaction.txid,
        type: transaction.category,
        date: new Date(transaction.time * 1000).toISOString(),
        address: transaction.address || '(Shielded)',
        amount: Math.abs(transaction.amount),
        fees: transaction.fee ? new BigNumber(transaction.fee).abs().toFormat(4) : 'N/A',
      })),
      arr => groupBy(arr, obj => dateFns.format(obj.date, 'MMM DD, YYYY')),
      obj => Object.keys(obj).map(day => ({
        day,
        jsDay: new Date(day),
        list: sortByDescend('date')(obj[day]),
      })),
      sortByDescend('jsDay'),
    ])([...filteredTransactions, ...listShieldedTransactions()]);

    // check for generated
    let generatedAmount = 0;
    filteredTransactions.map((transaction) => {
      if (transaction.generated) {
        generatedAmount += Math.abs(transaction.amount);
      }
    });
    walletSummary.generated = Math.round(generatedAmount * 1000) / 1000;

    if (!zAddresses.length) {
      const [blockHeightErr, blockHeight] = await eres(rpc.getblockcount());
      let newZAddress;
      if (blockHeight < 430000) { // TODO: don't use sapling until sapling is activated
        [, newZAddress] = await eres(rpc.z_getnewaddress(SPROUT));
      } else {
        [, newZAddress] = await eres(rpc.z_getnewaddress(SAPLING));
      }


      if (newZAddress) zAddresses.push(newZAddress);
    }

    if (!vAddresses.length) {
      const [, newTAddress] = await eres(rpc.getnewaddress(''));

      if (newTAddress) vAddresses.push(newTAddress);
    }
    walletSummary.immature = walletInfo.immature_balance;
    dispatch(
      loadWalletSummarySuccess({
        transparent: walletSummary.transparent,
        immature: walletSummary.immature,
        total: balanceSummary,
        shielded: walletSummary.private,
        generated: walletSummary.generated,
        unconfirmed: unconfirmedBalance,
        addresses: [...zAddresses, ...vAddresses],
        transactions: formattedTransactions,
        vdlPrice: new BigNumber(store.get('VDL_DOLLAR_PRICE')).toNumber(),
      }),
    );
  },
});

// $FlowFixMe
export const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardView);
