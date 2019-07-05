// @flow

import { isTestnet } from '../../config/is-testnet';

export const VIDULUM_EXPLORER_BASE_URL = isTestnet()
  ? 'https://exp.vidulum.app/tx/'
  : 'https://exp.vidulum.app/tx/';
