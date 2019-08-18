// @flow

import got from 'got';

type Payload = {
  [currency: string]: number,
};

/**
  WARNING:
  Just a super fast way to get the vdl price
*/
// eslint-disable-next-line
export default (currencies: string[] = ['USD']): Promise<Payload> => new Promise((resolve, reject) => {
  const ENDPOINT = 'https://api.coingecko.com/api/v3/simple/price?ids=vidulum&vs_currencies=USD';

  got(ENDPOINT)
    .then(response => resolve(JSON.parse(response.body).vidulum.usd))
    .catch(reject);
});
