const ARROW_DELTAS = {
  ArrowUp: { rowDelta: -1, colDelta: 0 },
  ArrowDown: { rowDelta: 1, colDelta: 0 },
  ArrowLeft: { rowDelta: 0, colDelta: -1 },
  ArrowRight: { rowDelta: 0, colDelta: 1 }
};

export function bindInputController({
  boardElement,
  soundToggleButton,
  themeToggleButton,
  quizToggleButton,
  quizCheckButton,
  quizSkipButton,
  actions
}) {
  function resolveCellCoordinatesFromEvent(event) {
    const targetElement = event.target.closest('.cell');
    if (!targetElement) return null;

    const cellRow = Number(targetElement.dataset.row);
    const cellCol = Number(targetElement.dataset.col);

    if (Number.isNaN(cellRow) || Number.isNaN(cellCol)) return null;
    if (cellRow === 0 && cellCol === 0) return null;

    return { cellRow, cellCol };
  }

  function applyCellSelection({ cellRow, cellCol }) {
    if (cellRow === 0) {
      actions.selectCol(cellCol);
      return;
    }

    if (cellCol === 0) {
      actions.selectRow(cellRow);
      return;
    }

    actions.selectCoordinates(cellRow, cellCol);
  }

  boardElement.addEventListener('pointerdown', (event) => {
    const coords = resolveCellCoordinatesFromEvent(event);
    if (!coords) return;

    event.preventDefault();
    actions.setDragging(true);
    applyCellSelection(coords);
  });

  boardElement.addEventListener('pointerover', (event) => {
    if (!actions.isDragging()) return;
    const coords = resolveCellCoordinatesFromEvent(event);
    if (!coords) return;

    applyCellSelection(coords);
  });

  boardElement.addEventListener('touchmove', (event) => {
    if (!actions.isDragging() || event.touches.length === 0) return;

    const touch = event.touches[0];
    const hoveredElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!hoveredElement) return;

    const cellElement = hoveredElement.closest('.cell');
    if (!cellElement || !boardElement.contains(cellElement)) return;

    const cellRow = Number(cellElement.dataset.row);
    const cellCol = Number(cellElement.dataset.col);
    if (cellRow === 0 && cellCol === 0) return;

    event.preventDefault();
    applyCellSelection({ cellRow, cellCol });
  }, { passive: false });

  window.addEventListener('pointerup', () => {
    if (actions.isDragging()) {
      actions.setDragging(false);
    }
  });

  window.addEventListener('pointercancel', () => {
    if (actions.isDragging()) {
      actions.setDragging(false);
    }
  });

  window.addEventListener('keydown', (event) => {
    const delta = ARROW_DELTAS[event.key];
    if (delta) {
      event.preventDefault();
      actions.moveByDelta(delta.rowDelta, delta.colDelta);
      return;
    }

    if (event.key === 'Enter' && actions.isQuizActive()) {
      event.preventDefault();
      actions.verifyQuizAttempt();
    }
  });

  soundToggleButton.addEventListener('click', actions.toggleSound);
  themeToggleButton.addEventListener('click', actions.toggleTheme);
  quizToggleButton.addEventListener('click', actions.toggleQuizMode);
  quizCheckButton.addEventListener('click', actions.verifyQuizAttempt);
  quizSkipButton.addEventListener('click', actions.skipQuizQuestion);
}
