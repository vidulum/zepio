// @flow

import electronStore from './electron-store';
import { VIDULUM_NETWORK, MAINNET } from '../app/constants/vidulum-network';

export const isTestnet = () => electronStore.get(VIDULUM_NETWORK) !== MAINNET;
