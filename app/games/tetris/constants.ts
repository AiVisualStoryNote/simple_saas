export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;

export const LEVEL_SPEED = [
  800, 700, 600, 500, 400, 300, 250, 200, 150, 100, 80, 50
];

export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
};

// Tetromino shapes (I, O, T, S, Z, J, L)
export const SHAPES = [
  // I
  [[1, 1, 1, 1]],
  // O
  [[1, 1], [1, 1]],
  // T
  [[0, 1, 0], [1, 1, 1]],
  // S
  [[0, 1, 1], [1, 1, 0]],
  // Z
  [[1, 1, 0], [0, 1, 1]],
  // J
  [[1, 0, 0], [1, 1, 1]],
  // L
  [[0, 0, 1], [1, 1, 1]],
];

export const COLORS = [
  "#00f0f0", // Cyan - I
  "#f0f000", // Yellow - O
  "#a000f0", // Purple - T
  "#00f000", // Green - S
  "#f00000", // Red - Z
  "#0000f0", // Blue - J
  "#f0a000", // Orange - L
];
