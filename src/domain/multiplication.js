export const MIN_FACTOR = 1;
export const MAX_FACTOR = 10;

export function clampFactor(value) {
  return Math.max(MIN_FACTOR, Math.min(MAX_FACTOR, Number(value)));
}

export function calculateProduct(row, col) {
  return row * col;
}

export function calculatePitchFactor(row, col) {
  return Number((0.85 + ((row + col) / 40)).toFixed(4));
}

export function getCellHighlightClass(cellRow, cellCol, activeRow, activeCol) {
  if (cellRow === 0 && cellCol === 0) {
    return '';
  }

  if (cellRow === 0) {
    return cellCol === activeCol ? 'active-x' : '';
  }

  if (cellCol === 0) {
    return cellRow === activeRow ? 'active-y' : '';
  }

  if (cellRow === activeRow && cellCol === activeCol) {
    return 'intersection';
  }

  if (cellRow === activeRow && cellCol < activeCol) {
    return 'in-band-y';
  }

  if (cellCol === activeCol && cellRow < activeRow) {
    return 'in-band-x';
  }

  if (cellRow === activeRow || cellCol === activeCol) {
    return 'in-band-trail';
  }

  return '';
}
