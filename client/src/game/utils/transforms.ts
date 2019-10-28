export const isoToIndex = (
  x: number,
  y: number,
  scale: number,
  tileWidth: number,
  offsetX: number,
  offsetY: number,
  rotation: number,
  ai: number,
) => {
  const b = scale * tileWidth;

  const s = x - offsetX;
  const t = y - offsetY;

  let j = (((t - (s * rotation) / ai) / (1 + rotation * rotation)) * ai) / b;
  let i = (s + j * b * rotation) / b;

  i = Math.floor(i);
  j = Math.floor(j);
  return [i, j];
};

export const indexToIso = (
  i: number,
  j: number,
  offsetX: number,
  offsetY: number,
  scale: number,
  rotation: number,
  ai: number,
  tileWidth: number,
) => {
  const x = offsetX + (i - j * rotation) * scale * tileWidth;
  const y = offsetY + ((j + i * rotation) * scale * tileWidth) / ai;
  return [x, y];
};
