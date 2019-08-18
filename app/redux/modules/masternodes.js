// @flow

import uniqBy from 'lodash.uniqby';
import type { Action } from '../../types/redux';
import type {
	Masternode,
	StartMasternodeResult
} from '../../components/masternode-item';

// Actions
export const LOAD_MASTERNODES = 'LOAD_MASTERNODES';
export const LOAD_MASTERNODES_SUCCESS = 'LOAD_MASTERNODES_SUCCESS';
export const LOAD_MASTERNODES_ERROR = 'LOAD_MASTERNODES_ERROR';
export const RESET_MASTERNODES_LIST = 'RESET_MASTERNODES_LIST';

export const START_MASTERNODES = 'START_MASTERNODES';
export const START_MASTERNODES_SUCCESS = 'START_MASTERNODES_SUCCESS';
export const START_MASTERNODES_ERROR = 'START_MASTERNODES_ERROR';

export type MasternodesList = { list: Masternode[] }[];

export const loadMasternodes = () => ({
	type: LOAD_MASTERNODES,
	payload: {}
});

export const loadMasternodesSuccess = ({
	list,
	hasNextPage
}: {
	list: Masternode[],
	hasNextPage: boolean
}) => ({
	type: LOAD_MASTERNODES_SUCCESS,
	payload: {
		list,
		hasNextPage
	}
});

export const loadMasternodesError = ({ error }: { error: string }) => ({
	type: LOAD_MASTERNODES_ERROR,
	payload: { error }
});

export const resetMasternodesList = () => ({
	type: RESET_MASTERNODES_LIST,
	payload: {}
});

export const startMasternodes = () => ({
	type: START_MASTERNODES,
	payload: {}
});

export const startMasternodesSuccess = ({
	result
}: {
	result: StartMasternodeResult
}) => ({
	type: START_MASTERNODES_SUCCESS,
	payload: {
		result
	}
});

export const startMasternodesError = ({ error }: { error: string }) => ({
	type: START_MASTERNODES_ERROR,
	payload: { error }
});

export type State = {
	isLoading: boolean,
	error: string | null,
	list: Masternode[],
	hasNextPage: boolean,
	result: StartMasternodeResult
};

const initialState = {
	list: [],
	error: null,
	isLoading: false,
	hasNextPage: true,
	result: null
};

// eslint-disable-next-line
export default (state: State = initialState, action: Action) => {
	switch (action.type) {
		case LOAD_MASTERNODES:
			return {
				...state,
				error: null,
				isLoading: true
			};
		case LOAD_MASTERNODES_SUCCESS:
			return {
				...state,
				...action.payload,
				list: uniqBy(
					state.list.concat(action.payload.list),
					mn => mn.txHash + mn.outIdx
				),
				isLoading: false,
				error: null
			};
		case LOAD_MASTERNODES_ERROR:
			return {
				...state,
				isLoading: false,
				error: action.payload.error
			};
		case RESET_MASTERNODES_LIST:
			return {
				...state,
				isLoading: false,
				error: null,
				list: []
			};
		case START_MASTERNODES:
			return {
				...state,
				error: null,
				isLoading: true
			};
		case START_MASTERNODES_SUCCESS:
			return {
				...state,
				...action.payload,
				result: action.payload.result,
				isLoading: false,
				error: null
			};
		case START_MASTERNODES_ERROR:
			return {
				...state,
				isLoading: false,
				error: action.payload.error
			};
		default:
			return state;
	}
};
