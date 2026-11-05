import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MIN_FACTOR,
  MAX_FACTOR,
  clampFactor,
  calculateProduct,
  calculatePitchFactor,
  getCellHighlightClass
} from '../src/domain/multiplication.js';

test('clampFactor restricts values between MIN_FACTOR and MAX_FACTOR', () => {
  assert.equal(clampFactor(0), MIN_FACTOR);
  assert.equal(clampFactor(-5), MIN_FACTOR);
  assert.equal(clampFactor(11), MAX_FACTOR);
  assert.equal(clampFactor(7), 7);
});

test('calculateProduct returns the multiplication of row and col', () => {
  assert.equal(calculateProduct(7, 8), 56);
  assert.equal(calculateProduct(1, 10), 10);
  assert.equal(calculateProduct(10, 10), 100);
});

test('calculatePitchFactor scales pitch proportionally to factor sum', () => {
  const lowPitch = calculatePitchFactor(1, 1);
  const highPitch = calculatePitchFactor(10, 10);
  assert.ok(highPitch > lowPitch);
  assert.equal(lowPitch, 0.9);
  assert.equal(highPitch, 1.35);
});

test('getCellHighlightClass identifies headers, bands, trails and intersection', () => {
  assert.equal(getCellHighlightClass(0, 8, 7, 8), 'active-x');
  assert.equal(getCellHighlightClass(7, 0, 7, 8), 'active-y');
  assert.equal(getCellHighlightClass(0, 3, 7, 8), '');
  assert.equal(getCellHighlightClass(7, 8, 7, 8), 'intersection');
  assert.equal(getCellHighlightClass(7, 4, 7, 8), 'in-band-y');
  assert.equal(getCellHighlightClass(3, 8, 7, 8), 'in-band-x');
  assert.equal(getCellHighlightClass(7, 10, 7, 8), 'in-band-trail');
  assert.equal(getCellHighlightClass(9, 8, 7, 8), 'in-band-trail');
  assert.equal(getCellHighlightClass(2, 2, 7, 8), '');
});
