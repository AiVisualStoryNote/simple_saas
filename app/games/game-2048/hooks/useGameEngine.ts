"use client";

import { useState, useEffect, useCallback } from "react";
import { Grid, Direction, GameState } from "../types";
import { initGame, move, isGameOver, hasWon } from "../utils/game-logic";
import { getBestScore, saveBestScore } from "../utils/storage";

interface UseGameEngineProps {
  onGameOver: (score: number, bestScore: number, isNewBest: boolean) => void;
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const startGame = useCallback(() => {
    const newGrid = initGame();
    setGrid(newGrid);
    setScore(0);
    setGameState("playing");
    setBestScore(getBestScore());
  }, []);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleMove = useCallback((direction: Direction) => {
    if (gameState !== "playing") return;

    const result = move(grid, direction);
    if (!result.moved) return;

    setGrid(result.grid);
    setScore(prev => prev + result.scoreGained);

    if (hasWon(result.grid)) {
      setGameState("win");
      return;
    }

    if (isGameOver(result.grid)) {
      setGameState("gameover");
      const currentBest = getBestScore();
      const isNewBest = score + result.scoreGained > currentBest;
      if (isNewBest) {
        saveBestScore(score + result.scoreGained);
        setBestScore(score + result.scoreGained);
      }
      onGameOver(score + result.scoreGained, bestScore, isNewBest);
      return;
    }
  }, [grid, score, bestScore, gameState, onGameOver]);

  const continueAfterWin = useCallback(() => {
    setGameState("playing");
  }, []);

  useEffect(() => {
    setBestScore(getBestScore());
  }, []);

  return {
    gameState,
    score,
    bestScore,
    grid,
    startGame,
    restartGame,
    handleMove,
    continueAfterWin,
  };
}
