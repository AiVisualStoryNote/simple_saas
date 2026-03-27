"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "./hooks/useGameEngine";
import { GameCanvas } from "./components/GameCanvas";
import { ScoreBar } from "./components/ScoreBar";
import { GameOver } from "./components/GameOver";
import { getBestScore } from "./utils/storage";

export default function SortWatermelonGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [bestScore, setBestScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    score: number;
    isNewBest: boolean;
  } | null>(null);

  const handleGameOver = (score: number, storedBest: number, isNewBest: boolean) => {
    if (isNewBest) {
      setBestScore(score);
    }
    setLastResult({ score, isNewBest });
    setShowResult(true);
  };

  const {
    gameState,
    blocks,
    score,
    currentX,
    setCurrentX,
    addBlock,
    restartGame,
  } = useGameEngine({
    onGameOver: handleGameOver,
  });

  useEffect(() => {
    setBestScore(getBestScore());
  }, []);

  // 鼠标/触摸控制
  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== "playing") return;
    
    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const canvas = e.currentTarget.querySelector('canvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      setCurrentX(Math.max(0, Math.min(x, rect.width)));
    }
  }, [gameState, setCurrentX]);

  const handleClick = () => {
    if (gameState !== "playing") return;
    addBlock();
  };

  const startGame = () => {
    setShowResult(false);
    setLastResult(null);
    restartGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 flex items-center justify-center p-4">
      <div className="relative max-w-[400px] w-full">
        {gameState === "menu" && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 text-green-500">
                🍉 合成大西瓜
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {isZh ? "网红合成小游戏" : "Viral Merge Game"}
              </p>
            </div>
            <div className="text-left bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4 mb-6 text-gray-700 dark:text-gray-200">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• 点击屏幕放下水果</li>
                <li>• 两个相同水果碰撞会合成更大的水果</li>
                <li>• 从葡萄开始一直合成到西瓜</li>
                <li>• 水果堆出顶部游戏结束</li>
                <li>• 合成越多得分越高！</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl font-bold px-12 py-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              🎮 开始游戏
            </button>
            {bestScore > 0 && (
              <div className="mt-4 text-gray-600 dark:text-gray-300">
                {isZh ? "最高分：" : "Best Score: "}
                <span className="font-bold text-yellow-500 text-xl">{bestScore}</span>
              </div>
            )}
          </div>
        )}

        {gameState !== "menu" && (
          <div
            className="relative"
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            onClick={handleClick}
          >
            <ScoreBar score={score} bestScore={bestScore} />
            <GameCanvas blocks={blocks} currentX={currentX} />

            {gameState === "gameover" && showResult && lastResult && (
              <GameOver
                score={lastResult.score}
                bestScore={bestScore}
                isNewBest={lastResult.isNewBest}
                onRestart={startGame}
                onMenu={() => window.location.href = '/games'}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
