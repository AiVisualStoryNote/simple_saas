"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "./hooks/useGameEngine";
import { CharacterSelect } from "./components/CharacterSelect";
import { GameCanvas } from "./components/GameCanvas";
import { GameHUD } from "./components/GameHUD";
import { GameOver } from "./components/GameOver";
import { Shop } from "./components/Shop";
import { PauseMenu } from "./components/PauseMenu";
import { getProgress } from "./utils/storage";
import { GROUND_Y } from "./constants";

export default function RunningMomentGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [selectedCharacterId, setSelectedCharacterId] = useState("runner");
  const [showShop, setShowShop] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const handleGameOver = useCallback((distance: number, coins: number, isNewRecord: boolean) => {
    const progress = getProgress();
    setHighScore(progress.highScore);
  }, []);

  const {
    gameState,
    distance,
    coinsCollected,
    hp,
    playerY,
    hasShield,
    isInvincible,
    magnetActive,
    slowActive,
    obstacles,
    items,
    coins,
    character,
    jump,
    startGame,
    pauseGame,
    resumeGame,
    goToMenu,
  } = useGameEngine({
    characterId: selectedCharacterId,
    isZh,
    onGameOver: handleGameOver,
  });

  useEffect(() => {
    const progress = getProgress();
    setHighScore(progress.highScore);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
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

  const handleCanvasClick = () => {
    if (gameState === "playing") {
      jump();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200 flex items-center justify-center p-4">
      <div className="relative w-[800px] max-w-full">
        {gameState === "menu" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-purple-700 mb-2">
                🏃 Running Moment
              </h1>
              <p className="text-purple-600">
                {isZh ? "奔跑时刻" : "Endless Runner Game"}
              </p>
            </div>
            
            <CharacterSelect
              isZh={isZh}
              onSelect={(id) => {
                setSelectedCharacterId(id);
                startGame();
              }}
              onOpenShop={() => setShowShop(true)}
            />
          </div>
        )}

        {gameState === "playing" && (
          <div className="relative" onClick={handleCanvasClick}>
            <GameCanvas
              playerX={100}
              playerY={playerY}
              character={character}
              obstacles={obstacles}
              items={items}
              coins={coins}
              hasShield={hasShield}
              isInvincible={isInvincible}
              isZh={isZh}
            />
            <GameHUD
              distance={distance}
              hp={hp}
              coins={coinsCollected}
              isZh={isZh}
              onPause={pauseGame}
            />
          </div>
        )}

        {gameState === "paused" && (
          <div className="relative" onClick={handleCanvasClick}>
            <GameCanvas
              playerX={100}
              playerY={playerY}
              character={character}
              obstacles={obstacles}
              items={items}
              coins={coins}
              hasShield={hasShield}
              isInvincible={isInvincible}
              isZh={isZh}
            />
            <GameHUD
              distance={distance}
              hp={hp}
              coins={coinsCollected}
              isZh={isZh}
              onPause={() => {}}
            />
            <PauseMenu
              isZh={isZh}
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
          <div className="relative" onClick={handleCanvasClick}>
            <GameCanvas
              playerX={100}
              playerY={GROUND_Y}
              character={character}
              obstacles={[]}
              items={[]}
              coins={[]}
              hasShield={false}
              isInvincible={false}
              isZh={isZh}
            />
            <GameOver
              distance={distance}
              coins={coinsCollected}
              isNewRecord={distance > highScore}
              highScore={highScore}
              isZh={isZh}
              onRestart={() => startGame()}
              onMenu={goToMenu}
            />
          </div>
        )}

        {showShop && (
          <Shop
            isZh={isZh}
            onClose={() => setShowShop(false)}
          />
        )}
      </div>
    </div>
  );
}
