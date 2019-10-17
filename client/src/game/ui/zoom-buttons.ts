import * as PIXI from 'pixi.js';
import { AssetCollection } from '../models/assets';
import { GameConfig } from '../models/game-config';

export const zoomButtonsFactory = (
  {
    'zoom-out': { texture: zoomOutTexture },
    'zoom-in': { texture: zoomInTexture },
  }: Pick<AssetCollection, 'zoom-in' | 'zoom-out'>,
  width: number,
  height: number,
  config: GameConfig,
): [PIXI.Sprite, PIXI.Sprite] => {
  const zoomInButtonSprite = new PIXI.Sprite(zoomInTexture);
  const zoomOutButtonSprite = new PIXI.Sprite(zoomOutTexture);

  zoomInButtonSprite.buttonMode = true;
  zoomOutButtonSprite.buttonMode = true;
  zoomInButtonSprite.interactive = true;
  zoomOutButtonSprite.interactive = true;

  zoomInButtonSprite.anchor.set(0.5);
  zoomOutButtonSprite.anchor.set(0.5);

  zoomInButtonSprite.position.x = width - 275;
  zoomInButtonSprite.position.y = height - 40;
  zoomInButtonSprite.zIndex = 2;

  zoomOutButtonSprite.position.x = width - 200;
  zoomOutButtonSprite.position.y = height - 40;
  zoomOutButtonSprite.zIndex = 2;

  zoomInButtonSprite.on('click', () => config.increaseScale());
  zoomInButtonSprite.on('touch', () => config.increaseScale());

  zoomOutButtonSprite.on('click', () => config.decreaseScale());
  zoomOutButtonSprite.on('touch', () => config.decreaseScale());

  return [zoomInButtonSprite, zoomOutButtonSprite];
};
