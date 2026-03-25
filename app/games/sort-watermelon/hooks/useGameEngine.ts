"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Block, GameState } from "../types";
import { GAME_CONFIG } from "../constants";
import { checkCollision } from "../utils/collision";
import { getBestScore, saveBestScore } from "../utils/storage";
import { FRUIT_SIZES } from "../types";

interface UseGameEngineProps {
  onGameOver: (score: number, bestScore: number, isNewBest: boolean) => void;
}

let nextId = 0;

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentX, setCurrentX] = useState(GAME_CONFIG.canvasWidth / 2);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const animationRef = useRef<number | null>(null);
  let movingBlock: Block | null = null;

  const startGame = useCallback(() => {
    setBlocks([]);
    setScore(0);
    setCurrentX(GAME_CONFIG.canvasWidth / 2);
    nextId = 0;
    setGameState("playing");
    setBestScore(getBestScore());
    animationRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    // 让所有方块下落
    setBlocks(prev => {
      const newBlocks = prev.map(block => ({
        ...block,
        y: block.y + GAME_CONFIG.gravity,
      }));

      // 检查碰撞合并
      let changed = false;
      let newScore = score;

      for (let i = 0; i < newBlocks.length; i++) {
        for (let j = i + 1; j < newBlocks.length; j++) {
          const a = newBlocks[i];
          const b = newBlocks[j];
          if (a.level === b.level && checkCollision(a, b)) {
            // 合并
            const mergedLevel = a.level + 1;
            const newX = (a.x + b.x) / 2;
            const newY = Math.max(a.y, b.y);
            newBlocks[i] = {
              id: nextId++,
              x: newX,
              y: newY,
              level: mergedLevel,
              merged: true,
            };
            newBlocks.splice(j, 1);
            newScore += FRUIT_SIZES[mergedLevel].value;
            changed = true;
            break;
          }
        }
        if (changed) break;
      }

      setScore(newScore);

      // 检查游戏结束（碰到顶部）
      const gameOver = newBlocks.some(block => block.y <= 0);
      if (gameOver) {
        setGameState("gameover");
        const isNewBest = newScore > bestScore;
        if (isNewBest) {
          saveBestScore(newScore);
          setBestScore(newScore);
        }
        onGameOver(newScore, bestScore, isNewBest);
        return newBlocks;
      }

      return newBlocks;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, blocks, score, bestScore, onGameOver]);

  // 启动循环
  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  const addBlock = useCallback(() => {
    if (gameState !== "playing") return;

    const newBlock: Block = {
      id: nextId++,
      x: currentX - FRUIT_SIZES[0].size / 2,
      y: 0,
      level: 0,
      merged: false,
    };

    setBlocks(prev => [...prev, newBlock]);
  }, [gameState, currentX]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  return {
    gameState,
    blocks,
    score,
    bestScore,
    currentX,
    setCurrentX,
    addBlock,
    restartGame,
  };
}
