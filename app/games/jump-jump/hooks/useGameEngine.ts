"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, Block } from "../types";
import { GAME_CONFIG } from "../constants";
import { getHighScore, saveHighScore } from "../utils/storage";

interface UseGameEngineProps {
  onGameOver: (score: number, isNewRecord: boolean) => void;
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [currentPower, setCurrentPower] = useState(GAME_CONFIG.initialPower);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [playerX, setPlayerX] = useState(0);
  const [playerY, setPlayerY] = useState(0);
  const [playerVX, setPlayerVX] = useState(0);
  const [playerVY, setPlayerVY] = useState(0);
  const [playerRadius, setPlayerRadius] = useState(20);
  const [isCharging, setIsCharging] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const powerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 生成第一个方块
  const generateFirstBlock = useCallback(() => {
    const firstBlock: Block = {
      x: GAME_CONFIG.canvasWidth / 2 - 80,
      y: GAME_CONFIG.canvasHeight - 80,
      width: 160,
      height: 80,
      color: "#4ECDC4",
    };
    setBlocks([firstBlock]);
    setPlayerX(firstBlock.x + firstBlock.width / 2 - playerRadius / 2);
    setPlayerY(firstBlock.y - playerRadius);
    setScore(0);
  }, [playerRadius]);

  // 生成下一个方块
  const generateNextBlock = useCallback(() => {
    const lastBlock = blocks[blocks.length - 1];
    const minDistance = 100;
    const maxDistance = 250;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    const width = 60 + Math.random() * 80;
    const x = lastBlock.x + lastBlock.width + distance;
    const y = GAME_CONFIG.canvasHeight - (40 + Math.random() * 80);
    const height = GAME_CONFIG.canvasHeight - y;

    const newBlock: Block = {
      x,
      y,
      width,
      height,
      color: "#4ECDC4",
    };
    setBlocks([...blocks, newBlock]);
  }, [blocks]);

  // 开始游戏
  const startGame = useCallback(() => {
    generateFirstBlock();
    setGameState("playing");
    setCurrentPower(GAME_CONFIG.initialPower);
    setIsCharging(false);
    setHighScore(getHighScore());
  }, [generateFirstBlock]);

  // 暂停游戏
  const pauseGame = useCallback(() => {
    setGameState("paused");
  }, []);

  // 继续游戏
  const resumeGame = useCallback(() => {
    setGameState("playing");
  }, []);

  // 返回菜单
  const goToMenu = useCallback(() => {
    setGameState("menu");
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // 开始蓄力
  const startCharge = useCallback(() => {
    if (gameState !== "playing") return;
    setIsCharging(true);
    setCurrentPower(GAME_CONFIG.initialPower);

    powerIntervalRef.current = setInterval(() => {
      setCurrentPower((prev) => {
        if (prev >= GAME_CONFIG.maxPower) {
          return GAME_CONFIG.maxPower;
        }
        return prev + GAME_CONFIG.powerIncrement;
      });
    }, 16);
  }, [gameState]);

  // 跳跃
  const jump = useCallback(() => {
    if (!isCharging) return;
    setIsCharging(false);
    if (powerIntervalRef.current) {
      clearInterval(powerIntervalRef.current);
      powerIntervalRef.current = null;
    }

    const currentBlock = blocks[blocks.length - 1];
    setPlayerVX(GAME_CONFIG.jumpVelocityX);
    setPlayerVY(-currentPower);
    setCurrentPower(GAME_CONFIG.initialPower);
  }, [isCharging, currentPower, blocks]);

  // 检查碰撞和游戏结束
  const checkCollision = useCallback(() => {
    const playerBottom = playerY + playerRadius;
    const playerCenterX = playerX + playerRadius / 2;

    // 找到当前玩家所在的方块
    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];
      if (
        playerBottom >= block.y &&
        playerCenterX >= block.x &&
        playerCenterX <= block.x + block.width
      ) {
        // 落在方块上
        setPlayerY(block.y - playerRadius);
        setPlayerVY(0);
        setPlayerVX(0);

        // 检查是否在中心附近加分更多
        const centerX = block.x + block.width / 2;
        const distanceFromCenter = Math.abs(playerCenterX - centerX);
        const isPerfect = distanceFromCenter < block.width / 4;
        const points = isPerfect ? 2 : 1;

        setScore((prev) => prev + points);
        generateNextBlock();
        return false;
      }
    }

    // 掉下去了，游戏结束
    if (playerBottom > GAME_CONFIG.canvasHeight) {
      return true;
    }
    return false;
  }, [playerX, playerY, playerRadius, blocks, generateNextBlock]);

  // 游戏循环
  const gameLoop = useCallback((timestamp: number) => {
    if (gameState !== "playing") return;

    const deltaTime = timestamp - (lastTimeRef.current || timestamp);
    lastTimeRef.current = timestamp;

    if (!isCharging && playerVY !== 0) {
      // 更新玩家位置
      setPlayerX((prev) => prev + playerVX);
      setPlayerY((prev) => prev + playerVY);
      setPlayerVY((prev) => prev + GAME_CONFIG.gravity);
    }

    // 检查碰撞
    if (playerVY > 0) {
      const gameOver = checkCollision();
      if (gameOver) {
        setGameState("gameover");
        const isNewRecord = score > highScore;
        if (isNewRecord) {
          saveHighScore(score);
          setHighScore(score);
        }
        onGameOver(score, isNewRecord);
        return;
      }
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, isCharging, playerVX, playerVY, score, highScore, checkCollision, onGameOver]);

  // 启动游戏循环
  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (powerIntervalRef.current) {
        clearInterval(powerIntervalRef.current);
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
    currentPower,
    blocks,
    playerX,
    playerY,
    playerRadius,
    isCharging,
    startGame,
    pauseGame,
    resumeGame,
    goToMenu,
    startCharge,
    jump,
  };
}
