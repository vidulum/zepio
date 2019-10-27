// @flow

import eres from 'eres';
import { connect } from 'react-redux';

import { MasternodesView } from '../views/masternodes';
import {
  loadMasternodes,
  loadMasternodesSuccess,
  loadMasternodesError,
  resetMasternodesList,
  startMasternodes,
  startMasternodesSuccess,
  startMasternodesError,
} from '../redux/modules/masternodes';
import rpc from '../../services/api';

import { sortBy } from '../utils/sort-by';

import type { AppState } from '../types/app-state';
import type { Dispatch } from '../types/redux';
import type { Masternode, StartMasternodeResult } from '../components/masternode-item';

const mapStateToProps = ({ masternodes }: AppState) => ({
  masternodes: masternodes.list,
  isLoading: masternodes.isLoading,
  error: masternodes.error,
  hasNextPage: masternodes.hasNextPage,
  startMasternodesResult: masternodes.result,
});

export type MapStateToProps = {
  masternodes: Masternode[],
  startMasternodeResult: StartMasternodeResult,
  isLoading: boolean,
  error: string | null,
  hasNextPage: boolean,
};

export type MapDispatchToProps = {|
  getMasternodes: ({
    offset: number,
    count: number,
  }) => Promise<void>,
  resetMasternodesList: () => void,
  triggerStartAlias: ({
    set: string,
    alias: string,
  }) => Promise<void>,
|};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => ({
  resetMasternodesList: () => dispatch(resetMasternodesList()),
  getMasternodes: async () => {
    dispatch(loadMasternodes());

    const [masternodesErr, masternodes = []] = await eres(rpc.listmasternodes());

    if (masternodesErr) {
      return dispatch(loadMasternodesError({ error: masternodesErr.message }));
    }

    const formattedMasternodes = sortBy('rank')(
      [
        ...masternodes,
      ].map(masternode => ({
        rank: masternode.rank,
        network: masternode.network,
        // ip: masternode.ip, // TODO: after vita is live
        txHash: masternode.txhash,
        outIdx: masternode.outidx,
        status: masternode.status,
        addr: masternode.addr,
        lastSeen: new Date(masternode.lastseen * 1000).toISOString(),
        activeTime: masternode.activetime,
        lastPaid: (masternode.lastpaid === 0) ? 0 : new Date(masternode.lastpaid * 1000).toISOString(),
      })),
    );

    dispatch(
      loadMasternodesSuccess({
        list: formattedMasternodes,
        hasNextPage: Boolean(formattedMasternodes.length),
      }),
    );
  },
  triggerStartAlias: async (alias: String) => {
    dispatch(startMasternodes());
    const [masternodesErr, masternodesResult] = await eres(rpc.startalias(alias));
    if (masternodesErr || !masternodesResult) {
      return dispatch(startMasternodesError({
        error: masternodesErr.message,
      }));
    }

    dispatch(
      startMasternodesSuccess({
        result: masternodesResult,
      }),
    );
  },
});

// $FlowFixMe
export const MasternodesContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MasternodesView);
