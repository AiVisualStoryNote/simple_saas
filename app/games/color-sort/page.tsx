"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "../hooks/useGameEngine";
import { GameBoard } from "../components/GameBoard";
import { StatusBar } from "../components/StatusBar";
import { WinOverlay } from "../components/WinOverlay";

export default function ColorSortGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const {
    gameState,
    tubes,
    selectedTube,
    moves,
    startGame,
    handleSelectTube,
    undo,
    restartGame,
  } = useGameEngine({
    onWin: () => {},
  });

  const [showResult, setShowResult] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full">
        {gameState === "menu" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 text-purple-600">
                🎨 水杯排序
              </h1>
              <p className="text-gray-600 text-lg">
                {isZh ? "热门休闲益智小游戏" : "Popular Relaxing Puzzle Game"}
              </p>
            </div>
            <div className="text-left bg-purple-50 rounded-xl p-4 mb-6 text-gray-700">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• 点击选择瓶子，再点击目标瓶子</li>
                <li>• 只有最上面颜色相同才能倒入</li>
                <li>• 目标：每个瓶子只装同一种颜色</li>
                <li>• 随时可以撤销上一步操作</li>
              </ul>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => startGame(4, 2)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                简单 (4色)
              </button>
              <button
                onClick={() => startGame(6, 2)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                中等 (6色)
              </button>
              <button
                onClick={() => startGame(8, 2)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                困难 (8色)
              </button>
            </div>
          </div>
        )}

        {gameState !== "menu" && (
          <div className="relative">
            <StatusBar
              moves={moves}
              onUndo={undo}
              onRestart={restartGame}
              canUndo={moves > 0}
            />
            <GameBoard
              tubes={tubes}
              selectedTubeId={selectedTube?.id ?? null}
              onSelectTube={handleSelectTube}
            />

            {gameState === "won" && (
              <WinOverlay
                moves={moves}
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
