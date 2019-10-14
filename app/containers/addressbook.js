// @flow

import eres from 'eres';
import { connect } from 'react-redux';

import { AddressBookView } from '../views/address_book';

import {
  loadAddresses,
  loadAddressesSuccess,
  loadAddressesError,
  type addressType,
} from '../redux/modules/receive';

import { asyncMap } from '../utils/async-map';
import { getLatestAddressKey } from '../utils/get-latest-address-key';

import rpc from '../../services/api';
import electronStore from '../../config/electron-store';

import type { AppState } from '../types/app-state';
import type { Dispatch, FetchState } from '../types/redux';

export type MapStateToProps = {|
  fetchState: FetchState,
  addresses: { address: string, balance: number }[],
|};

const mapStateToProps = ({ receive }: AppState): MapStateToProps => ({
  addresses: receive.addresses,
  fetchState: receive.fetchState,
});

export type MapDispatchToProps = {|
  loadAddresses: () => Promise<*>,
|};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => ({
  loadAddresses: async () => {
    dispatch(loadAddresses());

    const [blockHeightErr, blockHeight] = await eres(rpc.getblockcount());

    const [zAddressesErr, zAddresses] = await eres(rpc.z_listaddresses());

    const [vAddressesErr, transparentAddresses] = await eres(rpc.getaddressesbyaccount(''));

    if (zAddressesErr || vAddressesErr) return dispatch(loadAddressesError({ error: 'Something went wrong!' }));

    const latestZAddress = zAddresses.find(addr => addr === electronStore.get(getLatestAddressKey('shielded')))
      || zAddresses[0];

    const latestTAddress = transparentAddresses.find(
      addr => addr === electronStore.get(getLatestAddressKey('transparent')),
    ) || transparentAddresses[0];

    // I am being very laxy TODO: stop being so lazy
    let allAddresses;
    if (blockHeight < 430000) {
      allAddresses = await asyncMap(
        [
          ...zAddresses.filter(cur => cur !== latestZAddress && cur.startsWith('zc')),
          ...transparentAddresses.filter(cur => cur !== latestTAddress),
        ],
        async (address) => {
          const [err, response] = await eres(rpc.z_getbalance(address));

          // Show all addresses in receive view
          // if (!err && new BigNumber(response).isGreaterThan(0)) return { address, balance: response };
          return { address, balance: response };
        },
      );
    } else {
      allAddresses = await asyncMap(
        [
          ...zAddresses.filter(cur => cur !== latestZAddress),
          ...transparentAddresses.filter(cur => cur !== latestTAddress),
        ],
        async (address) => {
          const [err, response] = await eres(rpc.z_getbalance(address));

          // Show all addresses in receive view
          // if (!err && new BigNumber(response).isGreaterThan(0)) return { address, balance: response };
          return { address, balance: response };
        },
      );
    }

    dispatch(
      loadAddressesSuccess({
        addresses: [
          latestZAddress
            ? {
              address: latestZAddress,
              balance: await rpc.z_getbalance(latestZAddress)
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

});

// $FlowFixMe
export const AddressBookContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressBookView);
