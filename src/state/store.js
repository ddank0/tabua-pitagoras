import { DEFAULT_QUIZ_FEEDBACK } from '../domain/quiz.js';

export function createInitialState() {
  return {
    row: 7,
    col: 8,
    soundEnabled: true,
    isDark: false,
    isDragging: false,
    quizActive: false,
    quizScore: 0,
    quizQuestion: {
      mode: 'find_factors',
      targetRow: null,
      targetCol: null,
      targetProduct: 56,
      promptText: 'Qual multiplicação resulta em 56? Deslize até o 56!'
    },
    quizFeedbackText: DEFAULT_QUIZ_FEEDBACK,
    quizFeedbackState: 'idle'
  };
}

export function createStore(initialState = createInitialState()) {
  let state = { ...initialState };
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(partialState) {
    const nextPatch = typeof partialState === 'function'
      ? partialState(state)
      : partialState;

    state = {
      ...state,
      ...nextPatch
    };

    listeners.forEach((listener) => listener(state));
    return state;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return {
    getState,
    setState,
    subscribe
  };
}
