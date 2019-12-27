import * as PIXI from 'pixi.js';
import { GameConfig } from '../models/game-config';
import { IsometricGraphic } from '../models/isometric-graphic';

/**
 * Given a tile index, the layer and the mapRadius,
 * return the child **IsometricGraphic** representing the tile
 * @param i the **i** coordinate of the tile
 * @param j the **j** coordinate of the tile
 * @param layer the current layer a (**PIXI.Container**)
 * @param mapRadius the radius of the map
 */
export const getTileGraphic = (
  i: number,
  j: number,
  layer: PIXI.Container,
  { mapRadius }: GameConfig,
) => {
  const index = (i + mapRadius) * (2 * mapRadius + 1) + j + mapRadius;
  return layer.getChildAt(index) as IsometricGraphic;
};
