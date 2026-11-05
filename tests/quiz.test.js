import test from 'node:test';
import assert from 'node:assert/strict';
import {
  QUIZ_POINTS_PER_HIT,
  createQuizQuestion,
  evaluateQuizAttempt
} from '../src/domain/quiz.js';

test('createQuizQuestion builds a find_product challenge when modeSelector > 0.45', () => {
  const question = createQuizQuestion(() => 0.6);
  assert.equal(question.mode, 'find_product');
  assert.ok(question.targetRow >= 2 && question.targetRow <= 10);
  assert.ok(question.targetCol >= 2 && question.targetCol <= 10);
  assert.equal(question.targetProduct, question.targetRow * question.targetCol);
  assert.match(question.promptText, /Quanto é/);
});

test('createQuizQuestion builds a find_factors challenge when modeSelector <= 0.45', () => {
  const question = createQuizQuestion(() => 0.2);
  assert.equal(question.mode, 'find_factors');
  assert.equal(question.targetRow, null);
  assert.equal(question.targetCol, null);
  assert.ok(question.targetProduct >= 4 && question.targetProduct <= 100);
  assert.match(question.promptText, /Qual multiplicação resulta em/);
});

test('evaluateQuizAttempt awards points on exact or commutative product match', () => {
  const question = {
    mode: 'find_product',
    targetRow: 6,
    targetCol: 7,
    targetProduct: 42
  };

  const successResult = evaluateQuizAttempt(question, 7, 6, 20);
  assert.equal(successResult.isCorrect, true);
  assert.equal(successResult.nextScore, 20 + QUIZ_POINTS_PER_HIT);
  assert.match(successResult.feedbackText, /Excelente!/);

  const failResult = evaluateQuizAttempt(question, 5, 8, 20);
  assert.equal(failResult.isCorrect, false);
  assert.equal(failResult.nextScore, 20);
  assert.match(failResult.feedbackText, /Quase lá!/);
});
