import type { ToolFall } from "./scene3d/toolLayout";

// A tiny shared scratchpad between the river scene and the DOM pieces that play
// along with it. Journey.tsx writes the scene's side every frame; nothing here
// triggers renders.
export const riverBus = {
  /** Screen y (css px) of the water's surface along the lane the fish swims in. */
  waterY: 0,
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
  /** Project cards, page → scene: how far each has risen out of the river (0 afloat … 1 clear of it); null while they are not in play. */
  worksUp: null as number[] | null,
  /** Project cards, scene → page: where each floating card is on screen (centre, height, css px). */
  workSpots: null as { x: number; y: number; h: number }[] | null,
  /** Set by the portrait while it is playing her, so the scene's own runner steps aside. */
  runnerHidden: false,
};
