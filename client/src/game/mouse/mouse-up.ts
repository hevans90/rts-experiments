import { GameConfig } from '../models/game-config';
import { IsometricSprite } from '../models/isometric-sprite';
import { isoToIndex } from '../utils/iso-to-index';

export const mouseUpInteraction = (
  draggedx: number,
  draggedy: number,
  setGraphicTileColor: (ij: any[] | number[], color: string) => void,
  myContainer: IsometricSprite,
  config: GameConfig,
  delx: number,
  dely: number,
) => {
  // if true, this will trigger a click rather than a drag
  const dragBreakpointCondition =
    Math.abs(draggedx) < 1 && Math.abs(draggedy) < 1;

  if (dragBreakpointCondition) {
    setGraphicTileColor(
      isoToIndex(myContainer.sx, myContainer.sy, config),
      '0xFF0000',
    );
  }

  return {
    dragIndicatorText: 'not dragging',
    draggedIndicatorText: '',
    dragged: dragBreakpointCondition
      ? {
          velx: Math.floor(myContainer.position.x - delx),
          vely: Math.floor(myContainer.position.y - dely),
          delx: 0,
          dely: 0,
        }
      : undefined,
  };
};
