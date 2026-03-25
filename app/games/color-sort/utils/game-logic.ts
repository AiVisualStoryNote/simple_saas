import { Tube } from "../types";

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateGame(colorCount: number, emptyTubes: number, capacity: number): Tube[] {
  const colors: number[] = [];
  for (let i = 0; i < colorCount; i++) {
    // 每个颜色放capacity个
    for (let j = 0; j < capacity; j++) {
      colors.push(i);
    }
  }

  const shuffled = shuffleArray(colors);
  const tubes: Tube[] = [];
  let id = 0;

  // 满的管子
  for (let i = 0; i < colorCount; i++) {
    tubes.push({
      id: id++,
      colors: shuffled.splice(0, capacity),
    });
  }

  // 空管子
  for (let i = 0; i < emptyTubes; i++) {
    tubes.push({
      id: id++,
      colors: [],
    });
  }

  return tubes;
}

export function canMove(from: Tube, to: Tube, capacity: number): boolean {
  if (from.colors.length === 0) return false;
  if (to.colors.length === 0) return true;
  if (to.colors.length >= capacity) return false;
  // 最上面颜色相同才能移动
  return from.colors[from.colors.length - 1] === to.colors[to.colors.length - 1];
}

export function move(from: Tube, to: Tube, tubes: Tube[]): Tube[] {
  const newTubes = tubes.map(t => ({ ...t, colors: [...t.colors] }));
  const fromIndex = newTubes.findIndex(t => t.id === from.id);
  const toIndex = newTubes.findIndex(t => t.id === to.id);

  const color = newTubes[fromIndex].colors.pop()!;
  newTubes[toIndex].colors.push(color);

  return newTubes;
}

export function checkWin(tubes: Tube[], capacity: number): boolean {
  return tubes.every(tube => {
    if (tube.colors.length === 0) return true;
    if (tube.colors.length !== capacity) return false;
    const firstColor = tube.colors[0];
    return tube.colors.every(c => c === firstColor);
  });
}

export function undoMove(prevTubes: Tube[]): Tube[] {
  return prevTubes.map(t => ({ ...t, colors: [...t.colors] }));
}
