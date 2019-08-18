// @flow
import { FETCH_STATE } from '../../constants/fetch-states';

import type { Action, FetchState } from '../../types/redux';
import type { TransactionsList } from './transactions';

// Actions
export const LOAD_WALLET_SUMMARY = 'LOAD_WALLET_SUMMARY';
export const LOAD_WALLET_SUMMARY_SUCCESS = 'LOAD_WALLET_SUMMARY_SUCCESS';
export const LOAD_WALLET_SUMMARY_ERROR = 'LOAD_WALLET_SUMMARY_ERROR';

// Actions Creators
export const loadWalletSummary: () => Action = () => ({
  type: LOAD_WALLET_SUMMARY,
  payload: {},
});

export const loadWalletSummarySuccess = ({
  total,
  shielded,
  generated,
  immature,
  transparent,
  unconfirmed,
  addresses,
  transactions,
  vdlPrice,
}: {
  total: number,
  shielded: number,
  generated: Number,
  immature:number,
  transparent: number,
  unconfirmed: number,
  addresses: string[],
  transactions: TransactionsList,
  vdlPrice: number,
}) => ({
  type: LOAD_WALLET_SUMMARY_SUCCESS,
  payload: {
    total,
    shielded,
    generated,
    immature,
    transparent,
    unconfirmed,
    addresses,
    transactions,
    vdlPrice,
  },
});

export const loadWalletSummaryError = ({ error }: { error: string }) => ({
  type: LOAD_WALLET_SUMMARY_ERROR,
  payload: { error },
});

export type State = {
  total: number,
  shielded: number,
  generated: number,
  immature:number,
  transparent: number,
  unconfirmed: number,
  error: string | null,
  vdlPrice: number,
  addresses: string[],
  transactions: TransactionsList,
  fetchState: FetchState,
};

const initialState = {
  total: 0,
  shielded: 0,
  generated: 0,
  immature: 0,
  transparent: 0,
  unconfirmed: 0,
  error: null,
  vdlPrice: 0,
  addresses: [],
  transactions: [],
  fetchState: FETCH_STATE.INITIALIZING,
};

// eslint-disable-next-line
export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_WALLET_SUMMARY:
      return {
        ...state,
        fetchState: action.fetchState,
      };
    case LOAD_WALLET_SUMMARY_SUCCESS:
      return {
        ...state,
        ...action.payload,
        fetchState: 'SUCCESS',
        error: null,
      };
    case LOAD_WALLET_SUMMARY_ERROR:
      return {
        ...state,
        fetchState: 'ERROR',
        error: action.payload.error,
      };
    default:
      return state;
  }
};
