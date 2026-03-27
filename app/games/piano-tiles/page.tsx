"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useGameEngine } from "./hooks/useGameEngine";
import { GameBoard } from "./components/GameBoard";
import { GameOver } from "./components/GameOver";
import { getBestScore } from "./utils/storage";

export default function PianoTilesGame() {
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
    score,
    speed,
    tiles,
    startGame,
    tapTile,
  } = useGameEngine({
    onGameOver: handleGameOver,
  });

  useEffect(() => {
    setBestScore(getBestScore());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
      <div className="relative max-w-[400px] w-full">
        {gameState === "menu" && (
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center text-white">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-3 text-white">
                🎹 {isZh ? "别踩白块" : "Piano Tiles"}
              </h1>
              <p className="text-gray-300 text-lg">
                {isZh ? "考验手速的音乐小游戏" : "Test your tapping speed"}
              </p>
            </div>
            <div className="text-left bg-gray-700/50 rounded-xl p-4 mb-6 text-gray-200">
              <h3 className="font-bold mb-2">🎮 玩法说明：</h3>
              <ul className="space-y-1 text-sm">
                <li>• 只点击黑色方块，不要踩到白色</li>
                <li>• 越往后速度越快，考验反应</li>
                <li>• 连续不失误连击得分更高</li>
                <li>• 错踩白块游戏立即结束</li>
              </ul>
            </div>
            <button
              onClick={() => startGame()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xl font-bold px-12 py-4 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              🎮 开始游戏
            </button>
            {bestScore > 0 && (
              <div className="mt-4 text-gray-300">
                {isZh ? "最好成绩：" : "Best: "}
                <span className="font-bold text-yellow-400 text-xl">{bestScore}</span>
              </div>
            )}
          </div>
        )}

        {gameState === "playing" && (
          <div className="relative">
            <div className="text-center mb-3">
              <span className="inline-block bg-gray-800 px-6 py-2 rounded-full text-white text-xl font-bold">
                {score}
              </span>
              <span className="ml-3 text-gray-400">
                {isZh ? "速度：" : "Speed: "}{speed}
              </span>
            </div>
            <GameBoard tiles={tiles} onTap={tapTile} />
          </div>
        )}

        {gameState === "gameover" && showResult && lastResult && (
          <GameOver
            score={lastResult.score}
            bestScore={bestScore}
            isNewBest={lastResult.isNewBest}
            onRestart={startGame}
            onMenu={() => window.location.href = '/games'}
            isZh={isZh}
          />
        )}
      </div>
    </div>
  );
}
