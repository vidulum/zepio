// @flow

import eres from 'eres';
import { connect } from 'react-redux';
import { BigNumber } from 'bignumber.js';

import store from '../../config/electron-store';
import rpc from '../../services/api';
import { ShieldView } from '../views/shield';

import {
  loadVDLPrice,
  sendTransaction,
  sendTransactionSuccess,
  sendTransactionError,
  resetSendTransaction,
  validateAddressSuccess,
  validateAddressError,
  loadAddressBalanceSuccess,
  loadAddressBalanceError,
} from '../redux/modules/send';

import { filterObjectNullKeys } from '../utils/filter-object-null-keys';
import { asyncMap } from '../utils/async-map';
import { getLatestAddressKey } from '../utils/get-latest-address-key';
import { saveShieldedTransaction } from '../../services/shielded-transactions';

import type { AppState } from '../types/app-state';
import type { Dispatch, FetchState } from '../types/redux';

import { loadAddresses, loadAddressesSuccess, loadAddressesError } from '../redux/modules/receive';

export type ShieldCoinbaseInput = {
  from: string,
  to: string,
};

export type MapStateToProps = {|
  balance: number,
  vdlPrice: number,
  generated: number,
  addresses: { address: string, balance: number }[],
  error: string | null,
  fetchState: FetchState,
  isSending: boolean,
  operationId: string | null,
  isToAddressValid: boolean,
  nodeSyncType: string,
|};

const mapStateToProps = ({ sendStatus, receive, app }: AppState): MapStateToProps => ({
  balance: sendStatus.addressBalance,
  vdlPrice: sendStatus.vdlPrice,
  addresses: receive.addresses,
  error: sendStatus.error,
  fetchState: receive.fetchState,
  isSending: sendStatus.isSending,
  operationId: sendStatus.operationId,
  isToAddressValid: sendStatus.isToAddressValid,
  nodeSyncType: app.nodeSyncType,
});

export type MapDispatchToProps = {|
  shieldCoinbase: ShieldCoinbaseInput => Promise<void>,
  loadAddresses: () => Promise<void>,
  resetSendView: () => void,
  validateAddress: ({ address: string }) => Promise<void>,
  loadVDLPrice: () => void,
  getAddressBalance: ({ address: string }) => Promise<void>,
|};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => ({

  resetSendView: () => dispatch(resetSendTransaction()),
  validateAddress: async ({ address }: { address: string }) => {
    if (address.startsWith('z')) {
      const [, validationResult] = await eres(rpc.z_validateaddress(address));

      return dispatch(
        validateAddressSuccess({
          isValid: Boolean(validationResult && validationResult.isvalid),
        }),
      );
    }

    const [, validationResult] = await eres(rpc.validateaddress(address));

    if (validationResult) {
      return dispatch(
        validateAddressSuccess({
          isValid: Boolean(validationResult && validationResult.isvalid),
        }),
      );
    }

    return dispatch(validateAddressError());
  },
  shieldCoinbase: async ({
    from, to,
  }) => {
    dispatch(sendTransaction());

    // Check from is v addr and to is z addr
    if (!to.startsWith('z')) {
      return dispatch(sendTransactionError({ error: 'Error Shielding' }));
    }

    // $FlowFixMe
    const [sendErr, operationId] = await eres(
      rpc.z_shieldcoinbase(
        from,
        to,
        0.0001,
        0,
      ),
    );

    // eslint-disable-next-line max-len
    if (sendErr || !operationId.opid) return dispatch(sendTransactionError({ error: sendErr.message }));

    /**
      Output is a list of operation status objects.
      [
        {“operationid”: “opid-12ee…”,
        “status”: “queued”},
        {“operationid”: “opd-098a…”, “status”: ”executing”},
        {“operationid”: “opid-9876”, “status”: ”failed”}
      ]

      When the operation succeeds, the status object will also include the result.
      {“operationid”: “opid-0e0e”, “status”:”success”, “execution_time”:”25”, “result”: {“txid”:”af3887654…”,...}}

      then the promise will only be resolved when a "success" or "failure" status is obtained
     */
    const interval = setInterval(async () => {
      const [, status] = await eres(rpc.z_getoperationstatus());

      const operationStatus = status.find(({ id }) => operationId.opid === id);

      if (operationStatus && operationStatus.status === 'success') {
        clearInterval(interval);
        saveShieldedTransaction({
          txid: operationStatus.result.txid,
          category: 'send',
          time: Date.now() / 1000,
          address: '(Shielded)',
          amount: new BigNumber(0).toNumber(), // TODO: get coinbase amount and add here instead of 0
        });
        dispatch(sendTransactionSuccess({ operationId: operationStatus.result.txid }));
      }

      if (operationStatus && operationStatus.status === 'failed') {
        clearInterval(interval);
        dispatch(sendTransactionError({ error: operationStatus.error.message }));
      }
    }, 2000);
  },
  loadAddresses: async () => {
    dispatch(loadAddresses());

    const [zAddressesErr, zAddresses] = await eres(rpc.z_listaddresses());

    const [vAddressesErr, transparentAddresses] = await eres(rpc.getaddressesbyaccount(''));

    if (zAddressesErr || vAddressesErr) return dispatch(loadAddressesError({ error: 'Something went wrong!' }));

    const latestZAddress = zAddresses.find(addr => addr === store.get(getLatestAddressKey('shielded'))) || zAddresses[0];

    const latestTAddress = transparentAddresses.find(addr => addr === store.get(getLatestAddressKey('transparent')))
      || transparentAddresses[0];

    const allAddresses = await asyncMap(
      [
        ...zAddresses.filter(cur => cur !== latestZAddress),
        ...transparentAddresses.filter(cur => cur !== latestTAddress),
      ],
      async (address) => {
        const [err, response] = await eres(rpc.z_getbalance(address));

        if (!err && new BigNumber(response).isGreaterThan(0)) return { address, balance: response };

        return null;
      },
    );

    return dispatch(
      loadAddressesSuccess({
        addresses: [
          latestZAddress
            ? {
              address: latestZAddress,
              balance: await rpc.z_getbalance(latestZAddress),
            }
            : null,
          latestTAddress
            ? { address: latestTAddress, balance: await rpc.z_getbalance(latestTAddress) }
            : null,
          ...allAddresses,
        ].filter(Boolean),
      }),
    );
  },
  loadVDLPrice: () => dispatch(
    loadVDLPrice({
      value: new BigNumber(store.get('VDL_DOLLAR_PRICE')).toNumber(),
    }),
  ),
  getAddressBalance: async ({ address }: { address: string }) => {
    const [err, balance] = await eres(rpc.z_getbalance(address));

    if (err) return dispatch(loadAddressBalanceError({ error: "Can't load your balance address" }));

    return dispatch(loadAddressBalanceSuccess({ balance }));
  },
});

// $FlowFixMe
export const ShieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShieldView);
