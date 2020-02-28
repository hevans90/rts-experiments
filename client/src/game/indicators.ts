import * as PIXI from 'pixi.js';
import { IndicatorPreset } from './models/indicator-preset';

export enum IndicatorColor {
  white = 0xffffff,
  green = 0x00ff00,
}

const indicatorPreset: IndicatorPreset = {
  fontFamily: 'Courier',
  fontSize: 14,
  fill: IndicatorColor.white,
  align: 'center',
};

const indicatorFactory = (
  x: number,
  y: number,
  initialText = '',
  z: 1 | 2 | 3 = 2,
): PIXI.Text => {
  const indicator = new PIXI.Text(initialText, indicatorPreset);
  indicator.position.x = x;
  indicator.position.y = y;
  indicator.zIndex = z;
  return indicator;
};

// top left indicators
export const cartesianIndicator = indicatorFactory(10, 10);
export const tileIndicator = indicatorFactory(10, 30);
export const mapVelocityIndicator = indicatorFactory(10, 50, 'Velocity: ');
export const myContainerIndicator = indicatorFactory(10, 70);
export const myContainerParentIndicator = indicatorFactory(10, 90);
export const selectedIndicator = indicatorFactory(10, 120, 'Selected: ');
export const oldSelectedIndicator = indicatorFactory(
  10,
  150,
  'Prev. Selected: ',
);

// bottom left indicators
export const draggedIndicatorFactory = (height: number) =>
  indicatorFactory(10, height - 65);

export const dragIndicatorFactory = (height: number) =>
  indicatorFactory(10, height - 45);

export const orientationIndicatorFactory = (height: number) =>
  indicatorFactory(10, height - 25);

// bottom right indicators
export const upArrowIndicatorFactory = (height: number, width: number) =>
  indicatorFactory(width - 100, height - 65, ' UP');

export const downArrowIndicatorFactory = (height: number, width: number) =>
  indicatorFactory(width - 100, height - 25, 'DOWN');

export const leftArrowIndicatorFactory = (height: number, width: number) =>
  indicatorFactory(width - 145, height - 45, 'LEFT');

export const rightArrowIndicatorFactory = (height: number, width: number) =>
  indicatorFactory(width - 55, height - 45, 'RIGHT');
