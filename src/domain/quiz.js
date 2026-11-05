import { calculateProduct } from './multiplication.js';

export const QUIZ_POINTS_PER_HIT = 10;
export const DEFAULT_QUIZ_FEEDBACK = 'Deslize as réguas até o cruzamento correto e clique em Verificar.';

export function createQuizQuestion(randomFn = Math.random) {
  const row = Math.floor(randomFn() * 9) + 2;
  const col = Math.floor(randomFn() * 9) + 2;
  const targetProduct = calculateProduct(row, col);
  const mode = randomFn() > 0.45 ? 'find_product' : 'find_factors';

  if (mode === 'find_product') {
    return {
      mode,
      targetRow: row,
      targetCol: col,
      targetProduct,
      promptText: `Quanto é ${row} × ${col}? Posicione na linha ${row} e coluna ${col}!`
    };
  }

  return {
    mode,
    targetRow: null,
    targetCol: null,
    targetProduct,
    promptText: `Qual multiplicação resulta em ${targetProduct}? Deslize até o ${targetProduct}!`
  };
}

export function evaluateQuizAttempt(question, currentRow, currentCol, currentScore) {
  const currentProduct = calculateProduct(currentRow, currentCol);
  const isExactCoordinateMatch = question.targetRow !== null
    ? (currentRow === question.targetRow && currentCol === question.targetCol)
    : (currentProduct === question.targetProduct);

  if (isExactCoordinateMatch || currentProduct === question.targetProduct) {
    return {
      isCorrect: true,
      nextScore: currentScore + QUIZ_POINTS_PER_HIT,
      feedbackState: 'success',
      feedbackText: `Excelente! ${currentRow} × ${currentCol} = ${currentProduct}. Preparando próximo desafio...`
    };
  }

  return {
    isCorrect: false,
    nextScore: currentScore,
    feedbackState: 'error',
    feedbackText: `Quase lá! Você está em ${currentRow} × ${currentCol} = ${currentProduct}. Continue deslizando!`
  };
}
