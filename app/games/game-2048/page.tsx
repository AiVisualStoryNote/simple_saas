"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Direction } from "./types";
import { useGameEngine } from "./hooks/useGameEngine";
import { GameGrid } from "./components/Grid";
import { ScoreBoard } from "./components/ScoreBoard";
import { GameOverOverlay } from "./components/GameOverOverlay";
import { BG_COLOR } from "./constants";
import { getBestScore } from "./utils/storage";

export default function Game2048() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [startTouch, setStartTouch] = useState({ x: 0, y: 0 });
  const [bestScore, setBestScore] = useState(0);

  const handleGameOver = useCallback((score: number, newBest: number, isNewBest: boolean) => {
    if (isNewBest) {
      setBestScore(newBest);
    }
  }, []);

  const {
    gameState,
    score,
    bestScore: storedBest,
    grid,
    startGame,
    restartGame,
    handleMove,
    continueAfterWin,
  } = useGameEngine({
    onGameOver: handleGameOver,
  });

  useEffect(() => {
    setBestScore(getBestScore());
  }, []);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          handleMove("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          handleMove("down");
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleMove("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          handleMove("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, handleMove]);

  // 触摸滑动控制（移动端）
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
        handleMove(deltaX > 0 ? "right" : "left");
      }
    } else {
      // 垂直滑动
      if (Math.abs(deltaY) >= minSwipeDistance) {
        handleMove(deltaY > 0 ? "down" : "up");
      }
    }
  }, [gameState, startTouch, handleMove]);

  const isNewBest = score > storedBest;

  return (
    <div className={`min-h-screen ${BG_COLOR} flex items-center justify-center p-4`}>
      <div className="max-w-[350px] w-full relative">
        {gameState === "menu" ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 text-[#776e65]">
                2048
              </h1>
              <p className="text-gray-600 text-lg">
                {isZh ? "经典数字合成益智游戏" : "Classic Number Puzzle Game"}
              </p>
            </div>
            <div className="text-left bg-gray-100 rounded-xl p-4 mb-6 text-gray-700">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• <strong>桌面端：</strong>方向键移动所有方块</li>
                <li>• <strong>移动端：</strong>滑动屏幕移动方块</li>
                <li>• 相同数字的方块会合并相加</li>
                <li>• 目标：合成出 2048！</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-[#8f7a66] hover:bg-[#9f8a76] text-white text-xl font-bold px-12 py-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              🎮 开始游戏
            </button>
            {bestScore > 0 && (
              <div className="mt-4 text-gray-600">
                当前最高分：<span className="font-bold text-yellow-600 text-xl">{bestScore}</span>
              </div>
            )}
          </div>
        ) : (
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <ScoreBoard
              score={score}
              bestScore={bestScore}
              onNewGame={restartGame}
            />
            <GameGrid grid={grid} />
            <GameOverOverlay
              gameState={gameState}
              score={score}
              bestScore={bestScore}
              isNewBest={isNewBest}
              onRestart={restartGame}
              onContinue={continueAfterWin}
            />
            <p className="text-center text-sm text-gray-500 mt-4">
              {isZh ? "提示：到达2048后可以继续游戏挑战更高分" : "Hint: Keep playing after 2048 for higher score"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
