export function createQuizView({
  quizToggleButton,
  quizButtonLabelElement,
  quizBannerElement,
  quizPromptElement,
  quizScoreElement,
  quizFeedbackElement
}) {
  function render(state) {
    const {
      quizActive,
      quizScore,
      quizQuestion,
      quizFeedbackText,
      quizFeedbackState
    } = state;

    quizBannerElement.classList.toggle('is-hidden', !quizActive);
    quizToggleButton.classList.toggle('active-quiz', quizActive);
    quizButtonLabelElement.textContent = quizActive ? 'Sair do Desafio' : 'Desafio';

    quizPromptElement.textContent = quizQuestion.promptText;
    quizScoreElement.textContent = String(quizScore);
    quizFeedbackElement.textContent = quizFeedbackText;

    quizFeedbackElement.className = 'quiz-feedback';
    if (quizFeedbackState === 'success') {
      quizFeedbackElement.classList.add('success');
    } else if (quizFeedbackState === 'error') {
      quizFeedbackElement.classList.add('error');
    }
  }

  return {
    render
  };
}
