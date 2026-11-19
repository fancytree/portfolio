import type { ToolFall } from "./scene3d/toolLayout";

// A tiny shared scratchpad between the river scene and the DOM pieces that play
// along with it. Journey.tsx writes the scene's side every frame; nothing here
// triggers renders.
export const riverBus = {
  /** Screen y (css px) of the water's surface along the lane the fish swims in. */
  waterY: 0,
  /**
   * The loader's intro on the homepage, page → scene: while `away` the river's fish is
   * out of the water (it is the one circling the loader); set back to false, it drops
   * in with a splash.
   */
  intro: { away: false },
  /** Where the river fish is on screen (viewport css px), or null when there is no river scene. The loader's fish dives here. */
  fish: null as { x: number; y: number; len: number } | null,
  /** Where the runner is on screen (css px), as last drawn by the river scene. */
  runner: null as { x: number; feetY: number; headY: number } | null,
  /** How far the tools have dropped off the About shelf into the river: 0 on the shelf … 1 afloat. */
  drop: 0,
  /**
   * Where each tool is on screen (viewport css px) on its way from the shelf to the water.
   * One path for both canvases: the shelf draws a tool down to the bottom edge of the
   * About sheet, and the river scene, which shows below that edge, draws it from there on.
   */
  toolFall: null as ToolFall[] | null,
  /** Set by the portrait while it is playing her, so the scene's own runner steps aside. */
  runnerHidden: false,
};
