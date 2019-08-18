// @flow

import { isTestnet } from '../../config/is-testnet';

export const VIDULUM_EXPLORER_BASE_URL = isTestnet()
    ? 'https://vdlt-explorer.vidulum.app/tx/'
    : 'https://explorer.vidulum.app/tx/';

