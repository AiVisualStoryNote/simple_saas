"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, Bullet, Enemy } from "../types";
import { GAME_CONFIG, ENEMY_CONFIG } from "../constants";
import { getHighScore, saveHighScore } from "../utils/storage";

interface UseGameEngineProps {
  onGameOver: (score: number, isNewRecord: boolean) => void;
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [playerX, setPlayerX] = useState(GAME_CONFIG.canvasWidth / 2 - GAME_CONFIG.playerWidth / 2);
  const [playerY, setPlayerY] = useState(GAME_CONFIG.canvasHeight - GAME_CONFIG.playerHeight - 20);
  const [playerHp, setPlayerHp] = useState(5);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const animationRef = useRef<number | null>(null);
  const lastEnemySpawnRef = useRef<number>(0);
  const lastShootRef = useRef<number>(0);

  // 生成敌机
  const spawnEnemy = useCallback(() => {
    const roll = Math.random();
    let type: Enemy["type"] = "small";
    if (roll > 0.8) type = "large";
    else if (roll > 0.5) type = "medium";

    const config = ENEMY_CONFIG[type];
    const x = Math.random() * (GAME_CONFIG.canvasWidth - config.width);
    const newEnemy: Enemy = {
      x,
      y: -config.height,
      width: config.width,
      height: config.height,
      hp: config.hp,
      maxHp: config.hp,
      speed: config.speed,
      type,
    };

    setEnemies(prev => [...prev, newEnemy]);
  }, []);

  // 开始游戏
  const startGame = useCallback(() => {
    setPlayerX(GAME_CONFIG.canvasWidth / 2 - GAME_CONFIG.playerWidth / 2);
    setPlayerY(GAME_CONFIG.canvasHeight - GAME_CONFIG.playerHeight - 20);
    setPlayerHp(5);
    setBullets([]);
    setEnemies([]);
    setScore(0);
    setGameState("playing");
    setHighScore(getHighScore());
    lastEnemySpawnRef.current = performance.now();
    lastShootRef.current = performance.now();
  }, []);

  // 暂停游戏
  const pauseGame = useCallback(() => {
    setGameState("paused");
  }, []);

  // 继续游戏
  const resumeGame = useCallback(() => {
    setGameState("playing");
    lastEnemySpawnRef.current = performance.now();
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

  // 移动玩家
  const movePlayer = useCallback((newX: number) => {
    const clampedX = Math.max(0, Math.min(newX, GAME_CONFIG.canvasWidth - GAME_CONFIG.playerWidth));
    setPlayerX(clampedX);
  }, []);

  // 发射子弹
  const shoot = useCallback(() => {
    const now = performance.now();
    // 控制射速
    if (now - lastShootRef.current < 300) return;
    lastShootRef.current = now;

    setBullets(prev => [
      ...prev,
      {
        x: playerX + GAME_CONFIG.playerWidth / 2 - 2,
        y: playerY,
        speed: -GAME_CONFIG.bulletSpeed,
        damage: 1,
        isPlayer: true,
      },
    ]);
  }, [playerX, playerY]);

  // 检查碰撞
  const checkCollisions = useCallback(() => {
    let newBullets = [...bullets];
    let newEnemies = [...enemies];
    let newScore = score;
    let newPlayerHp = playerHp;

    // 子弹击中敌机
    newBullets = bullets.filter(bullet => {
      if (!bullet.isPlayer) return true;

      let hit = false;
      newEnemies = newEnemies.map(enemy => {
        if (
          bullet.x >= enemy.x &&
          bullet.x <= enemy.x + enemy.width &&
          bullet.y >= enemy.y &&
          bullet.y <= enemy.y + enemy.height
        ) {
          hit = true;
          const newHp = enemy.hp - bullet.damage;
          if (newHp <= 0) {
            // 敌机被击毁
            const points = enemy.type === "small" ? 10 : enemy.type === "medium" ? 30 : 100;
            newScore += points;
            return null!;
          }
          return { ...enemy, hp: newHp };
        }
        return enemy;
      }).filter(Boolean);

      return !hit;
    });

    // 敌机撞到玩家
    newEnemies.forEach(enemy => {
      const playerRight = playerX + GAME_CONFIG.playerWidth;
      const playerBottom = playerY + GAME_CONFIG.playerHeight;
      const enemyRight = enemy.x + enemy.width;
      const enemyBottom = enemy.y + enemy.height;

      if (
        playerX < enemyRight &&
        playerRight > enemy.x &&
        playerY < enemyBottom &&
        playerBottom > enemy.y
      ) {
        // 碰撞减血
        newPlayerHp -= enemy.type === "small" ? 1 : enemy.type === "medium" ? 2 : 3;
        // 移除敌机
        newEnemies = newEnemies.filter(e => e !== enemy);
      }
    });

    setBullets(newBullets);
    setEnemies(newEnemies);
    setScore(newScore);
    setPlayerHp(newPlayerHp);

    // 检查游戏结束
    if (newPlayerHp <= 0) {
      setGameState("gameover");
      const isNewRecord = newScore > highScore;
      if (isNewRecord) {
        saveHighScore(newScore);
        setHighScore(newScore);
      }
      onGameOver(newScore, isNewRecord);
    }
  }, [bullets, enemies, score, playerX, playerY, playerHp, highScore, onGameOver]);

  // 游戏循环
  const gameLoop = useCallback((timestamp: number) => {
    if (gameState !== "playing") return;

    // 生成敌机
    if (timestamp - lastEnemySpawnRef.current >= GAME_CONFIG.enemySpawnInterval) {
      spawnEnemy();
      lastEnemySpawnRef.current = timestamp;
    }

    // 更新子弹位置
    setBullets(prev =>
      prev
        .map(bullet => ({
          ...bullet,
          y: bullet.y + bullet.speed,
        }))
        .filter(bullet => bullet.y > 0 && bullet.y < GAME_CONFIG.canvasHeight)
    );

    // 更新敌机位置
    setEnemies(prev =>
      prev
        .map(enemy => ({
          ...enemy,
          y: enemy.y + enemy.speed,
        }))
        .filter(enemy => enemy.y < GAME_CONFIG.canvasHeight)
    );

    // 自动发射子弹
    shoot();

    // 检查碰撞
    checkCollisions();

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, spawnEnemy, shoot, checkCollisions]);

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
    playerX,
    playerY,
    playerHp,
    bullets,
    enemies,
    startGame,
    pauseGame,
    resumeGame,
    goToMenu,
    movePlayer,
  };
}
