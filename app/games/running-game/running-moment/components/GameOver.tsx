"use client";

import { Trophy, RefreshCw, Home, Medal } from "lucide-react";

interface GameOverProps {
  distance: number;
  coins: number;
  isNewRecord: boolean;
  highScore: number;
  isZh: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOver({ distance, coins, isNewRecord, highScore, isZh, onRestart, onMenu }: GameOverProps) {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-gradient-to-b from-purple-900 to-purple-700 p-8 rounded-3xl text-center max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-center mb-4">
          {isNewRecord ? (
            <Trophy className="h-20 w-20 text-yellow-400 animate-bounce" />
          ) : (
            <Medal className="h-20 w-20 text-gray-300" />
          )}
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
          {isNewRecord 
            ? (isZh ? "新纪录！" : "New Record!")
            : (isZh ? "游戏结束" : "Game Over")
          }
        </h2>

        {isNewRecord && (
          <p className="text-yellow-300 font-medium mb-4">
            {isZh ? "恭喜你打破了自己的记录！" : "Congratulations! You broke your record!"}
          </p>
        )}

        <div className="bg-white/10 rounded-2xl p-6 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white/80">{isZh ? "本次距离" : "Distance"}</span>
            <span className="text-3xl font-bold text-white">{Math.floor(distance)}m</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/80">{isZh ? "获得金币" : "Coins Earned"}</span>
            <span className="text-2xl font-bold text-yellow-400">+{coins}🪙</span>
          </div>

          <div className="border-t border-white/20 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-white/80">{isZh ? "最高记录" : "High Score"}</span>
              <span className="text-xl font-bold text-yellow-300">{highScore}m</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onMenu}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium transition-colors"
          >
            <Home className="h-5 w-5" />
            {isZh ? "返回菜单" : "Menu"}
          </button>
          
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            {isZh ? "再玩一次" : "Play Again"}
          </button>
        </div>
      </div>
    </div>
  );
}
