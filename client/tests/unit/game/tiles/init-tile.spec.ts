import { gameConfigFactory } from '@/game/factories/game-config.factory';
import { GameConfig } from '@/game/models/game-config';
import { IsometricGraphic } from '@/game/models/isometric-graphic';
import { initTile } from '@/game/tiles/init-tile';
import * as PIXI from 'pixi.js';

describe('initTile', () => {
  const config: GameConfig = gameConfigFactory(100, 100, () => undefined, {
    mapRadius: 5,
    tileWidth: 1,
    tileGap: 0,
  });

  let tile: IsometricGraphic;

  beforeEach(() => (tile = initTile(0, 1, config)));

  it('should set corner coords successfully', () => {
    expect(tile.c1).toEqual([22, 12]);
    expect(tile.c2).toEqual([20, 13]);
    expect(tile.c3).toEqual([18, 12]);
    expect(tile.c4).toEqual([20, 11]);
  });

  it('should set hit area correctly', () => {
    expect(tile.hitArea).toEqual(
      new PIXI.Polygon([22, 12, 20, 13, 18, 12, 20, 11]),
    );
  });
});
