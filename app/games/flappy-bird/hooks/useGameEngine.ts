"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, Pipe } from "../types";
import { GAME_CONFIG } from "../constants";
import { getHighScore, saveHighScore } from "../utils/storage";

interface UseGameEngineProps {
  onGameOver: (score: number, isNewRecord: boolean) => void;
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [birdY, setBirdY] = useState(GAME_CONFIG.canvasHeight / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [birdRotation, setBirdRotation] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const animationRef = useRef<number | null>(null);
  const lastPipeTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // 生成新管道
  const generatePipe = useCallback(() => {
    const minHeight = 80;
    const maxHeight = GAME_CONFIG.canvasHeight - GAME_CONFIG.pipeGap - minHeight;
    const topHeight = minHeight + Math.random() * (maxHeight - minHeight);

    setPipes(prev => [
      ...prev,
      {
        x: GAME_CONFIG.canvasWidth,
        topHeight,
        passed: false,
      },
    ]);
  }, []);

  // 开始游戏
  const startGame = useCallback(() => {
    setBirdY(GAME_CONFIG.canvasHeight / 2);
    setBirdVelocity(0);
    setBirdRotation(0);
    setPipes([]);
    setScore(0);
    setGameState("playing");
    setHighScore(getHighScore());
    lastPipeTimeRef.current = performance.now();
  }, []);

  // 跳跃
  const jump = useCallback(() => {
    if (gameState !== "playing") return;
    setBirdVelocity(GAME_CONFIG.jumpForce);
  }, [gameState]);

  // 暂停游戏
  const pauseGame = useCallback(() => {
    setGameState("paused");
  }, []);

  // 继续游戏
  const resumeGame = useCallback(() => {
    setGameState("playing");
    lastTimeRef.current = performance.now();
    lastPipeTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, []);

  // 返回菜单
  const goToMenu = useCallback(() => {
    setGameState("menu");
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // 检查碰撞
  const checkCollision = useCallback((): boolean => {
    const birdLeft = GAME_CONFIG.birdX - GAME_CONFIG.birdRadius;
    const birdRight = GAME_CONFIG.birdX + GAME_CONFIG.birdRadius;
    const birdTop = birdY - GAME_CONFIG.birdRadius;
    const birdBottom = birdY + GAME_CONFIG.birdRadius;

    // 撞地面或天花板
    if (birdBottom >= GAME_CONFIG.canvasHeight || birdTop <= 0) {
      return true;
    }

    // 撞管道
    for (const pipe of pipes) {
      if (
        birdRight >= pipe.x &&
        birdLeft <= pipe.x + GAME_CONFIG.pipeWidth
      ) {
        // 撞上方管道或下方管道
        if (birdTop <= pipe.topHeight || birdBottom >= pipe.topHeight + GAME_CONFIG.pipeGap) {
          return true;
        }
      }
    }

    return false;
  }, [birdY, pipes]);

  // 游戏循环
  const gameLoop = useCallback((timestamp: number) => {
    if (gameState !== "playing") return;

    const deltaTime = timestamp - (lastTimeRef.current || timestamp);
    lastTimeRef.current = timestamp;

    // 更新鸟的位置
    setBirdY(prev => prev + birdVelocity);
    setBirdVelocity(prev => prev + GAME_CONFIG.gravity);
    setBirdRotation((birdVelocity / GAME_CONFIG.jumpForce) * 30);

    // 生成新管道
    if (timestamp - lastPipeTimeRef.current >= GAME_CONFIG.pipeSpawnInterval) {
      generatePipe();
      lastPipeTimeRef.current = timestamp;
    }

    // 更新管道位置
    setPipes(prev => {
      const newPipes = prev
        .map(pipe => ({
          ...pipe,
          x: pipe.x - GAME_CONFIG.pipeSpeed,
        }))
        .filter(pipe => pipe.x + GAME_CONFIG.pipeWidth > 0);

      // 计分
      newPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + GAME_CONFIG.pipeWidth < GAME_CONFIG.birdX) {
          pipe.passed = true;
          setScore(prev => prev + 1);
        }
      });

      return newPipes;
    });

    // 检查碰撞
    if (checkCollision()) {
      setGameState("gameover");
      const isNewRecord = score > highScore;
      if (isNewRecord) {
        saveHighScore(score);
        setHighScore(score);
      }
      onGameOver(score, isNewRecord);
      return;
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, birdVelocity, birdY, score, highScore, pipes, generatePipe, checkCollision, onGameOver]);

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

  // 加载最高分
  useEffect(() => {
    setHighScore(getHighScore());
  }, []);

  return {
    gameState,
    score,
    highScore,
    birdY,
    birdVelocity,
    birdRotation,
    pipes,
    startGame,
    jump,
    pauseGame,
    resumeGame,
    goToMenu,
  };
}
