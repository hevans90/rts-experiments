import * as PIXI from 'pixi.js';
import { IsometricSprite } from '../models/isometric-sprite';

export const mouseDownInteraction = (
  { data }: PIXI.interaction.InteractionEvent,
  myContainer: IsometricSprite,
) => ({
  dragIndicatorText: 'yay',
  dragging: true,
  draggedx: 0,
  draggedy: 0,
  delx: 0,
  dely: 0,
  velx: 0,
  vely: 0,
  newContainerScaleX:
    data.getLocalPosition(myContainer).x * myContainer.scale.x,
  newContainerScaleY:
    data.getLocalPosition(myContainer).y * myContainer.scale.y,
});
