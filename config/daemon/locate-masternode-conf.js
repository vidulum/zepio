// @flow

import path from 'path';
import os from 'os';

import { app } from '../electron'; // eslint-disable-line

export const locateMasternodeConf = () => {
  if (os.platform() === 'darwin') {
    return path.join(app.getPath('appData'), 'Vidulum', 'masternode.conf');
  }

  if (os.platform() === 'linux') {
    return path.join(app.getPath('home'), '.vidulum', 'masternode.conf');
  }

  return path.join(app.getPath('appData'), 'Vidulum', 'masternode.conf');
};
