// @flow

import eres from 'eres';
import { connect } from 'react-redux';
import electron from 'electron'; // eslint-disable-line

import electronStore from '../../config/electron-store';
import { VIDULUM_NETWORK } from '../constants/vidulum-network';
import { SettingsView } from '../views/settings';

import { loadAddressesSuccess, loadAddressesError } from '../redux/modules/receive';

import rpc from '../../services/api';

import type { AppState } from '../types/app-state';
import type { Dispatch } from '../types/redux';

export type MapStateToProps = {|
  addresses: { address: string, balance: number }[],
  vidulumNetwork: string,
  embeddedDaemon: boolean,
|};

const mapStateToProps = ({ receive, app }: AppState): MapStateToProps => ({
  addresses: receive.addresses,
  vidulumNetwork: app.vidulumNetwork,
  embeddedDaemon: app.embeddedDaemon,
});

export type MapDispatchToProps = {|
  loadAddresses: () => Promise<void>,
  updateVidulumNetwork: (newNetwork: string) => void,
|};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => ({
  loadAddresses: async () => {
    const [zAddressesErr, zAddresses] = await eres(rpc.z_listaddresses());

    const [vAddressesErr, transparentAddresses] = await eres(rpc.getaddressesbyaccount(''));

    if (zAddressesErr || vAddressesErr) return dispatch(loadAddressesError({ error: 'Something went wrong!' }));

    dispatch(
      loadAddressesSuccess({
        addresses: [...zAddresses, ...transparentAddresses].map(add => ({
          address: add,
          balance: 0,
        })),
      }),
    );
  },
  updateVidulumNetwork: (newNetwork) => {
    electronStore.set(VIDULUM_NETWORK, newNetwork);

    electron.remote.app.relaunch({
      args: Array.from(new Set(electron.remote.process.argv.slice(1).concat(['--relaunch']))),
    });
    electron.remote.app.quit();
  },
});

// $FlowFixMe
export const SettingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsView);
