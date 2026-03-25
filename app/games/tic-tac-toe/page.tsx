"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "../hooks/useGameEngine";
import { Board } from "../components/Board";
import { Stats } from "../components/Stats";
import { GameResult } from "../components/GameResult";
import { CellValue } from "../types";

export default function TicTacToeGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    winner: CellValue;
  } | null>(null);

  const handleGameOver = (winner: CellValue) => {
    setLastResult({ winner });
    setShowResult(true);
  };

  const {
    gameState,
    board,
    stats,
    startGame,
    handleMove,
  } = useGameEngine({
    onGameOver: handleGameOver,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {gameState === "menu" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 text-gray-800">
                ⭕❌ 井字棋
              </h1>
              <p className="text-gray-600 text-lg">
                {isZh ? "经典AI对战小游戏" : "Classic vs AI Game"}
              </p>
            </div>
            <div className="text-left bg-blue-50 rounded-xl p-4 mb-6 text-gray-700">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• 你是 X，AI 是 O</li>
                <li>• 点击空格落子</li>
                <li>• 三个连成一线获胜</li>
                <li>• 简单AI，看看你能赢吗！</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xl font-bold px-12 py-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              🎮 开始游戏
            </button>
            {stats.wins + stats.losses + stats.draws > 0 && (
              <div className="mt-6">
                <Stats stats={stats} />
              </div>
            )}
          </div>
        )}

        {gameState !== "menu" && (
          <div className="relative flex flex-col items-center">
            <Stats stats={stats} />
            <Board board={board} onCellClick={handleMove} />
            {showResult && lastResult && (
              <GameResult
                winner={lastResult.winner}
                stats={stats}
                onRestart={startGame}
                onMenu={() => window.location.reload()}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
