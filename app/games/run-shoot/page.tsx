"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "./hooks/useGameEngine";
import { GameCanvas } from "./components/GameCanvas";
import { GameHUD } from "./components/GameHUD";
import { GameOver } from "./components/GameOver";
import { PauseMenu } from "./components/PauseMenu";
import { getHighScore } from "./utils/storage";

export default function RunShootGame() {
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
    playerY,
    playerHp,
    bullets,
    enemies,
    powerUps,
    hasMultishot,
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

  // ESC 暂停
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
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 flex items-center justify-center p-4">
      <div className="relative w-[800px] max-w-full">
        {gameState === "menu" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                🏃 酷跑射击
              </h1>
              <p className="text-gray-600 text-lg">
                {isZh ? "热门网红无尽射击酷跑" : "Popular Viral Endless Run & Shoot"}
              </p>
            </div>
            <div className="text-left bg-green-50 rounded-xl p-4 mb-6 text-gray-700">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• <strong>桌面端：</strong>拖动玩家上下移动，自动射击</li>
                <li>• <strong>移动端：</strong>手指拖动玩家上下移动，自动射击</li>
                <li>• 击杀敌人得分，敌人会越来越快</li>
                <li>• 收集道具：加血、减速、多重射击</li>
                <li>• 撞到敌人扣血，血条空了游戏结束</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl font-bold px-12 py-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
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

        {gameState !== "menu" && (
          <>
            <GameCanvas
              playerY={playerY}
              playerHp={playerHp}
              bullets={bullets}
              enemies={enemies}
              powerUps={powerUps}
              onMouseMove={movePlayer}
            />
            <GameHUD
              score={score}
              highScore={highScore}
              playerHp={playerHp}
              hasMultishot={hasMultishot}
              onPause={pauseGame}
            />

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
          </>
        )}
      </div>
    </div>
  );
}
