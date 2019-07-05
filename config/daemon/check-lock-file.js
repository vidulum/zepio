// @flow
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import eres from 'eres';

import { getVidulumFolder } from './get-vidulum-folder';

const VIDULUM_LOCK_FILE = '.lock';

export const checkLockFile = async (vidulumPath?: string) => {
  try {
    const myPath = vidulumPath || getVidulumFolder();
    const [cannotAccess] = await eres(promisify(fs.access)(path.join(myPath, VIDULUM_LOCK_FILE)));
    return !cannotAccess;
  } catch (err) {
    return false;
  }
};
