// @flow

import getVDLPrice from '../../services/vdl-price';

describe('VDL PRICE Services', () => {
  test('should return the right value', async () => {
    const response = await getVDLPrice(['BRL', 'EUR', 'USD']);

    expect(response).toEqual({
      USD: expect.any(Number),
      BRL: expect.any(Number),
      EUR: expect.any(Number),
    });
  });
});
