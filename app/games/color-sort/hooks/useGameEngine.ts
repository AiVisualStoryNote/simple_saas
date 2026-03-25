"use client";

import { useState, useEffect, useCallback } from "react";
import { Tube } from "../types";
import { DEFAULT_CONFIG } from "../constants";
import { generateGame, canMove, move, checkWin } from "../utils/game-logic";

interface UseGameEngineProps {
  onWin: (moves: number) => void;
}

export function useGameEngine({ onWin }: UseGameEngineProps) {
  const [tubes, setTubes] = useState<Tube[]>([]);
  const [selectedTube, setSelectedTube] = useState<Tube | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [history, setHistory] = useState<Tube[][]>([]);

  const startGame = useCallback((colorCount: number, emptyTubes: number) => {
    const newTubes = generateGame(colorCount, emptyTubes, DEFAULT_CONFIG.tubeCapacity);
    setTubes(newTubes);
    setSelectedTube(null);
    setMoves(0);
    setHistory([]);
    setGameState("playing");
  }, []);

  const handleSelectTube = useCallback((tube: Tube) => {
    if (gameState !== "playing") return;

    // 如果已经选中了一个管子
    if (selectedTube) {
      // 如果选的是同一个，取消选中
      if (selectedTube.id === tube.id) {
        setSelectedTube(null);
        return;
      }

      // 能不能移动
      if (canMove(selectedTube, tube, DEFAULT_CONFIG.tubeCapacity)) {
        // 保存历史
        setHistory(prev => [...prev, tubes]);
        // 移动
        const newTubes = move(selectedTube, tube, tubes);
        setTubes(newTubes);
        setMoves(prev => prev + 1);
        setSelectedTube(null);

        // 检查赢了没
        if (checkWin(newTubes, DEFAULT_CONFIG.tubeCapacity)) {
          setGameState("won");
          onWin(moves + 1);
        }
      } else {
        // 不能移动，选新的管子
        setSelectedTube(tube);
      }
    } else {
      // 没有选中，选这个管子，如果不是空的才能选
      if (tube.colors.length > 0) {
        setSelectedTube(tube);
      }
    }
  }, [selectedTube, tubes, gameState, moves, onWin]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prevState = history[history.length - 1];
    setTubes(prevState);
    setHistory(prev => prev.slice(0, prev.length - 1));
    setMoves(prev => prev - 1);
    setSelectedTube(null);
  }, [history]);

  const restartGame = useCallback(() => {
    const colorCount = DEFAULT_CONFIG.tubeCount - DEFAULT_CONFIG.emptyTubes;
    startGame(colorCount, DEFAULT_CONFIG.emptyTubes);
  }, [startGame]);

  return {
    gameState,
    tubes,
    selectedTube,
    moves,
    startGame,
    handleSelectTube,
    undo,
    restartGame,
  };
}
