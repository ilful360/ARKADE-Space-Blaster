// ═══════════════════════════════════════════════════════
//  ARKADE — Retro Synth Sound Engine (Web Audio API)
//  All sounds are generated procedurally — no files needed
// ═══════════════════════════════════════════════════════

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let _muted = false;
let _volume = 0.35;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = _volume;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

function getMaster(): GainNode {
  getCtx();
  return masterGain!;
}

export function isMuted(): boolean {
  return _muted;
}

export function toggleMute(): boolean {
  _muted = !_muted;
  if (masterGain) {
    masterGain.gain.value = _muted ? 0 : _volume;
  }
  return _muted;
}

export function setVolume(v: number): void {
  _volume = Math.max(0, Math.min(1, v));
  if (masterGain && !_muted) {
    masterGain.gain.value = _volume;
  }
}

// ── Helpers ──

function createOsc(
  type: OscillatorType,
  freq: number,
  duration: number,
  volume: number = 0.3,
  freqEnd?: number,
): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(freqEnd, 20),
      c.currentTime + duration,
    );
  }

  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);

  osc.connect(gain);
  gain.connect(getMaster());

  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

function createNoise(duration: number, volume: number = 0.15): void {
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = c.createBufferSource();
  noise.buffer = buffer;

  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);

  // Bandpass for a less harsh sound
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 3000;
  filter.Q.value = 0.5;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(getMaster());

  noise.start(c.currentTime);
  noise.stop(c.currentTime + duration);
}

// ═══════════════════════════════════════════════════════
//  SOUND EFFECTS
// ═══════════════════════════════════════════════════════

/** Player laser shot — quick high-pitched zap */
export function playShoot(): void {
  createOsc('square', 880, 0.08, 0.12, 440);
  createOsc('sawtooth', 1200, 0.06, 0.06, 600);
}

/** Spread shot — wider zap */
export function playShootSpread(): void {
  createOsc('square', 780, 0.07, 0.1, 390);
  createOsc('sawtooth', 1100, 0.06, 0.05, 550);
  createOsc('square', 980, 0.07, 0.08, 490);
}

/** Enemy laser shot — lower pitched menacing zap */
export function playEnemyShoot(): void {
  createOsc('sawtooth', 300, 0.12, 0.08, 150);
}

/** Hit an enemy (but not killed) — metallic ping */
export function playHit(): void {
  createOsc('triangle', 600, 0.06, 0.12, 300);
}

/** Small enemy explosion (grunt) — quick pop */
export function playExplosionSmall(): void {
  createOsc('square', 200, 0.15, 0.2, 40);
  createNoise(0.12, 0.12);
}

/** Medium explosion (zigzag/tank) — meatier boom */
export function playExplosionMedium(): void {
  createOsc('sawtooth', 160, 0.25, 0.25, 30);
  createOsc('square', 100, 0.2, 0.15, 25);
  createNoise(0.2, 0.18);
}

/** Boss explosion — massive dramatic rumble */
export function playExplosionBoss(): void {
  createOsc('sawtooth', 120, 0.5, 0.3, 20);
  createOsc('square', 80, 0.6, 0.25, 20);
  createOsc('triangle', 60, 0.7, 0.2, 20);
  createNoise(0.5, 0.25);
  // Secondary rumble
  setTimeout(() => {
    createOsc('sawtooth', 90, 0.4, 0.2, 20);
    createNoise(0.3, 0.15);
  }, 150);
}

/** Player takes damage — harsh alarm buzz */
export function playPlayerHit(): void {
  createOsc('square', 200, 0.2, 0.25, 80);
  createOsc('sawtooth', 150, 0.25, 0.2, 50);
  createNoise(0.15, 0.2);
}

/** Game over — dramatic descending tone */
export function playGameOver(): void {
  const c = getCtx();
  const notes = [440, 370, 311, 261, 220, 185, 146];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(getMaster());
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.25);
    }, i * 180);
  });
  setTimeout(() => createNoise(0.6, 0.1), 800);
}

/** Power-up collected — cheerful ascending arpeggio */
export function playPowerUp(): void {
  const c = getCtx();
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(getMaster());
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.12);
    }, i * 60);
  });
}

/** Shield blocks a hit — bright metallic ping */
export function playShieldBlock(): void {
  createOsc('triangle', 1200, 0.12, 0.15, 2400);
  createOsc('sine', 800, 0.1, 0.1, 1600);
}

/** Wave complete — triumphant fanfare */
export function playWaveClear(): void {
  const c = getCtx();
  const notes = [523, 659, 784, 1047, 1318];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(getMaster());
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.2);
    }, i * 100);
  });
}

/** Boss wave incoming — ominous warning siren */
export function playBossWarning(): void {
  const c = getCtx();
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, c.currentTime);
      osc.frequency.linearRampToValueAtTime(400, c.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(200, c.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, c.currentTime);
      gain.gain.setValueAtTime(0.12, c.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(getMaster());
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.35);
    }, i * 400);
  }
}

/** UI button click — short blip */
export function playClick(): void {
  createOsc('square', 660, 0.04, 0.1, 880);
}

/** Game start — ascending power-up whoosh */
export function playGameStart(): void {
  createOsc('sawtooth', 100, 0.4, 0.15, 800);
  createOsc('triangle', 150, 0.35, 0.1, 1200);
  setTimeout(() => {
    createOsc('square', 523, 0.15, 0.12);
    createOsc('square', 659, 0.15, 0.1);
  }, 300);
}

/** Combo milestone sound — quick double-blip */
export function playCombo(): void {
  createOsc('triangle', 880, 0.06, 0.12, 1760);
  setTimeout(() => {
    createOsc('triangle', 1100, 0.06, 0.1, 2200);
  }, 70);
}

/** New high score — celebration jingle */
export function playNewHighScore(): void {
  const c = getCtx();
  const melody = [
    { freq: 523, delay: 0 },
    { freq: 659, delay: 120 },
    { freq: 784, delay: 240 },
    { freq: 1047, delay: 360 },
    { freq: 784, delay: 480 },
    { freq: 1047, delay: 600 },
    { freq: 1318, delay: 750 },
  ];
  melody.forEach(({ freq, delay }) => {
    setTimeout(() => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(getMaster());
      osc.start(c.currentTime);
      osc.stop(c.currentTime + 0.2);
    }, delay);
  });
}

/** Pause toggle — soft beep */
export function playPause(): void {
  createOsc('sine', 440, 0.08, 0.1);
  setTimeout(() => createOsc('sine', 330, 0.08, 0.08), 80);
}

/** Resume — reverse of pause */
export function playResume(): void {
  createOsc('sine', 330, 0.08, 0.08);
  setTimeout(() => createOsc('sine', 440, 0.08, 0.1), 80);
}
