import { Cell } from "../types";

// Level 1 - Easy starting level
const level1: Cell[][] = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
  ['wall', 'empty', 'box', 'empty', 'goal', 'empty', 'wall'],
  ['wall', 'empty', 'empty', 'player', 'empty', 'empty', 'wall'],
  ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
];

// Level 2
const level2: Cell[][] = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
  ['wall', 'empty', 'box', 'empty', 'box', 'empty', 'empty', 'wall'],
  ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
  ['wall', 'empty', 'goal', 'empty', 'goal', 'empty', 'player', 'wall'],
  ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
];

// Level 3
const level3: Cell[][] = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'empty'],
  ['wall', 'empty', 'empty', 'empty', 'empty', 'wall'],
  ['wall', 'empty', 'box', 'wall', 'empty', 'wall'],
  ['wall', 'goal', 'empty', 'player', 'empty', 'wall'],
  ['wall', 'empty', 'empty', 'box', 'goal', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
];

// Level 4
const level4: Cell[][] = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'wall'],
  ['wall', 'empty', 'box', 'empty', 'box', 'empty', 'empty', 'wall'],
  ['wall', 'empty', 'empty', 'goal', 'empty', 'goal', 'empty', 'wall'],
  ['wall', 'empty', 'box', 'empty', 'empty', 'empty', 'empty', 'wall'],
  ['wall', 'empty', 'player', 'empty', 'goal', 'empty', 'empty', 'wall'],
  ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
];

export const levels = [
  { data: level1, boxCount: 1 },
  { data: level2, boxCount: 2 },
  { data: level3, boxCount: 2 },
  { data: level4, boxCount: 3 },
].map(l => l.data);

export const levelsBoxCount = [1, 2, 2, 3];

export { level1, level2, level3, level4 };
