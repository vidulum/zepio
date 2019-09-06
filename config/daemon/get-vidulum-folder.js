// @flow
import os from 'os';
import path from 'path';
import electron from 'electron';

export const getVidulumFolder = () => {
  const { app } = electron;

  if (os.platform() === 'darwin') {
    return path.join(app.getPath('appData'), 'Vidulum');
  }

  if (os.platform() === 'linux') {
    return path.join(app.getPath('home'), '.vidulum');
  }

  if (os.platform() === 'win32') {
    return path.join(app.getPath('appData'), 'Vidulum');
  }
};
