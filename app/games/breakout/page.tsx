"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "./hooks/useGameEngine";
import { GameCanvas } from "./components/GameCanvas";
import { GameOver } from "./components/GameOver";
import { getHighScore } from "./utils/storage";

export default function BreakoutGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [highScore, setHighScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    score: number;
    bricksLeft: number;
    isNewRecord: boolean;
  } | null>(null);

  const handleGameOver = (score: number, bricksLeft: number, isNewRecord: boolean) => {
    if (isNewRecord) {
      setHighScore(score);
    }
    setLastResult({ score, bricksLeft, isNewRecord });
    setShowResult(true);
  };

  const {
    gameState,
    score,
    bricksLeft,
    paddleX,
    ball,
    bricks,
    startGame,
    movePaddle,
  } = useGameEngine({
    onGameOver: handleGameOver,
  });

  useEffect(() => {
    setHighScore(getHighScore());
  }, []);

  // Mouse move control
  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
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
      movePaddle(x / rect.width);
    }
  }, [gameState, movePaddle]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="relative max-w-[400px] w-full">
        {gameState === "menu" && (
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center text-white">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 text-blue-400">
                🧱 {isZh ? "打砖块" : "Breakout"}
              </h1>
              <p className="text-gray-300 text-lg">
                {isZh ? "经典街机弹打球打砖块" : "Classic Arcade Brick Breaker"}
              </p>
            </div>
            <div className="text-left bg-slate-700/50 rounded-xl p-4 mb-6 text-gray-200">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• 移动挡板接住小球不让它掉下去</li>
                <li>• 小球反弹打掉所有砖块</li>
                <li>• 不同砖块得分不同</li>
                <li>• 打掉所有砖块你就赢了！</li>
              </ul>
            </div>
            <button
              onClick={() => startGame()}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xl font-bold px-12 py-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              🎮 开始游戏
            </button>
            {highScore > 0 && (
              <div className="mt-4 text-gray-300">
                {isZh ? "最高分：" : "High Score: "}
                <span className="font-bold text-yellow-400 text-xl">{highScore}</span>
              </div>
            )}
          </div>
        )}

        {gameState !== "menu" && (
          <div
            className="relative"
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
          >
            <div className="text-center mb-3 text-white">
              <span className="inline-block bg-slate-800 px-4 py-1 rounded-full">
                {isZh ? "得分：" : "Score: "}{score} | {isZh ? "剩余：" : "Left: "}{bricksLeft}
              </span>
            </div>
            <GameCanvas 
              paddleX={paddleX} 
              ball={ball} 
              bricks={bricks} 
            />

            {gameState === "gameover" && showResult && lastResult && (
              <GameOver
                score={lastResult.score}
                bricksLeft={lastResult.bricksLeft}
                highScore={highScore}
                isNewRecord={lastResult.isNewRecord}
                onRestart={startGame}
                onMenu={() => window.location.href = '/games'}
                isZh={isZh}
                isWin={lastResult.bricksLeft === 0}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
