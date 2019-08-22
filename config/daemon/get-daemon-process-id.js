// @flow
import fs from 'fs';
import path from 'path';
import { getVidulumFolder } from './get-vidulum-folder';

const VIDULUM_PID_FILE = 'vidulumd.pid';

export const getDaemonProcessId = (vidulumPath?: string) => {
  try {
    const myPath = vidulumPath || getVidulumFolder();
    const buffer = fs.readFileSync(path.join(myPath, VIDULUM_PID_FILE));
    const pid = Number(buffer.toString().trim() || '');
    return pid;
  } catch (err) {
    return null;
  }
};
