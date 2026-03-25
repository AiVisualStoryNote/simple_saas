"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, Enemy, Bullet, PowerUp } from "../types";
import { GAME_CONFIG } from "../constants";
import { getHighScore, saveHighScore } from "../utils/storage";

interface UseGameEngineProps {
  onGameOver: (score: number, isNewRecord: boolean) => void;
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [playerY, setPlayerY] = useState(GAME_CONFIG.canvasHeight / 2 - GAME_CONFIG.playerHeight / 2);
  const [playerHp, setPlayerHp] = useState(3);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(GAME_CONFIG.baseSpeed);
  const [hasMultishot, setHasMultishot] = useState(0); // 多重射击次数

  const animationRef = useRef<number | null>(null);
  const lastEnemySpawnRef = useRef<number>(0);
  const lastPowerUpSpawnRef = useRef<number>(0);
  const lastShootRef = useRef<number>(0);

  // 生成敌人
  const spawnEnemy = useCallback(() => {
    const height = 30 + Math.random() * 50;
    const y = Math.random() * (GAME_CONFIG.canvasHeight - height - 100) + 50;
    const newEnemy: Enemy = {
      x: GAME_CONFIG.canvasWidth,
      y,
      width: 30 + Math.random() * 20,
      height,
      hp: 1 + Math.floor(score / 100),
      maxHp: 1 + Math.floor(score / 100),
      speed: gameSpeed * (0.8 + Math.random() * 0.4),
    };
    setEnemies(prev => [...prev, newEnemy]);
  }, [score, gameSpeed]);

  // 生成道具
  const spawnPowerUp = useCallback(() => {
    const types: PowerUp["type"][] = ["health", "speed", "multishot"];
    const type = types[Math.floor(Math.random() * types.length)];
    const height = 30;
    const y = Math.random() * (GAME_CONFIG.canvasHeight - height - 100) + 50;
    const newPowerUp: PowerUp = {
      x: GAME_CONFIG.canvasWidth,
      y,
      type,
      width: 30,
      height,
    };
    setPowerUps(prev => [...prev, newPowerUp]);
  }, []);

  // 开始游戏
  const startGame = useCallback(() => {
    setPlayerY(GAME_CONFIG.canvasHeight / 2 - GAME_CONFIG.playerHeight / 2);
    setPlayerHp(3);
    setBullets([]);
    setEnemies([]);
    setPowerUps([]);
    setScore(0);
    setGameSpeed(GAME_CONFIG.baseSpeed);
    setHasMultishot(0);
    setGameState("playing");
    setHighScore(getHighScore());
    lastEnemySpawnRef.current = performance.now();
    lastPowerUpSpawnRef.current = performance.now();
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
  const movePlayer = useCallback((newY: number) => {
    const clampedY = Math.max(0, Math.min(newY, GAME_CONFIG.canvasHeight - GAME_CONFIG.playerHeight));
    setPlayerY(clampedY);
  }, []);

  // 射击
  const shoot = useCallback(() => {
    const now = performance.now();
    // 控制射速
    if (now - lastShootRef.current < 300) return;
    lastShootRef.current = now;

    const bulletY = playerY + GAME_CONFIG.playerHeight / 2 - 2;
    let bulletsToAdd: Bullet[] = [];

    if (hasMultishot > 0) {
      // 多重射击
      bulletsToAdd.push(
        { x: GAME_CONFIG.playerX + GAME_CONFIG.playerWidth, y: bulletY - 10, speed: 10, damage: 1 },
        { x: GAME_CONFIG.playerX + GAME_CONFIG.playerWidth, y: bulletY, speed: 10, damage: 1 },
        { x: GAME_CONFIG.playerX + GAME_CONFIG.playerWidth, y: bulletY + 10, speed: 10, damage: 1 }
      );
      setHasMultishot(prev => prev - 1);
    } else {
      bulletsToAdd.push(
        { x: GAME_CONFIG.playerX + GAME_CONFIG.playerWidth, y: bulletY, speed: 10, damage: 1 }
      );
    }

    setBullets(prev => [...prev, ...bulletsToAdd]);
  }, [playerY, hasMultishot]);

  // 游戏循环
  const gameLoop = useCallback((timestamp: number) => {
    if (gameState !== "playing") return;

    // 自动射击
    shoot();

    // 生成敌人
    if (timestamp - lastEnemySpawnRef.current >= GAME_CONFIG.enemySpawnInterval - score / 10) {
      spawnEnemy();
      lastEnemySpawnRef.current = timestamp;
    }

    // 生成道具
    if (timestamp - lastPowerUpSpawnRef.current >= GAME_CONFIG.powerUpSpawnInterval) {
      spawnPowerUp();
      lastPowerUpSpawnRef.current = timestamp;
    }

    // 更新子弹位置
    setBullets(prev =>
      prev
        .map(bullet => ({ ...bullet, x: bullet.x + bullet.speed }))
        .filter(bullet => bullet.x < GAME_CONFIG.canvasWidth)
    );

    // 更新敌人位置
    setEnemies(prev =>
      prev
        .map(enemy => ({ ...enemy, x: enemy.x - enemy.speed }))
        .filter(enemy => enemy.x > 0)
    );

    // 更新道具位置
    setPowerUps(prev =>
      prev
        .map(powerUp => ({ ...powerUp, x: powerUp.x - gameSpeed }))
        .filter(powerUp => powerUp.x > 0)
    );

    // 子弹击中敌人
    setBullets(prevBullets => {
      let newBullets = [...prevBullets];
      setEnemies(prevEnemies => {
        let newEnemies = prevEnemies.map(enemy => {
          let newEnemy = { ...enemy };
          newBullets = newBullets.filter(bullet => {
            if (
              bullet.x + 4 >= enemy.x &&
              bullet.x <= enemy.x + enemy.width &&
              bullet.y >= enemy.y &&
              bullet.y <= enemy.y + enemy.height
            ) {
              newEnemy.hp -= bullet.damage;
              return false;
            }
            return true;
          });
          return newEnemy;
        }).filter(enemy => enemy.hp > 0);

        // 加分
        const killedCount = prevEnemies.length - newEnemies.length;
        if (killedCount > 0) {
          setScore(prev => prev + killedCount * 10);
          // 加速难度
          if (score % 100 === 0) {
            setGameSpeed(prev => prev + 0.5);
          }
        }

        return newEnemies;
      });
      return newBullets;
    });

    // 玩家碰敌人体
    setEnemies(prev => {
      const playerBottom = playerY + GAME_CONFIG.playerHeight;
      const playerTop = playerY;
      const playerRight = GAME_CONFIG.playerX + GAME_CONFIG.playerWidth;

      let collision = false;
      const newEnemies = prev.filter(enemy => {
        if (collision) return true;

        const enemyRight = enemy.x + enemy.width;
        const enemyBottom = enemy.y + enemy.height;

        if (
          playerRight >= enemy.x &&
          GAME_CONFIG.playerX <= enemyRight &&
          playerBottom >= enemy.y &&
          playerTop <= enemyBottom
        ) {
          // 碰撞
          setPlayerHp(prev => prev - 1);
          collision = true;
          return false;
        }
        return true;
      });

      // 检查游戏结束
      if (playerHp - 1 <= 0) {
        setGameState("gameover");
        const isNewRecord = score > highScore;
        if (isNewRecord) {
          saveHighScore(score);
          setHighScore(score);
        }
        onGameOver(score, isNewRecord);
        return newEnemies;
      }

      return newEnemies;
    });

    // 玩家吃道具
    setPowerUps(prev => {
      const playerBottom = playerY + GAME_CONFIG.playerHeight;
      const playerTop = playerY;
      const playerRight = GAME_CONFIG.playerX + GAME_CONFIG.playerWidth;

      return prev.filter(powerUp => {
        const powerUpRight = powerUp.x + powerUp.width;
        const powerUpBottom = powerUp.y + powerUp.height;

        if (
          playerRight >= powerUp.x &&
          GAME_CONFIG.playerX <= powerUpRight &&
          playerBottom >= powerUp.y &&
          playerTop <= powerUpBottom
        ) {
          // 吃到道具
          switch (powerUp.type) {
            case "health":
              setPlayerHp(prev => Math.min(prev + 1, 5));
              break;
            case "speed":
              setGameSpeed(prev => Math.max(prev - 1, 2));
              setTimeout(() => setGameSpeed(prev => prev + 1), 5000);
              break;
            case "multishot":
              setHasMultishot(prev => prev + 5);
              break;
          }
          return false;
        }
        return true;
      });
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, playerY, playerHp, score, highScore, gameSpeed, shoot, spawnEnemy, spawnPowerUp, onGameOver]);

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
    playerY,
    playerHp,
    bullets,
    enemies,
    powerUps,
    gameSpeed,
    hasMultishot,
    startGame,
    pauseGame,
    resumeGame,
    goToMenu,
    movePlayer,
  };
}
