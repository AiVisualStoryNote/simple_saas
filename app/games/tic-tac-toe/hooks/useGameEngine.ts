"use client";

import { useState, useEffect, useCallback } from "react";
import { Board, GameState, CellValue } from "../types";
import { checkWinner, isBoardFull, getAiMove } from "../utils/game-logic";
import { getStats, saveStats } from "../utils/storage";
import { GameStats } from "../constants";

interface UseGameEngineProps {
  onGameOver: (winner: CellValue, stats: GameStats) => void;
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>("X"); // X is player, O is AI
  const [stats, setStats] = useState<GameStats>(getStats());

  const startGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setGameState("playing");
    setStats(getStats());
  }, []);

  const handleMove = useCallback((index: number) => {
    if (gameState !== "playing" || board[index] !== null) return;

    // Player move
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    // Check if player won
    const result = checkWinner(newBoard);
    if (result.winner) {
      setGameState("won");
      const newStats = { ...stats, wins: stats.wins + 1 };
      setStats(newStats);
      saveStats(newStats);
      onGameOver("X", newStats);
      return;
    }

    if (isBoardFull(newBoard)) {
      setGameState("draw");
      const newStats = { ...stats, draws: stats.draws + 1 };
      setStats(newStats);
      saveStats(newStats);
      onGameOver(null, newStats);
      return;
    }

    // AI move
    setTimeout(() => {
      const aiIndex = getAiMove(newBoard);
      newBoard[aiIndex] = "O";
      setBoard([...newBoard]);

      // Check if AI won
      const aiResult = checkWinner(newBoard);
      if (aiResult.winner) {
        setGameState("won");
        const newStats = { ...stats, losses: stats.losses + 1 };
        setStats(newStats);
        saveStats(newStats);
        onGameOver("O", newStats);
        return;
      }

      if (isBoardFull(newBoard)) {
        setGameState("draw");
        const newStats = { ...stats, draws: stats.draws + 1 };
        setStats(newStats);
        saveStats(newStats);
        onGameOver(null, newStats);
        return;
      }
    }, 300);
  }, [board, gameState, stats, onGameOver]);

  return {
    gameState,
    board,
    currentPlayer,
    stats,
    startGame,
    handleMove,
  };
}
