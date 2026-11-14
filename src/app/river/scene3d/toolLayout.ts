// The tools on the shelf: which, in what order, and where each one stands.
// Kept free of three.js so the page can lay out its labels from the same numbers
// the 3D shelf is built from, without pulling the renderer into the first bundle.

export const TOOL_GROUPS = [
  {
    title: "Design & prototyping",
    tools: [
      { id: "figma", name: "Figma" },
      { id: "storybook", name: "Storybook" },
      { id: "adobe", name: "Adobe CC" },
      { id: "touchdesigner", name: "TouchDesigner" },
    ],
  },
  {
    title: "AI & automation",
    tools: [
      { id: "claude", name: "Claude Code" },
      { id: "chatgpt", name: "ChatGPT" },
      { id: "n8n", name: "n8n" },
    ],
  },
  {
    title: "Research & delivery",
    tools: [
      { id: "maze", name: "Maze" },
      { id: "notion", name: "Notion" },
      { id: "jira", name: "Jira" },
      { id: "posthog", name: "PostHog" },
      { id: "sql", name: "SQL" },
    ],
  },
] as const;

export type ToolId = (typeof TOOL_GROUPS)[number]["tools"][number]["id"];

const SPACING = 1.15; // world units between neighbours
const GROUP_GAP = 0.55; // extra room between categories
const MARGIN = 0; // the first and last groups sit flush with the edges of the text column

/** Every tool in shelf order, with the world x it stands at (the shelf is centred on 0). */
export const TOOL_SLOTS = (() => {
  const slots: { id: ToolId; name: string; group: number; x: number }[] = [];
  let x = 0;
  TOOL_GROUPS.forEach((group, g) => {
    if (g > 0) x += GROUP_GAP;
    group.tools.forEach((tool) => {
      slots.push({ id: tool.id, name: tool.name, group: g, x });
      x += SPACING;
    });
  });
  const centre = (slots[0].x + slots[slots.length - 1].x) / 2;
  return slots.map((slot) => ({ ...slot, x: slot.x - centre }));
})();

/** World width the shelf camera shows, edge to edge. */
export const SHELF_WIDTH = TOOL_SLOTS[TOOL_SLOTS.length - 1].x - TOOL_SLOTS[0].x + SPACING + MARGIN * 2;

/** Where a world x falls across the shelf, 0 (left edge) … 1 (right edge). */
export const shelfFraction = (x: number) => 0.5 + x / SHELF_WIDTH;
export const SHELF_SLOT = SPACING / SHELF_WIDTH; // one slot's share of the width

// The shelf's frame, and where a tool hangs in it. The 3D shelf is built from these
// and the page uses them to say where on screen each tool starts its fall.
export const SHELF_ASPECT = 5.1; // width : height of the shelf's frame
export const SHELF_EYE_Y = 1.08; // world height the shelf camera looks at (the frame's middle)
export const SHELF_TOOL_Y = 1.18; // world height at which a tool sits on its pin
export const SHELF_TOOL_SCALE = 1.25;
/** How far down the frame a tool hangs, 0 (top) … 1 (bottom). */
export const SHELF_TOOL_FRACTION = 0.5 - (SHELF_TOOL_Y - SHELF_EYE_Y) / (SHELF_WIDTH / SHELF_ASPECT);

/** How far along its fall tool i is, given the overall drop: they go one after another. */
export const dropShare = (drop: number, i: number) => Math.min(1, Math.max(0, drop * 1.75 - i * 0.065));

/** One tool's place on screen during its fall: css px, how far along it is, and how many px one unit of the object covers. */
export type ToolFall = { x: number; y: number; k: number; unit: number };
