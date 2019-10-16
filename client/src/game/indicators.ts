import * as PIXI from 'pixi.js';
import { IndicatorPreset } from './models/indicator-preset';

const indicatorPreset: IndicatorPreset = {
  fontFamily: 'Courier',
  fontSize: 14,
  fill: 0xffffff,
  align: 'center',
};

const indicatorFactory = (
  x: number,
  y: number,
  z: 1 | 2 | 3 = 2,
  initialText: string = '',
): PIXI.Text => {
  const indicator = new PIXI.Text(initialText, indicatorPreset);
  indicator.position.x = x;
  indicator.position.y = y;
  indicator.zIndex = z;
  return indicator;
};

export const cartesianIndicator = indicatorFactory(10, 10);
export const tileIndicator = indicatorFactory(10, 30);

export const myContainerIndicator = indicatorFactory(10, 50);
export const myContainerParentIndicator = indicatorFactory(10, 70);

/**
 *
 * @param height of the canvas
 */
export const draggedIndicatorFactory = (height: number) =>
  indicatorFactory(10, height - 65);

export const dragIndicatorFactory = (height: number) =>
  indicatorFactory(10, height - 45);

export const orientationIndicatorFactory = (height: number) =>
  indicatorFactory(10, height - 25);
