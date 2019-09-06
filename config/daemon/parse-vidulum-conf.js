// @flow

import fs from 'fs';

import { locateVidulumConf } from './locate-vidulum-conf';
import { filterObjectNullKeys } from '../../app/utils/filter-object-null-keys';

type VidulumConfFile = {
  testnet: ? string,
  regtest: ? string,
  proxy: ? string,
  bind: ? string,
  whitebind: ? string,
  addnode: ? string,
  connect: ? string,
  listen: ? string,
  maxconnections: ? string,
  server: ? string,
  rpcbind: ? string,
  rpcuser: ? string,
  rpcpassword: ? string,
  rpcclienttimeout: ? string,
  rpcallowip: ? string,
  rpcport: ? string,
  rpcconnect: ? string,
  sendfreetransactions: ? string,
  txconfirmtarget: ? string,
  gen: ? string,
  genproclimit: ? string,
  keypool: ? string,
  paytxfee: ? string,
  datadir ? : string,
  conf ? : string,
};

export const parseVidulumConf = (customDir: ? string): Promise < VidulumConfFile > => new Promise((resolve, reject) => {
  fs.readFile(customDir || locateVidulumConf(), (err, file) => {
    if (err) return reject(err);

    const fileString = file.toString();

    const payload: VidulumConfFile = filterObjectNullKeys(
      fileString.split('\n')
      .reduce((acc, cur) => {
        if (!cur) return acc;

        const line = cur.trim();

        if (line.startsWith('#')) return acc;

        const [key, value] = cur.split('=');
        return { ...acc, [key.trim()
            .toLowerCase()]: value.trim() };
      }, {}),
    );

    resolve(payload);
  });
});

///----------------------xxxx----------------/
export const generateArgsFromConf = (obj: VidulumConfFile): Array < string > => Object.keys(obj)
  .reduce((acc, key) => {
    // We can omit the credentials for the command line
    if (key === 'rpcuser' || key === 'rpcpassword') return acc;

    return acc.concat(`-${key}=${String(obj[key])}`);
  }, []);

type ParseCmdArgsPayload = {
  rpcuser: string,
  rpcpassword: string,
  rpcconnect: string,
  rpcport: string,
  testnet: string,
};

const ARGS = ['rpcuser', 'rpcpassword', 'testnet', 'rpcport', 'rpcconnect'];

export const parseCmdArgs = (cmd: string): ParseCmdArgsPayload => {
  const splitArgs = cmd.split(' ');

  return ARGS.reduce((acc, cur) => {
    const configKey = `-${cur}`;
    const inArgs = splitArgs.find(x => x.startsWith(configKey));

    return { ...acc, [cur]: inArgs ? inArgs.replace(`${configKey}=`, '') : '' };
  }, {});
};
