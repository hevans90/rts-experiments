import * as PIXI from 'pixi.js';
import { GameConfig } from '../models/game-config';
import { IsometricStack } from '../models/isometric-stack';
import { isoToIndex } from '../utils/iso-to-index';

export const mouseDownInteraction = (
  { data }: PIXI.InteractionEvent,
  myContainer: IsometricStack,
  config: GameConfig,
) => {
  const { x, y } = data.getLocalPosition(myContainer);
  const [i, j] = isoToIndex(x, y, config);

  return {
    dragIndicatorText: 'yay',
    dragging: true,
    draggedx: 0,
    draggedy: 0,
    delx: 0,
    dely: 0,
    velx: 0,
    vely: 0,
    tileClicked: {
      i,
      j,
      x: x * myContainer.scale.x,
      y: y * myContainer.scale.y,
      z: 0,
    },
  };
};
