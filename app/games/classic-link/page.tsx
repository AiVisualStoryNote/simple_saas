"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "../hooks/useGameEngine";
import { GameGrid } from "../components/GameGrid";
import { StatusBar } from "../components/StatusBar";
import { GameOver } from "../components/GameOver";
import { DEFAULT_CONFIG } from "../constants";

export default function ClassicLinkGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    won: boolean;
    score: number;
    bestScore: number;
    isNewBest: boolean;
  } | null>(null);

  const handleGameOver = (won: boolean, score: number, bestScore: number, isNewBest: boolean) => {
    setLastResult({ won, score, bestScore, isNewBest });
    setShowResult(true);
  };

  const {
    gameState,
    grid,
    score,
    bestScore,
    startGame,
    handleCellClick,
    handleToggleFlag,
  } = useGameEngine({
    onGameOver: handleGameOver,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {gameState !== "menu" && (
          <StatusBar
            score={score}
            bestScore={bestScore}
            onNewGame={() => startGame(DEFAULT_CONFIG)}
          />
        )}

        {gameState !== "menu" && <GameGrid grid={grid} onCellClick={handleCellClick} onCellToggle={handleToggleFlag} />}

        {showResult && lastResult && (
          <GameOver
            won={lastResult.won}
            score={lastResult.score}
            bestScore={lastResult.bestScore}
            isNewBest={lastResult.isNewBest}
            onRestart={() => {
              setShowResult(false);
              startGame(DEFAULT_CONFIG);
            }}
            onMenu={() => {
              setShowResult(false);
              window.location.reload();
            }}
          />
        )}

        {gameState === "menu" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 text-purple-600">
                🔗 经典连连看
              </h1>
              <p className="text-gray-600 text-lg">
                {isZh ? "经典消除益智小游戏" : "Classic matching puzzle game"}
              </p>
            </div>
            <div className="text-left bg-purple-50 rounded-xl p-4 mb-6 text-gray-700">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• 点击翻开格子</li>
                <li>• 右键标记插旗子</li>
                <li>• 连接两个相同图案消除</li>
                <li>• 清完所有方块获得胜利</li>
              </ul>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => startGame(DEFAULT_CONFIG)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xl font-bold px-12 py-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
              >
                🎮 开始游戏
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
