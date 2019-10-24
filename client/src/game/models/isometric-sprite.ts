import * as PIXI from 'pixi.js';

export interface Tile {
  i: number;
  j: number;
  z: number;

  x: number;
  y: number;
}

export type IsometricStack = PIXI.Sprite & {
  sx: number;
  sy: number;
  selected: Tile | undefined;
};
