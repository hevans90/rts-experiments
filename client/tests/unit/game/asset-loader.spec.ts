import { loadAssets } from '@/game/asset-loader';
import mock from 'xhr-mock';

describe('asset loader', () => {
  // replace the real XHR object with the mock XHR object before each test
  beforeEach(() => mock.setup());

  // put the real XHR object back and clear the mocks after each test
  afterEach(() => mock.teardown());

  it('should do something', async () => {
    await expect(
      loadAssets([{ name: 'cat', url: require('@/assets/cat.png') }]),
    ).rejects.toEqual(new Error());
  });
});
