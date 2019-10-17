import * as PIXI from 'pixi.js';

export const assetKeys = ['dirt_tile', 'cat', 'zoom-in', 'zoom-out'] as const;

type AssetTuple = typeof assetKeys;

export type AssetKey = AssetTuple[number];

export type AssetCollection = {
  [key in AssetKey]: PIXI.LoaderResource;
};
