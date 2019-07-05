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
  const ENDPOINT = `https://min-api.cryptocompare.com/data/price?fsym=VDL&tsyms=${currencies.join(
    ',',
  )}&api_key=${String(process.env.VDL_PRICE_API_KEY)}`;

  got(ENDPOINT)
    .then(response => resolve(JSON.parse(response.body)))
    .catch(reject);
});
