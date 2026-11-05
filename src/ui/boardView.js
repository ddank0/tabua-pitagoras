import { MAX_FACTOR, calculateProduct, getCellHighlightClass } from '../domain/multiplication.js';

const HIGHLIGHT_CLASSES = [
  'active-x',
  'active-y',
  'in-band-x',
  'in-band-y',
  'in-band-trail',
  'intersection'
];

export function createBoardView({ boardElement, rulerHorizontalElement, rulerVerticalElement }) {
  const cellElementsByKey = new Map();

  function buildGrid() {
    for (let row = 0; row <= MAX_FACTOR; row++) {
      for (let col = 0; col <= MAX_FACTOR; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);

        if (row === 0 && col === 0) {
          cell.classList.add('cell-hdr', 'cell-corner');
          cell.textContent = '×';
        } else if (row === 0) {
          cell.classList.add('cell-hdr');
          cell.textContent = String(col);
        } else if (col === 0) {
          cell.classList.add('cell-hdr');
          cell.textContent = String(row);
        } else {
          cell.textContent = String(calculateProduct(row, col));
        }

        cellElementsByKey.set(`${row}-${col}`, cell);
        boardElement.appendChild(cell);
      }
    }
  }

  function positionRulers(activeRow, activeCol) {
    const rowHeader = cellElementsByKey.get(`${activeRow}-0`);
    const rowEnd = cellElementsByKey.get(`${activeRow}-${MAX_FACTOR}`);
    const colHeader = cellElementsByKey.get(`0-${activeCol}`);
    const colEnd = cellElementsByKey.get(`${MAX_FACTOR}-${activeCol}`);

    if (rowHeader && rowEnd && rulerHorizontalElement) {
      const top = rowHeader.offsetTop - 2;
      const left = rowHeader.offsetLeft - 2;
      const width = (rowEnd.offsetLeft + rowEnd.offsetWidth) - rowHeader.offsetLeft + 4;
      const height = rowHeader.offsetHeight + 4;

      rulerHorizontalElement.style.width = `${width}px`;
      rulerHorizontalElement.style.height = `${height}px`;
      rulerHorizontalElement.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    }

    if (colHeader && colEnd && rulerVerticalElement) {
      const top = colHeader.offsetTop - 2;
      const left = colHeader.offsetLeft - 2;
      const width = colHeader.offsetWidth + 4;
      const height = (colEnd.offsetTop + colEnd.offsetHeight) - colHeader.offsetTop + 4;

      rulerVerticalElement.style.width = `${width}px`;
      rulerVerticalElement.style.height = `${height}px`;
      rulerVerticalElement.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    }
  }

  function render(state) {
    const { row: activeRow, col: activeCol } = state;

    for (let row = 0; row <= MAX_FACTOR; row++) {
      for (let col = 0; col <= MAX_FACTOR; col++) {
        const cell = cellElementsByKey.get(`${row}-${col}`);
        if (!cell) continue;

        cell.classList.remove(...HIGHLIGHT_CLASSES);
        const roleClass = getCellHighlightClass(row, col, activeRow, activeCol);

        if (roleClass) {
          cell.classList.add(roleClass);
        }
      }
    }

    positionRulers(activeRow, activeCol);
  }

  return {
    buildGrid,
    render,
    positionRulers
  };
}
