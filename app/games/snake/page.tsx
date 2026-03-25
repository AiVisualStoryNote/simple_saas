"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "./hooks/useGameEngine";
import { GameCanvas } from "./components/GameCanvas";
import { GameHUD } from "./components/GameHUD";
import { GameOver } from "./components/GameOver";
import { PauseMenu } from "./components/PauseMenu";
import { Direction } from "./types";
import { getHighScore } from "./utils/storage";

export default function SnakeGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [highScore, setHighScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    score: number;
    isNewRecord: boolean;
  } | null>(null);

  const handleGameOver = (score: number, isNewRecord: boolean) => {
    if (isNewRecord) {
      setHighScore(score);
    }
    setLastResult({ score, isNewRecord });
    setShowResult(true);
  };

  const {
    gameState,
    score,
    snake,
    food,
    startGame,
    pauseGame,
    resumeGame,
    goToMenu,
    changeDirection,
  } = useGameEngine({
    onGameOver: handleGameOver,
  });

  useEffect(() => {
    setHighScore(getHighScore());
  }, []);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") {
        if (e.key === "Escape" && gameState === "paused") {
          resumeGame();
        }
        return;
      }

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          changeDirection("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          changeDirection("down");
          break;
        case "ArrowLeft":
          e.preventDefault();
          changeDirection("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          changeDirection("right");
          break;
        case "Escape":
          e.preventDefault();
          pauseGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, changeDirection, pauseGame, resumeGame]);

  // 触摸滑动控制（移动端）
  const [startTouch, setStartTouch] = useState({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (gameState !== "playing") return;
    const touch = e.touches[0];
    setStartTouch({ x: touch.clientX, y: touch.clientY });
  }, [gameState]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (gameState !== "playing") return;
    if (!e.changedTouches[0]) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startTouch.x;
    const deltaY = touch.clientY - startTouch.y;

    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (Math.abs(deltaX) >= minSwipeDistance) {
        changeDirection(deltaX > 0 ? "right" : "left");
      }
    } else {
      // 垂直滑动
      if (Math.abs(deltaY) >= minSwipeDistance) {
        changeDirection(deltaY > 0 ? "down" : "up");
      }
    }
  }, [gameState, startTouch, changeDirection]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="relative max-w-[400px] w-full">
        {gameState === "menu" && (
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center text-white">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 text-cyan-400">
                🐍 贪吃蛇
              </h1>
              <p className="text-gray-300 text-lg">
                {isZh ? "经典街机贪吃蛇" : "Classic Arcade Game"}
              </p>
            </div>
            <div className="text-left bg-gray-700/50 rounded-xl p-4 mb-6 text-gray-200">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• <strong>桌面端：</strong>方向键控制移动</li>
                <li>• <strong>移动端：</strong>滑动屏幕控制方向</li>
                <li>• 吃到食物变长，得分增加</li>
                <li>• 撞到墙或者自己游戏结束</li>
                <li>• 越吃越长速度越快，挑战最高分！</li>
              </ul>
            </div>
            <button
              onClick={() => startGame()}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xl font-bold px-12 py-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              🎮 开始游戏
            </button>
            {highScore > 0 && (
              <div className="mt-4 text-gray-300">
                当前最高分：<span className="font-bold text-yellow-400 text-xl">{highScore}</span>
              </div>
            )}
          </div>
        )}

        {gameState !== "menu" && (
          <div
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <GameHUD score={score} highScore={highScore} onPause={pauseGame} />
            <GameCanvas snake={snake} food={food} />

            {gameState === "paused" && (
              <PauseMenu
                onResume={resumeGame}
                onRestart={() => {
                  resumeGame();
                  startGame();
                }}
                onMenu={goToMenu}
              />
            )}

            {gameState === "gameover" && showResult && lastResult && (
              <GameOver
                score={lastResult.score}
                highScore={highScore}
                isNewRecord={lastResult.isNewRecord}
                onRestart={startGame}
                onMenu={goToMenu}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
