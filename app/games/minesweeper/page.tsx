"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "../hooks/useGameEngine";
import { GameGrid } from "../components/Grid";
import { StatusBar } from "../components/StatusBar";
import { GameResult } from "../components/GameResult";

export default function MinesweeperGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    won: boolean;
    time: number;
    bestTime: number | null;
  } | null>(null);

  const handleGameOver = (won: boolean, time: number, bestTime: number | null) => {
    setLastResult({ won, time, bestTime });
    setShowResult(true);
  };

  const {
    gameState,
    grid,
    difficulty,
    flagsLeft,
    time,
    bestTime,
    startGame,
    restartGame,
    handleCellClick,
    handleRightClick,
  } = useGameEngine({
    onGameOver: handleGameOver,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="relative">
        {gameState === "menu" ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 text-gray-700">
                💣 扫雷
              </h1>
              <p className="text-gray-600 text-lg">
                {isZh ? "经典益智扫雷游戏" : "Classic Puzzle Game"}
              </p>
            </div>
            <div className="text-left bg-gray-100 rounded-xl p-4 mb-6 text-gray-700">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• 左键点击翻开格子</li>
                <li>• 右键点击标记地雷</li>
                <li>• 数字表示周围有多少颗地雷</li>
                <li>• 翻开所有非地雷格子获胜</li>
                <li>• 支持三档难度选择</li>
              </ul>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => startGame("easy")}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                简单 (9×9 - 10雷)
              </button>
              <button
                onClick={() => startGame("medium")}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                中等 (16×16 - 40雷)
              </button>
              <button
                onClick={() => startGame("hard")}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                困难 (16×30 - 99雷)
              </button>
            </div>
            {bestTime > 0 && (
              <div className="mt-4 text-gray-600">
                当前最佳记录：<span className="font-bold text-green-600">{bestTime} 秒</span> ({difficulty.name})
              </div>
            )}
          </div>
        ) : (
          <div>
            <StatusBar
              flagsLeft={flagsLeft}
              time={time}
              difficulty={difficulty}
              onRestart={restartGame}
            />
            <GameGrid
              grid={grid}
              onCellClick={handleCellClick}
              onCellRightClick={handleRightClick}
            />
            {showResult && lastResult && (
              <GameResult
                won={lastResult.won}
                time={lastResult.time}
                bestTime={lastResult.bestTime}
                difficulty={difficulty}
                onRestart={restartGame}
                onMenu={() => window.location.reload()}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
