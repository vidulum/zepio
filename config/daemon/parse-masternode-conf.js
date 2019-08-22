// @flow

import fs from 'fs';

import { filterObjectNullKeys } from '../../app/utils/filter-object-null-keys';
import { locateMasternodeConf } from './locate-masternode-conf';

type MasternodeConfFile = {
  alias: ?string,
  ip: ?string,
  port: ?string,
  private_key: ?string,
  output_txid: ?string,
  output_index: ?string,
}[];

// eslint-disable-next-line
export const parseMasternodeConf = (customDir: ?string): Promise<MasternodeConfFile> => new Promise((resolve, reject) => {
  fs.readFile(customDir || locateMasternodeConf(), (err, file) => {
    if (err) return reject(err);

    const fileString = file.toString();

    /* eslint-disable no-unused-vars */
    // $FlowFixMe
    let count = 0;
    const payload: MasternodeConfFile = filterObjectNullKeys(
      fileString.split('\n').reduce((acc, cur) => {
        if (!cur) return acc;

        const line = cur.trim() || '';

        if (line.startsWith('#')) return acc;

        const [alias, ip_port, private_key, output_txid, output_index] = cur.split(' ');
        const [ip, port] = ip_port.split(':');
        const index = acc.length;
        return {
          ...acc,
          [count++]: {
            alias,
            ip,
            port,
            private_key,
            output_txid,
            output_index: output_index.trim() || '',
          },
        };
      }, {}),
    );

    resolve(payload);
  });
});
