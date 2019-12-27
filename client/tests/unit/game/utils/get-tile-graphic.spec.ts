import { GameConfig } from '@/game/models/game-config';
import { getTileGraphic } from '@/game/utils/get-tile-graphic';
import * as PIXI from 'pixi.js';

describe('getTileGraphic', () => {
  it('should throw an error if a tile does not exist at the specified coords', () => {
    expect(() =>
      getTileGraphic(0, 0, new PIXI.Container(), {
        mapRadius: 5,
      } as GameConfig),
    ).toThrow();
  });
});
