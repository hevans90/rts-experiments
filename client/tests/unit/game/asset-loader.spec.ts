import { loadAssets } from '@/game/asset-loader';
import * as PIXI from 'pixi.js';
import mock from 'xhr-mock';

describe('asset loader', () => {
  // replace the real XHR object with the mock XHR object before each test
  beforeEach(() => {
    mock.setup();
    PIXI.Loader.shared.reset();
  });

  // put the real XHR object back and clear the mocks after each test
  afterEach(() => mock.teardown());

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const catAsset = require('@/assets/cat.png');

  it('should REJECT with a HTTP Error if the asset was not found', async () => {
    mock.get(catAsset, {
      status: 404,
      reason: 'Asset not found',
    });

    await expect(loadAssets([{ name: 'cat', url: catAsset }])).rejects.toEqual(
      new Error('[404] Asset not found: '),
    );
  });

  it('should RESOLVE with an asset if found', async () => {
    mock.get(catAsset, {
      status: 200,
      body: 'I am cat',
    });
    const { cat } = await loadAssets([{ name: 'cat', url: catAsset }]);

    expect(cat).toBeDefined();
    expect((cat as PIXI.ILoaderResource).data).toEqual('I am cat');
  });
});
