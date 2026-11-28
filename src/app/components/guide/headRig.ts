/**
 * How Mei's head moves. A face (an expression she holds) plus actions (short moves laid
 * over it), blinking and breathing of her own, and hair that swings a beat behind. The
 * output is one pose per frame for the scene's "head" rig.
 */
import { NEUTRAL_HEAD, type HeadPose } from '../../river/scene3d/build';

type Part = Partial<HeadPose>;

export const FACES = {
  neutral: {},
  smile: { smile: 1, brow: 0.2, blush: 1 },
  happy: { happy: 1, smile: 1, mouthOpen: 0.45, mouthWide: 1.1, brow: 0.5, blush: 1 },
  thinking: { gazeX: 0.9, gazeY: 1, browSkew: 1, smile: -0.1, mouthWide: 0.55, roll: 0.14, eyeL: 0.85, eyeR: 0.85 },
  surprised: { eyeL: 1.35, eyeR: 1.35, brow: 1.3, smile: 0, mouthOpen: 0.85, mouthWide: 0.55, lift: 0.012 },
  worried: { worry: 1, brow: 0.4, smile: -0.7, mouthWide: 0.75, pitch: 0.1 },
  focused: { eyeL: 0.7, eyeR: 0.7, brow: -0.7, worry: -0.5, smile: 0.1, mouthWide: 0.7 },
  sleepy: { eyeL: 0.05, eyeR: 0.05, brow: -0.2, smile: 0.2, mouthWide: 0.6, pitch: 0.22, roll: -0.1 },
} satisfies Record<string, Part>;
export type Face = keyof typeof FACES;

/** 0 → 1 → 0 across an action, easing at both ends. */
const hump = (k: number) => Math.sin(Math.PI * Math.min(1, Math.max(0, k))) ** 2;
const wave = (k: number, times: number) => Math.sin(k * Math.PI * 2 * times);

/** Each action adds to (or, for the face parts, replaces) the held pose while it plays. */
export const ACTIONS = {
  nod: { seconds: 0.9, play: (k: number, p: HeadPose) => { p.pitch += Math.max(0, wave(k, 2)) * 0.28; p.lift -= Math.max(0, wave(k, 2)) * 0.008; } },
  shake: { seconds: 1, play: (k: number, p: HeadPose) => { p.yaw += wave(k, 2) * hump(k) * 0.55; } },
  tilt: { seconds: 1.4, play: (k: number, p: HeadPose) => { p.roll += hump(k) * 0.3; p.brow += hump(k) * 0.6; } },
  wink: { seconds: 0.9, play: (k: number, p: HeadPose) => { if (k > 0.15 && k < 0.75) p.eyeR = 0; p.smile = 1; p.roll -= hump(k) * 0.14; p.blush = 1; } },
  hop: { seconds: 0.8, play: (k: number, p: HeadPose) => { p.lift += k > 0.2 ? Math.sin(Math.PI * (k - 0.2) / 0.8) * 0.045 : 0; p.squash += k < 0.2 ? -hump(k / 0.2) * 0.07 : Math.sin(Math.PI * (k - 0.2) / 0.8) * 0.04; } },
  hello: { seconds: 1.8, play: (k: number, p: HeadPose) => { p.roll += wave(k, 1.5) * hump(k) * 0.22; p.happy = k > 0.15 && k < 0.8 ? 1 : p.happy; p.smile = 1; p.mouthOpen = Math.max(p.mouthOpen, hump(k) * 0.5); p.blush = 1; p.lift += Math.abs(wave(k, 1.5)) * hump(k) * 0.02; } },
  laugh: { seconds: 1.6, play: (k: number, p: HeadPose) => { p.happy = 1; p.smile = 1; p.blush = 1; p.mouthOpen = 0.35 + Math.abs(wave(k, 4)) * 0.5 * hump(k); p.pitch -= hump(k) * 0.16; p.lift += Math.abs(wave(k, 4)) * hump(k) * 0.02; } },
  lookAround: { seconds: 2.4, play: (k: number, p: HeadPose) => { const side = wave(k, 1); p.yaw += side * 0.55; p.gazeX += side; p.brow += hump(k) * 0.3; } },
} satisfies Record<string, { seconds: number; play: (k: number, pose: HeadPose) => void }>;
export type Action = keyof typeof ACTIONS;

export type HeadInput = {
  face: Face;
  /** Mouth moves as if speaking. */
  talking: boolean;
  /** Where she looks, each from -1 to 1. */
  look: [number, number];
  /** The page is travelling: she leans into it and her hair trails. */
  moving: boolean;
};

export function createHeadRig() {
  const held: HeadPose = { ...NEUTRAL_HEAD };
  let playing: { name: Action; from: number } | null = null;
  let queued: Action | null = null;
  let blinkAt = 1.5;
  let last = 0;
  let before = { yaw: 0, pitch: 0, roll: 0, lift: 0 };
  // Hair is a damped spring pushed by how the head moves.
  const hair = { x: 0, z: 0, vx: 0, vz: 0 };

  return {
    play(name: Action) { queued = name; },
    /** The pose at time `t` (seconds). */
    step(t: number, input: HeadInput): HeadPose {
      const dt = Math.min(0.05, Math.max(0.001, t - last));
      last = t;
      if (queued) { playing = { name: queued, from: t }; queued = null; }

      // Ease the held face toward what is asked for; the head turns more slowly than the eyes.
      const target: HeadPose = { ...NEUTRAL_HEAD, ...(FACES[input.face] as Part) };
      target.yaw += input.look[0] * 0.5;
      target.pitch += input.look[1] * 0.22 + (input.moving ? 0.12 : 0);
      target.gazeX += input.look[0];
      target.gazeY -= input.look[1];
      for (const key of Object.keys(held) as (keyof HeadPose)[]) {
        const quick = key === 'yaw' || key === 'pitch' || key === 'roll' ? 6 : 14;
        held[key] += (target[key] - held[key]) * Math.min(1, dt * quick);
      }
      const p: HeadPose = { ...held };
      p.happy = target.happy;

      // breathing
      p.lift += Math.sin(t * 1.7) * 0.004;
      p.roll += Math.sin(t * 0.8) * 0.018;
      if (input.talking) {
        // two rates at once, so the syllables do not tick evenly
        p.mouthOpen = Math.max(p.mouthOpen, Math.max(0, Math.sin(t * 17) * 0.4 + Math.sin(t * 7.3) * 0.3 + 0.15));
        p.pitch += Math.sin(t * 3.1) * 0.025;
      }
      if (playing) {
        const action = ACTIONS[playing.name];
        const k = (t - playing.from) / action.seconds;
        if (k >= 1) playing = null;
        else action.play(k, p);
      }
      // blinking, sometimes twice
      if (t > blinkAt) {
        const into = t - blinkAt;
        if (into < 0.13) { p.eyeL = Math.min(p.eyeL, 0.05); p.eyeR = Math.min(p.eyeR, 0.05); }
        else blinkAt = t + (Math.random() < 0.18 ? 0.16 : 2.2 + Math.random() * 3);
      }

      const push = { z: (p.yaw - before.yaw) * 0.5 + (p.roll - before.roll) * 0.9, x: (p.pitch - before.pitch) * 0.8 - (p.lift - before.lift) * 4 };
      before = { yaw: p.yaw, pitch: p.pitch, roll: p.roll, lift: p.lift };
      hair.vx += (-hair.x * 90 - hair.vx * 8) * dt - push.x * 3;
      hair.vz += (-hair.z * 90 - hair.vz * 8) * dt - push.z * 3;
      hair.x += hair.vx * dt;
      hair.z += hair.vz * dt;
      const clamp = (v: number) => Math.min(0.35, Math.max(-0.35, v));
      p.hairX = clamp(hair.x) - (input.moving ? 0.18 : 0);
      p.hairZ = clamp(hair.z) - p.roll * 0.25; // and it hangs toward the ground when she tilts
      return p;
    },
  };
}
