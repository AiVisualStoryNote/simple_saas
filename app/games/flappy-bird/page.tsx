"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "./hooks/useGameEngine";
import { GameCanvas } from "./components/GameCanvas";
import { GameHUD } from "./components/GameHUD";
import { GameOver } from "./components/GameOver";
import { PauseMenu } from "./components/PauseMenu";
import { getHighScore } from "./utils/storage";

export default function FlappyBirdGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [highScore, setHighScore] = useState(0);

  const handleGameOver = (score: number, isNewRecord: boolean) => {
    if (isNewRecord) {
      setHighScore(score);
    }
  };

  const {
    gameState,
    score,
    birdY,
    birdRotation,
    pipes,
    startGame,
    jump,
    pauseGame,
    resumeGame,
    goToMenu,
  } = useGameEngine({
    onGameOver: handleGameOver,
  });

  useEffect(() => {
    setHighScore(getHighScore());
  }, []);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "playing") {
          jump();
        }
      }
      if (e.code === "Escape") {
        if (gameState === "playing") {
          pauseGame();
        } else if (gameState === "paused") {
          resumeGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, jump, pauseGame, resumeGame]);

  // 点击/触摸控制
  const handleCanvasClick = () => {
    if (gameState === "playing") {
      jump();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 flex items-center justify-center p-4">
      <div className="relative w-[800px] max-w-full" onClick={handleCanvasClick}>
        {gameState === "idle" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3">
                🐤 Flappy Bird
              </h1>
              <p className="text-gray-600 text-lg">
                {isZh ? "经典网红虐心小游戏" : "Classic Viral Game"}
              </p>
            </div>
            <div className="text-left bg-blue-50 rounded-xl p-4 mb-6 text-gray-700">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• <strong>桌面端：</strong>按空格键跳跃</li>
                <li>• <strong>移动端：</strong>点击屏幕跳跃</li>
                <li>• 躲避管道，穿过一个管道得一分</li>
                <li>• 撞到管道或地面游戏结束</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-800 text-xl font-bold px-12 py-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              🎮 开始游戏
            </button>
            {highScore > 0 && (
              <div className="mt-4 text-gray-600">
                当前最高分：<span className="font-bold text-yellow-600 text-xl">{highScore}</span>
              </div>
            )}
          </div>
        )}

        {gameState !== "idle" && (
          <>
            <GameCanvas
              birdY={birdY}
              birdRotation={birdRotation}
              pipes={pipes}
            />
            <GameHUD score={score} highScore={highScore} onPause={pauseGame} />

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

            {gameState === "gameover" && (
              <GameOver
                score={score}
                highScore={highScore}
                isNewRecord={score > highScore}
                onRestart={startGame}
                onMenu={goToMenu}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
