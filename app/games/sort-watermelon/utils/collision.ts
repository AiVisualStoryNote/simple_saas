import { Block, FRUIT_SIZES } from "../types";

export function checkCollision(block1: Block, block2: Block): boolean {
  const r1 = FRUIT_SIZES[block1.level].size / 2;
  const r2 = FRUIT_SIZES[block2.level].size / 2;
  const dx = block1.x + r1 - (block2.x + r2);
  const dy = block1.y + r1 - (block2.y + r2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < r1 + r2;
}