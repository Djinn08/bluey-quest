let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/** Playful synthesized giggle for Muffin interactions */
export function playMuffinGiggle(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  void ctx.resume();

  const notes = [523, 659, 784, 659, 880, 784];
  const start = ctx.currentTime;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.12, start + i * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + i * 0.08 + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start + i * 0.08);
    osc.stop(start + i * 0.08 + 0.12);
  });
}

/** Soft positive chime for Bluey */
export function playBlueyChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  void ctx.resume();

  const start = ctx.currentTime;
  [392, 523, 659].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.08, start + i * 0.1 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + i * 0.1 + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start + i * 0.1);
    osc.stop(start + i * 0.1 + 0.25);
  });
}

/** Gentle warm tone for Bingo */
export function playBingoTone(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  void ctx.resume();

  const start = ctx.currentTime;
  [440, 554].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.07, start + i * 0.12 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + i * 0.12 + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start + i * 0.12);
    osc.stop(start + i * 0.12 + 0.3);
  });
}
