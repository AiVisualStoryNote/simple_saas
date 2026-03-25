export const GAME_CONFIG = {
  GRID_SIZE: 4,
  CELL_SIZE: 80,
  CELL_GAP: 10,
  ANIMATION_DURATION: 100,
};

export const COLORS: Record<number, string> = {
  2: "#eee4da",
  4: "#ede0c8",
  8: "#f2b179",
  16: "#f59563",
  32: "#f67c5f",
  64: "#f65e3b",
  128: "#edcf72",
  256: "#edcc61",
  512: "#edc850",
  1024: "#edc53f",
  2048: "#edc22e",
};

export const CELL_COLORS: Record<number, { bg: string; text: string }> = {
  2: { bg: "#eee4da", text: "#776e65" },
  4: { bg: "#ede0c8", text: "#776e65" },
  8: { bg: "#f2b179", text: "#f9f6f2" },
  16: { bg: "#f59563", text: "#f9f6f2" },
  32: { bg: "#f67c5f", text: "#f9f6f2" },
  64: { bg: "#f65e3b", text: "#f9f6f2" },
  128: { bg: "#edcf72", text: "#f9f6f2" },
  256: { bg: "#edcc61", text: "#f9f6f2" },
  512: { bg: "#edc850", text: "#f9f6f2" },
  1024: { bg: "#edc53f", text: "#f9f6f2" },
  2048: { bg: "#edc22e", text: "#f9f6f2" },
  4096: { bg: "#3c3a32", text: "#f9f6f2" },
};

export const EMPTY_CELL = "#bbada0";

export const GRID_BG = "#bbada0";

export const BG_COLOR = "bg-[#faf8ef]";

export function getColor(value: number): string {
  return COLORS[value] || "#3c3a32";
}

export function getTextColor(value: number): string {
  return value <= 4 ? "#776e65" : "#f9f6f2";
}
