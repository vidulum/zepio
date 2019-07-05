// @flow
import os from 'os';
import path from 'path';
import electron from 'electron'; // eslint-disable-line

export const getVidulumFolder = () => {
  const { app } = electron;

  if (os.platform() === 'darwin') {
    return path.join(app.getPath('appData'), 'Vidulum');
  }

  if (os.platform() === 'linux') {
    return path.join(app.getPath('home'), '.vidulum');
  }

  return path.join(app.getPath('appData'), 'Vidulum');
};
