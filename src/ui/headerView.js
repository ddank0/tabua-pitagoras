import { calculateProduct } from '../domain/multiplication.js';

export function createHeaderView({
  casingElement,
  factorRowElement,
  factorColElement,
  productValueElement,
  iconSoundOnElement,
  iconSoundOffElement,
  iconSunElement,
  iconMoonElement
}) {
  let previousRow = null;
  let previousCol = null;

  function triggerProductPopAnimation() {
    productValueElement.classList.remove('animate-pop');
    void productValueElement.offsetWidth;
    productValueElement.classList.add('animate-pop');
  }

  function render(state) {
    const { row, col, soundEnabled, isDark } = state;
    const product = calculateProduct(row, col);
    const hasCoordinatesChanged = previousRow !== null && (previousRow !== row || previousCol !== col);

    factorRowElement.textContent = String(row);
    factorColElement.textContent = String(col);
    productValueElement.textContent = String(product);

    if (hasCoordinatesChanged) {
      triggerProductPopAnimation();
    }

    previousRow = row;
    previousCol = col;

    casingElement.className = `instrument-casing ${isDark ? 'theme-dark' : 'theme-light'}`;
    document.body.classList.toggle('body-dark', isDark);

    iconSoundOnElement.classList.toggle('is-hidden', !soundEnabled);
    iconSoundOffElement.classList.toggle('is-hidden', soundEnabled);
    iconSunElement.classList.toggle('is-hidden', !isDark);
    iconMoonElement.classList.toggle('is-hidden', isDark);
  }

  return {
    render
  };
}
