export interface CharacterSprite {
  src: string;
  startXPercent: number;
  startYPercent: number;
  endXPercent: number;
  endYPercent: number;
  rowEndXPercent: number;
  frameStepXPercent: number;
  frameStepYPercent: number;
  frameDurationMs: number;
  renderWidth: number;
  renderHeight: number;
}

export interface Character {
  id: string;
  name: string;
  nameCn: string;
  icon: string;
  sprite?: CharacterSprite;
  hp: number;
  speed: number;
  unlockCost: number;
  isDefault: boolean;
  ability: string;
}

export interface Obstacle {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ObstacleType = 
  | 'barrier'    // 🚧 路障
  | 'rock'       // 🪨 岩石
  | 'log'        // 🪵 木头
  | 'bird'       // 🦅 老鹰（低空）
  | 'thorns'     // 🌿 荆棘
  | 'cliff';     // ⬇️ 悬崖

export interface Item {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  collected: boolean;
}

export type ItemType = 
  | 'heart'      // ❤️ 爱心 +1
  | 'lightning'  // ⚡ 闪电（无敌）
  | 'shield'     // 🛡️ 护盾
  | 'magnet'     // 🌀 磁铁
  | 'clock'      // ⏰ 时钟（减速）
  | 'coin';      // 🪙 金币

export interface Coin {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface GameStats {
  distance: number;
  coins: number;
  itemsCollected: Item[];
}

export interface PlayerProgress {
  highScore: number;
  totalCoins: number;
  charactersUnlocked: string[];
  itemsOwned: ItemType[];
}
