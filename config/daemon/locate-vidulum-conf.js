// @flow

import path from 'path';
import os from 'os';

import { app } from '../electron'; // eslint-disable-line

export const locateVidulumConf = () => {
  if (os.platform() === 'darwin') {
    return path.join(app.getPath('appData'), 'Vidulum', 'vidulum.conf');
  }

  if (os.platform() === 'linux') {
    return path.join(app.getPath('home'), '.vidulum', 'vidulum.conf');
  }

  return path.join(app.getPath('appData'), 'Vidulum', 'vidulum.conf');
};
