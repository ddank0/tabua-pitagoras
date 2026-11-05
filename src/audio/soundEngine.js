const BASE_CLICK_FREQUENCY_HZ = 190;
const END_CLICK_FREQUENCY_HZ = 55;
const CLICK_DURATION_SEC = 0.035;
const SUCCESS_CHORD_FREQUENCIES_HZ = [523.25, 659.25, 783.99];
const HAPTIC_PULSE_MS = 8;

export function createSoundEngine(getIsSoundEnabled) {
  let audioContext = null;

  function ensureAudioContext() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioContext = new AudioContextClass();
      }
    }

    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }

    return audioContext;
  }

  function playMechanicalClick(pitchFactor = 1) {
    if (!getIsSoundEnabled()) return;

    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(BASE_CLICK_FREQUENCY_HZ * pitchFactor, now);
      oscillator.frequency.exponentialRampToValueAtTime(END_CLICK_FREQUENCY_HZ, now + CLICK_DURATION_SEC);

      gainNode.gain.setValueAtTime(0.18, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + CLICK_DURATION_SEC);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(now);
      oscillator.stop(now + 0.04);
    } catch {
      // Ignora falhas de autoplay do navegador até a primeira interação do usuário
    }
  }

  function playSuccessChord() {
    if (!getIsSoundEnabled()) return;

    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      SUCCESS_CHORD_FREQUENCIES_HZ.forEach((frequency, index) => {
        const startOffset = now + (index * 0.07);
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, startOffset);

        gainNode.gain.setValueAtTime(0.15, startOffset);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startOffset + 0.18);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startOffset);
        oscillator.stop(startOffset + 0.2);
      });
    } catch {
      // Ignora bloqueios de contexto de áudio
    }
  }

  function triggerHapticPulse() {
    if (!getIsSoundEnabled()) return;
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(HAPTIC_PULSE_MS);
    }
  }

  return {
    playMechanicalClick,
    playSuccessChord,
    triggerHapticPulse
  };
}
