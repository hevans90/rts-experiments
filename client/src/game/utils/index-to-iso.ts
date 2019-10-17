export const indexToIso = (
  i: number,
  j: number,
  scale: number,
  tileWidth: number,
  offsetX: number,
  offsetY: number,
  rotation: number,
  ai: number,
): [number, number] => {
  const x = offsetX + (i - j * rotation) * scale * tileWidth;
  const y = offsetY + ((j + i * rotation) * scale * tileWidth) / ai;
  return [x, y];
};
