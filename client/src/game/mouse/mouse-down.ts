import * as PIXI from 'pixi.js';
import { IsometricStack } from '../models/isometric-sprite';

export const mouseDownInteraction = (
  { data }: PIXI.interaction.InteractionEvent,
  myContainer: IsometricStack,
) => ({
  dragIndicatorText: 'yay',
  dragging: true,
  draggedx: 0,
  draggedy: 0,
  delx: 0,
  dely: 0,
  velx: 0,
  vely: 0,
  selected: {
    x: data.getLocalPosition(myContainer).x * myContainer.scale.x,
    y: data.getLocalPosition(myContainer).y * myContainer.scale.y,
    z: 0,
  },
});
