"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "./hooks/useGameEngine";
import { GameCanvas } from "./components/GameCanvas";
import { GameHUD } from "./components/GameHUD";
import { GameOver } from "./components/GameOver";
import { PauseMenu } from "./components/PauseMenu";
import { getHighScore } from "./utils/storage";

export default function AircraftWarGame() {
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
    playerX,
    playerY,
    playerHp,
    bullets,
    enemies,
    startGame,
    pauseGame,
    resumeGame,
    goToMenu,
    movePlayer,
  } = useGameEngine({
    onGameOver: handleGameOver,
  });

  useEffect(() => {
    setHighScore(getHighScore());
  }, []);

  // 键盘 ESC 暂停
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [gameState, pauseGame, resumeGame]);

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
      <div className="relative w-[800px] max-w-full">
        {gameState === "menu" && (
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center text-white">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 text-blue-400">
                ✈️ 打飞机
              </h1>
              <p className="text-gray-300 text-lg">
                {isZh ? "经典微信弹幕小游戏" : "Classic WeChat Viral Game"}
              </p>
            </div>
            <div className="text-left bg-gray-800/50 rounded-xl p-4 mb-6 text-gray-200">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• <strong>桌面端：</strong>拖动飞机移动，自动射击</li>
                <li>• <strong>移动端：</strong>手指拖动飞机移动，自动射击</li>
                <li>• 击落敌机得分，不同敌机分数不同</li>
                <li>• 敌机撞机减血，血条空了游戏结束</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xl font-bold px-12 py-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
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
          <>
            <GameCanvas
              playerX={playerX}
              playerY={playerY}
              playerHp={playerHp}
              bullets={bullets}
              enemies={enemies}
              onMouseMove={movePlayer}
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
