import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore, createInitialState } from '../src/state/store.js';

test('createStore initializes with default state and updates immutably', () => {
  const store = createStore(createInitialState());
  const initialSnapshot = store.getState();

  assert.equal(initialSnapshot.row, 7);
  assert.equal(initialSnapshot.col, 8);
  assert.equal(initialSnapshot.isDark, false);

  let notifiedState = null;
  const unsubscribe = store.subscribe((nextState) => {
    notifiedState = nextState;
  });

  store.setState({ row: 4, col: 9 });
  const updatedSnapshot = store.getState();

  assert.notEqual(updatedSnapshot, initialSnapshot);
  assert.equal(initialSnapshot.row, 7);
  assert.equal(updatedSnapshot.row, 4);
  assert.equal(updatedSnapshot.col, 9);
  assert.deepEqual(notifiedState, updatedSnapshot);

  unsubscribe();
});
