import { Character, ItemType, ObstacleType } from "./types/index";

export const CHARACTERS: Character[] = [
  {
    id: "runner",
    name: "Runner",
    nameCn: "跑步者",
    icon: "🏃",
    sprite: {
      src: "/games/running-game/running-moment/runner-sprite.jpg",
      startXPercent: 5.5,
      startYPercent: 7,
      endXPercent: 95.5,
      endYPercent: 30,
      rowEndXPercent: 95.5,
      frameStepXPercent: 30,
      frameStepYPercent: 23,
      frameDurationMs: 100,
      renderWidth: 80,
      renderHeight: 52,
    },
    hp: 3,
    speed: 10.0,
    unlockCost: 0,
    isDefault: true,
    ability: "none",
  },
  {
    id: "fox",
    name: "Fox",
    nameCn: "狐狸",
    icon: "🦊",
    hp: 2,
    speed: 1.2,
    unlockCost: 500,
    isDefault: false,
    ability: "doubleJump",
  },
  {
    id: "ninja",
    name: "Ninja",
    nameCn: "忍者",
    icon: "🥷",
    hp: 2,
    speed: 1.3,
    unlockCost: 800,
    isDefault: false,
    ability: "dash",
  },
];

export const ITEMS_SHOP: { type: ItemType; name: string; nameCn: string; icon: string; cost: number; description: string; descriptionCn: string }[] = [
  {
    type: "heart",
    name: "Extra Heart",
    nameCn: "爱心",
    icon: "❤️",
    cost: 100,
    description: "+1 HP for next game",
    descriptionCn: "下一局游戏+1生命值",
  },
  {
    type: "shield",
    name: "Shield",
    nameCn: "护盾",
    icon: "🛡️",
    cost: 150,
    description: "Block 1 hit",
    descriptionCn: "抵挡1次伤害",
  },
  {
    type: "lightning",
    name: "Speed Boost",
    nameCn: "闪电",
    icon: "⚡",
    cost: 200,
    description: "3s invincibility",
    descriptionCn: "3秒无敌",
  },
  {
    type: "magnet",
    name: "Magnet",
    nameCn: "磁铁",
    icon: "🧲",
    cost: 80,
    description: "Auto-collect coins 10s",
    descriptionCn: "10秒内自动吸金币",
  },
  {
    type: "clock",
    name: "Time Slow",
    nameCn: "时钟",
    icon: "⏰",
    cost: 120,
    description: "Slow obstacles 5s",
    descriptionCn: "5秒内障碍物减速",
  },
];

export const DIFFICULTY_SETTINGS = {
  1: { minInterval: 2000, maxInterval: 3500, speedMultiplier: 1.0, obstacleTypes: ['barrier', 'rock'] as ObstacleType[] },
  2: { minInterval: 1700, maxInterval: 3000, speedMultiplier: 1.15, obstacleTypes: ['barrier', 'rock', 'log'] as ObstacleType[] },
  3: { minInterval: 1400, maxInterval: 2500, speedMultiplier: 1.3, obstacleTypes: ['barrier', 'rock', 'log', 'thorns'] as ObstacleType[] },
  4: { minInterval: 1100, maxInterval: 2000, speedMultiplier: 1.5, obstacleTypes: ['barrier', 'rock', 'log', 'thorns', 'bird'] as ObstacleType[] },
  5: { minInterval: 800, maxInterval: 1500, speedMultiplier: 1.8, obstacleTypes: ['barrier', 'rock', 'log', 'thorns', 'bird', 'cliff'] as ObstacleType[] },
};

export const OBSTACLE_CONFIG: Record<ObstacleType, { width: number; height: number; damage: number; emoji: string; groundY: number }> = {
  barrier: { width: 40, height: 60, damage: 1, emoji: "🚧", groundY: 0 },
  rock: { width: 50, height: 40, damage: 1, emoji: "🪨", groundY: 0 },
  log: { width: 60, height: 35, damage: 1, emoji: "🪵", groundY: 0 },
  bird: { width: 50, height: 40, damage: 1, emoji: "🦅", groundY: -60 },
  thorns: { width: 70, height: 20, damage: 1, emoji: "🌿", groundY: 0 },
  cliff: { width: 80, height: 100, damage: 2, emoji: "", groundY: 0 },
};

export const ITEM_CONFIG: Record<ItemType, { width: number; height: number; emoji: string }> = {
  heart: { width: 30, height: 30, emoji: "❤️" },
  lightning: { width: 30, height: 30, emoji: "⚡" },
  shield: { width: 30, height: 30, emoji: "🛡️" },
  magnet: { width: 30, height: 30, emoji: "🧲" },
  clock: { width: 30, height: 30, emoji: "⏰" },
  coin: { width: 25, height: 25, emoji: "🪙" },
};

export const BASE_SPEED = 5;
export const GROUND_Y = 350;
export const JUMP_FORCE = -15;
export const GRAVITY = 0.8;
export const COIN_REWARD_PER_100M = 10;
