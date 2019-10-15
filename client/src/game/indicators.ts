import * as PIXI from 'pixi.js';
import { IndicatorPreset } from './models/indicator-preset';

const indicatorPreset: IndicatorPreset = {
  fontFamily: 'Arial',
  fontSize: 18,
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

export const cartesianIndicator = indicatorFactory(10, 0);
export const tileIndicator = indicatorFactory(10, 30);
export const dragIndicator = indicatorFactory(10, 60);
export const cameraIndicator1 = indicatorFactory(10, 90);
export const cameraIndicator2 = indicatorFactory(10, 120);
export const cameraIndicator3 = indicatorFactory(10, 150);
export const cameraIndicator4 = indicatorFactory(10, 180);
export const orientationIndicatorFactory = (height: number) =>
  indicatorFactory(10, height - 30);
