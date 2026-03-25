"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "../hooks/useGameEngine";
import { GameCanvas } from "../components/GameCanvas";
import { GameHUD } from "../components/GameHUD";
import { GameOver } from "../components/GameOver";
import { PauseMenu } from "../components/PauseMenu";
import { getHighScore } from "../utils/storage";

export default function JumpJumpGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [highScore, setHighScore] = useState(0);

  const handleGameOver = useCallback((score: number, isNewRecord: boolean) => {
    if (isNewRecord) {
      setHighScore(score);
    }
  }, []);

  const {
    gameState,
    score,
    currentPower,
    blocks,
    playerX,
    playerY,
    playerRadius,
    isCharging,
    startGame,
    pauseGame,
    resumeGame,
    goToMenu,
    startCharge,
    jump,
  } = useGameEngine({
    onGameOver: handleGameOver,
  });

  useEffect(() => {
    setHighScore(getHighScore());
  }, []);

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "playing") {
          startCharge();
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

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, startCharge, jump, pauseGame, resumeGame]);

  // 鼠标/触摸事件
  const handlePointerDown = () => {
    if (gameState === "playing") {
      startCharge();
    }
  };

  const handlePointerUp = () => {
    if (gameState === "playing") {
      jump();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-blue-100 flex items-center justify-center p-4">
      <div className="relative w-[800px] max-w-full" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        {gameState === "menu" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                跳一跳
              </h1>
              <p className="text-gray-600 text-lg">
                {isZh ? "经典网红小游戏" : "Classic Viral Game"}
              </p>
            </div>
            <div className="text-left bg-blue-50 rounded-xl p-4 mb-6 text-gray-700">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• <strong>桌面端：</strong>按住空格键蓄力，松开跳跃</li>
                <li>• <strong>移动端：</strong>按住屏幕蓄力，松开跳跃</li>
                <li>• 跳到方块中心得分更高</li>
                <li>• 掉下去游戏结束，挑战最高分！</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xl font-bold px-12 py-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
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

        {gameState === "playing" && (
          <div className="relative">
            <GameCanvas
              blocks={blocks}
              playerX={playerX}
              playerY={playerY}
              playerRadius={playerRadius}
              currentPower={currentPower}
              isCharging={isCharging}
            />
            <GameHUD score={score} highScore={highScore} onPause={pauseGame} />
          </div>
        )}

        {gameState === "paused" && (
          <div className="relative">
            <GameCanvas
              blocks={blocks}
              playerX={playerX}
              playerY={playerY}
              playerRadius={playerRadius}
              currentPower={currentPower}
              isCharging={isCharging}
            />
            <GameHUD score={score} highScore={highScore} onPause={() => {}} />
            <PauseMenu
              onResume={resumeGame}
              onRestart={() => {
                resumeGame();
                startGame();
              }}
              onMenu={goToMenu}
            />
          </div>
        )}

        {gameState === "gameover" && (
          <div className="relative">
            <GameCanvas
              blocks={blocks}
              playerX={playerX}
              playerY={playerY}
              playerRadius={playerRadius}
              currentPower={currentPower}
              isCharging={isCharging}
            />
            <GameOver
              score={score}
              highScore={highScore}
              isNewRecord={score > highScore}
              onRestart={startGame}
              onMenu={goToMenu}
            />
          </div>
        )}
      </div>
    </div>
  );
}
