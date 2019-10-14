import * as PIXI from 'pixi.js';
import { AssetKey, assetKeys, AssetCollection } from './models/assets';

export const assetPath = (key: AssetKey) => require(`../assets/${key}.png`);

export const assetLoader = () =>
  loadAssets(assetKeys.map(key => ({ name: key, url: assetPath(key) })));

const loadProgressHandler = (
  loader: PIXI.Loader,
  resource: PIXI.LoaderResource,
) => {
  // Display the file `url` currently being loaded
  console.log('loading: ' + resource.url);

  // Display the percentage of files currently loaded
  console.log('progress: ' + loader.progress + '%');

  // If you gave your files names as the first argument
  // of the `add` method, you can access them like this
  // console.log("loading: " + resource.name);
};

export const loadAssets = async (
  assetPaths: { name: AssetKey; url: string }[],
) =>
  new Promise<Partial<AssetCollection>>((res, rej) => {
    PIXI.Loader.shared
      .add(assetPaths)
      .on('progress', loadProgressHandler)
      .on('error', err => rej(err))
      .load((loader, resourcesLoaded) => res(resourcesLoaded));
  });
