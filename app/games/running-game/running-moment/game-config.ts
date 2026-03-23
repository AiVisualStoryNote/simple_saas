import { GameConfig as IGameConfig } from "./types";

export type GameConfig = IGameConfig;

export const gameConfig: GameConfig = {
  id: "running-moment",
  name: "Running Moment",
  nameCn: "奔跑时刻",
  description: "A thrilling endless runner game where you dodge obstacles and collect coins!",
  descriptionCn: "一款令人兴奋的无限奔跑游戏，躲避障碍物，收集金币！",
  route: "/games/running-game/running-moment",
  icon: "🏃",
  coverImage: "",
  color: "#FF6B6B",
  difficulty: "medium",
  duration: "5-10 min",
  minPlayers: 1,
  maxPlayers: 1,
};
