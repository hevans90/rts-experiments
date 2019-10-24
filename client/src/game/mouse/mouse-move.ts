import * as PIXI from 'pixi.js';
import { GameConfig } from '../models/game-config';
import { IsometricStack, Tile } from '../models/isometric-sprite';
import { isoToIndex } from '../utils/iso-to-index';

export interface CoordsUpdate {
  cartesianIndicatorText: string;
  tileIndicatorText: string;
}

export interface PositionalUpdate {
  delx: number;
  dely: number;
  draggedx: number;
  draggedy: number;
  newContainerPositionX: number;
  newContainerPositionY: number;
  draggedIndicatorText: string;
  containerIndicatorText: string;
  containerParentIndicatorText: string;
}

export const isCoordsUpdate = (
  update: CoordsUpdate | PositionalUpdate,
): update is CoordsUpdate =>
  (update as CoordsUpdate).cartesianIndicatorText !== undefined &&
  (update as CoordsUpdate).tileIndicatorText !== undefined;

export const isPositionalUpdate = (
  update: CoordsUpdate | PositionalUpdate,
): update is PositionalUpdate =>
  (update as PositionalUpdate).delx !== undefined &&
  (update as PositionalUpdate).dely !== undefined;

export const mouseMoveInteraction = (
  { data }: PIXI.interaction.InteractionEvent,
  myContainer: IsometricStack,
  config: GameConfig,
  dragging: boolean,
  draggedx: number,
  draggedy: number,
  tileClicked?: Tile,
): CoordsUpdate | PositionalUpdate => {
  const newPosition = data.getLocalPosition(myContainer);
  const parentPosition = data.getLocalPosition(myContainer.parent);

  if (!dragging) {
    return {
      cartesianIndicatorText: `${newPosition.x.toFixed(
        2,
      )}, ${newPosition.y.toFixed(2)}`,

      tileIndicatorText: isoToIndex(
        newPosition.x,
        newPosition.y,
        config,
      ).toString(),
    };
  } else {
    const tileDragged = tileClicked || {
      x: 0,
      y: 0,
    };

    return {
      delx: myContainer.position.x,
      dely: myContainer.position.y,
      draggedx: draggedx + myContainer.position.x / 1000,
      draggedy: draggedy + myContainer.position.y / 1000,
      newContainerPositionX: parentPosition.x - tileDragged.x,
      newContainerPositionY: parentPosition.y - tileDragged.y,

      draggedIndicatorText: `dragged: { x: ${draggedx.toFixed(
        2,
      )}, y: ${draggedy.toFixed(2)}}`,

      containerIndicatorText: `myContainer = { x: ${(
        newPosition.x - tileDragged.x
      ).toFixed(2)}, y: ${(newPosition.y - tileDragged.y).toFixed(2)}}`,

      containerParentIndicatorText: `myContainer.parent = { x: ${data
        .getLocalPosition(myContainer.parent)
        .x.toFixed(2)}, y: ${data
        .getLocalPosition(myContainer.parent)
        .y.toFixed(2)} }`,
    };
  }
};
