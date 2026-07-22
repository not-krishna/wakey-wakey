/**
 * Sound Manager using Web Audio API
 * Generates a warm, clear, friendly repeating alarm chime ("Wakey Waky chime")
 * without needing external MP3 asset downloads.
 */

let audioCtx = null;
let isAlarmPlaying = false;
let alarmInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Primes the audio context on user interaction (e.g., tapping "Start Trip").
 * Bypasses mobile browser autoplay blocks.
 */
export function primeAudioContext() {
  try {
    const ctx = getAudioContext();
    if (ctx) {
      // Play an imperceptible silent buffer to prime audio context
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }
  } catch (err) {
    console.warn('Audio priming warning:', err);
  }
}

/**
 * Plays a pleasant 3-note wakey-waky chime sequence (E5 -> G5 -> C6).
 */

function playChimeSequence(volume = 0.8) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [659.25, 783.99, 1046.50]; // E5, G5, C6
  notes.forEach((freq, index) => {
    const startTime = ctx.currentTime + index * 0.18;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.01, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.4);
  });
}

/**
 * Starts the looping alarm sound.
 */
export function startAlarmSound() {
  if (isAlarmPlaying) return;
  isAlarmPlaying = true;

  // Initial chime
  playChimeSequence(0.8);

  // Loop chime sequence every 1.2 seconds
  alarmInterval = setInterval(() => {
    if (isAlarmPlaying) {
      playChimeSequence(0.85);
    }
  }, 1200);
}

/**
 * Escalates alarm sound volume / pitch pattern if unacknowledged after 20 seconds.
 */
export function escalateAlarmSound() {
  if (!isAlarmPlaying) return;
  if (alarmInterval) clearInterval(alarmInterval);

  alarmInterval = setInterval(() => {
    if (isAlarmPlaying) {
      playChimeSequence(1.0);
    }
  }, 800);
}

/**
 * Stops the alarm sound.
 */
export function stopAlarmSound() {
  isAlarmPlaying = false;
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
}
