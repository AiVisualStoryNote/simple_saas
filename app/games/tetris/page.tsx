"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "./hooks/useGameEngine";
import { GameCanvas } from "./components/GameCanvas";
import { GameHUD } from "./components/GameHUD";
import { GameOver } from "./components/GameOver";
import { PauseMenu } from "./components/PauseMenu";
import { getHighScore } from "./utils/storage";

export default function TetrisGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [highScore, setHighScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    score: number;
    lines: number;
    level: number;
    isNewRecord: boolean;
  } | null>(null);

  const handleGameOver = (score: number, lines: number, level: number, isNewRecord: boolean) => {
    if (isNewRecord) {
      setHighScore(score);
    }
    setLastResult({ score, lines, level, isNewRecord });
    setShowResult(true);
  };

  const {
    gameState,
    score,
    lines,
    level,
    board,
    currentPiece,
    startGame,
    pauseGame,
    resumeGame,
    goToMenu,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
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
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowDown":
          e.preventDefault();
          softDrop();
          break;
        case "ArrowUp":
          e.preventDefault();
          rotate();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
        case "Escape":
          e.preventDefault();
          pauseGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, moveLeft, moveRight, rotate, softDrop, hardDrop, pauseGame, resumeGame]);

  // 触摸控制（移动端简化）
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
      if (Math.abs(deltaX) >= minSwipeDistance) {
        deltaX > 0 ? moveRight() : moveLeft();
      }
    } else {
      if (Math.abs(deltaY) >= minSwipeDistance) {
        deltaY > 0 ? softDrop() : rotate();
      }
    }
  }, [gameState, startTouch, moveLeft, moveRight, rotate, softDrop]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-900 flex items-center justify-center p-4">
      <div className="relative max-w-[320px] w-full">
        {gameState === "menu" && (
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center text-white">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 text-cyan-400">
                🟦 俄罗斯方块
              </h1>
              <p className="text-gray-300 text-lg">
                {isZh ? "经典方块消除游戏" : "Classic Block Puzzle"}
              </p>
            </div>
            <div className="text-left bg-slate-700/50 rounded-xl p-4 mb-6 text-gray-200">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• <strong>方向键：</strong>左右移动/下移</li>
                <li>• <strong>上方向：</strong>旋转</li>
                <li>• <strong>空格：</strong>直接落底</li>
                <li>• 消除一行得10分，连击得分更高</li>
                <li>• 等级越高，下落速度越快</li>
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
                {isZh ? "最高分：" : "High Score: "}
                <span className="font-bold text-yellow-400 text-xl">{highScore}</span>
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
            <GameHUD score={score} lines={lines} level={level} highScore={highScore} onPause={pauseGame} />
            <GameCanvas board={board} currentPiece={currentPiece} />

            {gameState === "paused" && (
              <PauseMenu
                onResume={resumeGame}
                onRestart={() => {
                  resumeGame();
                  startGame();
                }}
                onMenu={goToMenu}
                isZh={isZh}
              />
            )}

            {gameState === "gameover" && showResult && lastResult && (
              <GameOver
                score={lastResult.score}
                lines={lastResult.lines}
                level={lastResult.level}
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
