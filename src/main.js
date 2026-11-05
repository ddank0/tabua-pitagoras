import { clampFactor, calculatePitchFactor } from './domain/multiplication.js';
import { DEFAULT_QUIZ_FEEDBACK, createQuizQuestion, evaluateQuizAttempt } from './domain/quiz.js';
import { createInitialState, createStore } from './state/store.js';
import { createSoundEngine } from './audio/soundEngine.js';
import { createBoardView } from './ui/boardView.js';
import { createHeaderView } from './ui/headerView.js';
import { createQuizView } from './ui/quizView.js';
import { bindInputController } from './ui/inputController.js';

function initApplication() {
  const store = createStore(createInitialState());
  const soundEngine = createSoundEngine(() => store.getState().soundEnabled);

  const boardElement = document.getElementById('boardWell');
  const rulerHorizontalElement = document.getElementById('rulerHorizontal');
  const rulerVerticalElement = document.getElementById('rulerVertical');

  const boardView = createBoardView({
    boardElement,
    rulerHorizontalElement,
    rulerVerticalElement
  });

  const headerView = createHeaderView({
    casingElement: document.getElementById('instrumentCasing'),
    factorRowElement: document.getElementById('dispRow'),
    factorColElement: document.getElementById('dispCol'),
    productValueElement: document.getElementById('dispResult'),
    iconSoundOnElement: document.getElementById('iconSoundOn'),
    iconSoundOffElement: document.getElementById('iconSoundOff'),
    iconSunElement: document.getElementById('iconSun'),
    iconMoonElement: document.getElementById('iconMoon')
  });

  const quizView = createQuizView({
    quizToggleButton: document.getElementById('btnQuizMode'),
    quizButtonLabelElement: document.getElementById('quizBtnLabel'),
    quizBannerElement: document.getElementById('quizBanner'),
    quizPromptElement: document.getElementById('quizPromptText'),
    quizScoreElement: document.getElementById('quizScore'),
    quizFeedbackElement: document.getElementById('quizFeedback')
  });

  let nextQuestionTimeoutId = null;

  function selectCoordinates(targetRow, targetCol) {
    const currentState = store.getState();
    const nextRow = clampFactor(targetRow);
    const nextCol = clampFactor(targetCol);

    if (nextRow === currentState.row && nextCol === currentState.col) return;

    store.setState({ row: nextRow, col: nextCol });
    soundEngine.playMechanicalClick(calculatePitchFactor(nextRow, nextCol));
    soundEngine.triggerHapticPulse();
  }

  function startNextQuizQuestion() {
    store.setState({
      quizQuestion: createQuizQuestion(),
      quizFeedbackText: DEFAULT_QUIZ_FEEDBACK,
      quizFeedbackState: 'idle'
    });
  }

  const actions = {
    selectCoordinates,
    selectRow(targetRow) {
      selectCoordinates(targetRow, store.getState().col);
    },
    selectCol(targetCol) {
      selectCoordinates(store.getState().row, targetCol);
    },
    moveByDelta(rowDelta, colDelta) {
      const { row, col } = store.getState();
      selectCoordinates(row + rowDelta, col + colDelta);
    },
    setDragging(isDragging) {
      store.setState({ isDragging });
    },
    isDragging() {
      return store.getState().isDragging;
    },
    isQuizActive() {
      return store.getState().quizActive;
    },
    toggleSound() {
      const nextSoundEnabled = !store.getState().soundEnabled;
      store.setState({ soundEnabled: nextSoundEnabled });
      if (nextSoundEnabled) {
        soundEngine.playMechanicalClick(1.2);
      }
    },
    toggleTheme() {
      store.setState((prev) => ({ isDark: !prev.isDark }));
      soundEngine.playMechanicalClick(1.0);
    },
    toggleQuizMode() {
      if (nextQuestionTimeoutId) {
        clearTimeout(nextQuestionTimeoutId);
        nextQuestionTimeoutId = null;
      }

      const nextQuizActive = !store.getState().quizActive;
      if (nextQuizActive) {
        store.setState({
          quizActive: true,
          quizQuestion: createQuizQuestion(),
          quizFeedbackText: DEFAULT_QUIZ_FEEDBACK,
          quizFeedbackState: 'idle'
        });
      } else {
        store.setState({ quizActive: false });
      }

      soundEngine.playMechanicalClick(1.1);
      requestAnimationFrame(() => {
        const { row, col } = store.getState();
        boardView.positionRulers(row, col);
      });
    },
    skipQuizQuestion() {
      if (nextQuestionTimeoutId) {
        clearTimeout(nextQuestionTimeoutId);
        nextQuestionTimeoutId = null;
      }
      soundEngine.playMechanicalClick(0.9);
      startNextQuizQuestion();
    },
    verifyQuizAttempt() {
      const currentState = store.getState();
      if (!currentState.quizActive) return;

      const evaluation = evaluateQuizAttempt(
        currentState.quizQuestion,
        currentState.row,
        currentState.col,
        currentState.quizScore
      );

      store.setState({
        quizScore: evaluation.nextScore,
        quizFeedbackText: evaluation.feedbackText,
        quizFeedbackState: evaluation.feedbackState
      });

      if (evaluation.isCorrect) {
        soundEngine.playSuccessChord();
        if (nextQuestionTimeoutId) {
          clearTimeout(nextQuestionTimeoutId);
        }
        nextQuestionTimeoutId = setTimeout(() => {
          if (store.getState().quizActive) {
            startNextQuizQuestion();
          }
        }, 1400);
      } else {
        soundEngine.playMechanicalClick(0.6);
      }
    }
  };

  boardView.buildGrid();

  store.subscribe((nextState) => {
    headerView.render(nextState);
    quizView.render(nextState);
    boardView.render(nextState);
  });

  bindInputController({
    boardElement,
    soundToggleButton: document.getElementById('btnSound'),
    themeToggleButton: document.getElementById('btnTheme'),
    quizToggleButton: document.getElementById('btnQuizMode'),
    quizCheckButton: document.getElementById('btnCheckQuiz'),
    quizSkipButton: document.getElementById('btnSkipQuiz'),
    actions
  });

  window.addEventListener('resize', () => {
    const { row, col } = store.getState();
    boardView.positionRulers(row, col);
  });

  requestAnimationFrame(() => {
    const initialState = store.getState();
    headerView.render(initialState);
    quizView.render(initialState);
    boardView.render(initialState);
  });
}

initApplication();
