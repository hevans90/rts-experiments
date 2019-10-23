import * as PIXI from 'pixi.js';

export interface Tile {
  x: number;
  y: number;
  z: number;
}

export type IsometricStack = PIXI.Sprite & {
  sx: number;
  sy: number;
  selected: Tile | undefined;
};
