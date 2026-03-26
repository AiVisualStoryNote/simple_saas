"use client";

import { useState, useEffect, useCallback } from "react";
import { Cell, GameConfig, GameState } from "../types";
import { createEmptyGrid, placeMines, revealCell, checkWin, toggleFlag } from "../utils/game-logic";
import { DEFAULT_CONFIG } from "../constants";
import { getBestScore, saveBestScore } from "../utils/storage";

interface UseGameEngineProps {
  onGameOver: (won: boolean, score: number, bestScore: number, isNewBest: boolean) => void;
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  const startGame = useCallback((config: GameConfig = DEFAULT_CONFIG) => {
    const newGrid = createEmptyGrid(config);
    setGrid(newGrid);
    setScore(0);
    setFirstClick(true);
    setGameState("playing");
    setBestScore(getBestScore());
  }, []);

  const handleCellClick = useCallback((x: number, y: number) => {
    if (gameState !== "playing") return;
    const newGrid = [...grid];

    if (firstClick) {
      // 第一次点击不踩雷
      const minesPlaced = placeMines(newGrid, config, x, y);
      setGrid(minesPlaced);
      setFirstClick(false);
      return;
    }

    const cell = newGrid[y][x];
    if (cell.opened || cell.hasLink) return;

    if (cell.isMine) {
      // 游戏结束
      setGameState("lost");
      const isNewBest = score > bestScore;
      if (isNewBest) {
        saveBestScore(score);
        setBestScore(score);
      }
      onGameOver(false, score, bestScore, isNewBest);
      return;
    }

    const { revealed: newGrid2, gamewon } = revealCell(newGrid, x, y, config);
    setGrid(newGrid2);
    setScore(prev => prev + 1);

    if (gamewon) {
      setGameState("won");
      const isNewBest = score + 1 > bestScore;
      if (isNewBest) {
        saveBestScore(score + 1);
        setBestScore(score + 1);
      }
      onGameOver(true, score + 1, bestScore, isNewBest);
    }
  }, [grid, score, firstClick, gameState, bestScore, onGameOver]);

  const handleToggleFlag = useCallback((x: number, y: number) => {
    if (gameState !== "playing") return;
    const newGrid = toggleFlag(grid, x, y);
    setGrid(newGrid);
  }, [grid, gameState]);

  useEffect(() => {
    setBestScore(getBestScore());
  }, []);

  return {
    gameState,
    grid,
    score,
    bestScore,
    startGame,
    handleCellClick,
    handleToggleFlag,
  };
}
