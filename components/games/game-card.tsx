"use client";

import Link from "next/link";
import { GameConfig } from "@/app/games/running-game/running-moment/types";
import { Play, Users, Clock } from "lucide-react";
import { useState } from "react";

interface GameCardProps {
  game: GameConfig;
  isZh: boolean;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const difficultyLabels = {
  easy: { en: "Easy", cn: "简单" },
  medium: { en: "Medium", cn: "中等" },
  hard: { en: "Hard", cn: "困难" },
};

export function GameCard({ game, isZh }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-xl border-2 transition-all duration-300"
        style={{
          borderColor: isHovered ? game.color : `${game.color}80`,
          backgroundColor: isHovered
            ? `linear-gradient(135deg, ${game.color}15, ${game.color}08)`
            : "transparent",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${game.color}10 0%, transparent 70%)`,
          }}
        />

        <div className="relative aspect-square flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30">
          <span className="text-8xl filter drop-shadow-lg">
            {game.icon}
          </span>

          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background/80 to-transparent"
          />
        </div>

        <div className="relative p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold tracking-tight">
              {isZh ? game.nameCn : game.name}
            </h3>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                difficultyColors[game.difficulty]
              }`}
            >
              {isZh
                ? difficultyLabels[game.difficulty].cn
                : difficultyLabels[game.difficulty].en}
            </span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {isZh ? game.descriptionCn : game.description}
          </p>

          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{game.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>
                {game.minPlayers === game.maxPlayers
                  ? `${game.minPlayers}`
                  : `${game.minPlayers}-${game.maxPlayers}`}
              </span>
            </div>
          </div>

          <Link
            href={game.route}
            className="inline-flex items-center justify-center gap-1.5 w-full mt-1.5 py-1.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: game.color,
              color: "white",
              boxShadow: isHovered
                ? `0 4px 20px ${game.color}40`
                : `0 2px 8px ${game.color}20`,
            }}
          >
            <Play className="h-3 w-3 fill-current" />
            <span>{isZh ? "开始游戏" : "Play Now"}</span>
          </Link>
        </div>
      </div>

      <div
        className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          background: `radial-gradient(ellipse at center, ${game.color}25 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
