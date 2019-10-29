import * as PIXI from 'pixi.js';
import { GameConfig } from '../models/game-config';
import { IsometricGraphic } from '../models/isometric-graphic';

export const getTile = (
  i: number,
  j: number,
  layer: PIXI.Container,
  { mapRadius }: GameConfig,
) => {
  const num = (i + mapRadius) * (2 * mapRadius + 1) + j + mapRadius;
  return layer.getChildAt(num) as IsometricGraphic;
};
