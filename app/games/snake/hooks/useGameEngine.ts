"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, Position, Direction } from "../types";
import { GAME_CONFIG } from "../constants";
import { getHighScore, saveHighScore } from "../utils/storage";

interface UseGameEngineProps {
  onGameOver: (score: number, isNewRecord: boolean) => void;
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [snake, setSnake] = useState<Position[]>([]);
  const [food, setFood] = useState<Position>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>("right");
  const [nextDirection, setNextDirection] = useState<Direction>("right");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(GAME_CONFIG.initialSpeed);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // 生成随机食物位置
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood;
    let onSnake;
    do {
      newFood = {
        x: Math.floor(Math.random() * GAME_CONFIG.cellCount),
        y: Math.floor(Math.random() * GAME_CONFIG.cellCount),
      };
      onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (onSnake);
    return newFood;
  }, []);

  // 初始化游戏
  const startGame = useCallback(() => {
    const initialSnake: Position[] = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("right");
    setNextDirection("right");
    setScore(0);
    setSpeed(GAME_CONFIG.initialSpeed);
    setGameState("playing");
    setHighScore(getHighScore());
  }, [generateFood]);

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
    if (gameLoopRef.current) {
      clearTimeout(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  // 改变方向
  const changeDirection = useCallback((newDirection: Direction) => {
    // 不允许反向掉头
    if (
      (direction === "up" && newDirection === "down") ||
      (direction === "down" && newDirection === "up") ||
      (direction === "left" && newDirection === "right") ||
      (direction === "right" && newDirection === "left")
    ) {
      return;
    }
    setNextDirection(newDirection);
  }, [direction]);

  // 游戏循环
  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    setSnake(prevSnake => {
      setDirection(nextDirection);
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (nextDirection) {
        case "up":
          newHead.y -= 1;
          break;
        case "down":
          newHead.y += 1;
          break;
        case "left":
          newHead.x -= 1;
          break;
        case "right":
          newHead.x += 1;
          break;
      }

      // 检查撞墙
      if (
        newHead.x < 0 ||
        newHead.x >= GAME_CONFIG.cellCount ||
        newHead.y < 0 ||
        newHead.y >= GAME_CONFIG.cellCount
      ) {
        setGameState("gameover");
        const isNewRecord = score > highScore;
        if (isNewRecord) {
          saveHighScore(score);
          setHighScore(score);
        }
        onGameOver(score, isNewRecord);
        return prevSnake;
      }

      // 检查咬到自己
      const hitSelf = prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y);
      if (hitSelf) {
        setGameState("gameover");
        const isNewRecord = score > highScore;
        if (isNewRecord) {
          saveHighScore(score);
          setHighScore(score);
        }
        onGameOver(score, isNewRecord);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // 检查吃到食物
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          setSpeed(s => Math.max(s - GAME_CONFIG.speedIncrease, 50));
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });

    if (gameLoopRef.current) {
      gameLoopRef.current = setTimeout(gameLoop, speed);
    }
  }, [gameState, nextDirection, food, score, highScore, speed, generateFood, onGameOver]);

  // 启动游戏循环
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = setTimeout(gameLoop, speed);
    }
    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, [gameState, speed, gameLoop]);

  // 加载最高分
  useEffect(() => {
    setHighScore(getHighScore());
  }, []);

  return {
    gameState,
    score,
    highScore,
    snake,
    food,
    startGame,
    pauseGame,
    resumeGame,
    goToMenu,
    changeDirection,
  };
}
