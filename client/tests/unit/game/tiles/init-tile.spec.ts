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
  const { scale } = config;

  beforeEach(() => (tile = initTile(0, 1, config)));

  it('should set corner coords successfully', () => {
    expect(tile.c1).toEqual([11, 6].map(i => i * scale));
    expect(tile.c2).toEqual([10, 6.5].map(i => i * scale));
    expect(tile.c3).toEqual([9, 6].map(i => i * scale));
    expect(tile.c4).toEqual([10, 5.5].map(i => i * scale));
  });

  it('should set hit area correctly', () => {
    expect(tile.hitArea).toEqual(
      new PIXI.Polygon([11, 6, 10, 6.5, 9, 6, 10, 5.5].map(i => i * scale)),
    );
  });
});
