// @flow

import { connect } from 'react-redux';
import eres from 'eres';
import { DashboardView } from '../views/dashboard';
import rpc from '../../services/api';
import { loadWalletSummary, loadWalletSummarySuccess, loadWalletSummaryError } from '../redux/modules/wallet';

import type { AppState } from '../types/app-state';
import type { Dispatch } from '../types/redux';

const mapStateToProps = ({ walletSummary }: AppState) => ({
  total: walletSummary.total,
  shielded: walletSummary.shielded,
  transparent: walletSummary.transparent,
  error: walletSummary.error,
  isLoading: walletSummary.isLoading,
  dollarValue: walletSummary.dollarValue,
  addresses: walletSummary.addresses,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getSummary: async () => {
    dispatch(loadWalletSummary());

    const [err, walletSummary] = await eres(rpc.z_gettotalbalance());

    if (err) return dispatch(loadWalletSummaryError({ error: err.message }));

    const [addressesErr, addresses] = await eres(rpc.z_listaddresses());

    if (addressesErr) return dispatch(loadWalletSummaryError({ error: addressesErr.message }));

    dispatch(
      loadWalletSummarySuccess({
        transparent: walletSummary.transparent,
        total: walletSummary.total,
        shielded: walletSummary.private,
        addresses,
      }),
    );
  },
});

export const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardView);
