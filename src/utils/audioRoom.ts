/**
 * Self-contained Web Audio procedural sound generator for Trainer's Room
 * Zero external network dependencies. Works reliably offline and in sandbox.
 */

let audioCtx: AudioContext | null = null;
let ambientGain: GainNode | null = null;
let ambientSource: AudioNode | null = null;
let ambientTimer: number | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('AudioContext not supported or blocked', e);
    return null;
  }
}

/**
 * Gentle melodic two-tone bell chime when timer finishes
 */
export function playChimeBell(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Tone 1: High crisp harmonic (E5 = 659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    // Tone 2: Warm foundational bell (A4 = 440Hz, delayed 120ms)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now + 0.12);
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 1.8);
  } catch (e) {
    console.warn('Failed to play chime bell', e);
  }
}

/**
 * Gentle coffee maker / espresso pour sound effect
 */
export function playCoffeePourSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 2.0;
    
    // Noise buffer for gentle bubbling liquid stream
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    // Filter to sound like flowing liquid / espresso extraction
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(900, now + 1.0);
    filter.frequency.linearRampToValueAtTime(300, now + duration);
    filter.Q.setValueAtTime(3.0, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.3);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 1.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  } catch (e) {
    console.warn('Failed to play coffee pour sound', e);
  }
}

/**
 * Click / marker tap sound
 */
export function playMarkerTap(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {
    // Ignore
  }
}

/**
 * Stop any running ambient audio
 */
export function stopAmbientSound(): void {
  if (ambientTimer) {
    window.clearInterval(ambientTimer);
    ambientTimer = null;
  }
  if (ambientSource) {
    try {
      (ambientSource as AudioScheduledSourceNode).stop?.();
      ambientSource.disconnect();
    } catch (e) {
      // Ignore
    }
    ambientSource = null;
  }
  if (ambientGain) {
    try {
      ambientGain.disconnect();
    } catch (e) {
      // Ignore
    }
    ambientGain = null;
  }
}

/**
 * Procedural ambient focus sound generator:
 * - 'rain': filtered pink noise
 * - 'clock': subtle periodic mechanical tick
 * - 'hum': deep academic lounge resonance
 */
export function startAmbientSound(mode: 'rain' | 'clock' | 'hum', volume = 0.08): void {
  stopAmbientSound();
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (mode === 'clock') {
      ambientTimer = window.setInterval(() => {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);
        gain.gain.setValueAtTime(volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.025);
      }, 1000);
      return;
    }

    if (mode === 'rain' || mode === 'hum') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink/Brown noise generator
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.2;
        data[i] = (b0 + b1 + b2) * 0.4;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      if (mode === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
      } else {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      ambientSource = source;
      ambientGain = gain;
    }
  } catch (e) {
    console.warn('Failed to start ambient audio', e);
  }
}
