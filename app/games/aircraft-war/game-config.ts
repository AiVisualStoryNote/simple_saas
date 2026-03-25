export interface GameConfig {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  descriptionCn: string;
  route: string;
  icon: string;
  coverImage: string;
  color: string;
  difficulty: string;
  duration: string;
  minPlayers: number;
  maxPlayers: number;
}

export const gameConfig: GameConfig = {
  id: "aircraft-war",
  name: "Aircraft War",
  nameCn: "打飞机",
  description: "The classic viral bullet hell game! Move your plane, shoot enemies, survive as long as you can!",
  descriptionCn: "经典弹幕网红游戏！移动飞机，击落敌机，坚持得越久分数越高！",
  route: "/games/aircraft-war",
  icon: "✈️",
  coverImage: "",
  color: "#4fc3f7",
  difficulty: "medium",
  duration: "2-8 min",
  minPlayers: 1,
  maxPlayers: 1,
};
