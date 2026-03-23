import { useState, useCallback, useRef, useEffect } from "react";
import { Character, Obstacle, Item, Coin, GameState, DifficultyLevel, ItemType } from "../types/index";
import { CHARACTERS, DIFFICULTY_SETTINGS, OBSTACLE_CONFIG, ITEM_CONFIG, BASE_SPEED, GROUND_Y, JUMP_FORCE, GRAVITY, COIN_REWARD_PER_100M } from "../constants";
import { getProgress, addCoins, updateHighScore, hasItem, useItem } from "../utils/storage";

interface UseGameEngineProps {
  characterId: string;
  isZh: boolean;
  onGameOver: (distance: number, coins: number, isNewRecord: boolean) => void;
}

export function useGameEngine({ characterId, isZh, onGameOver }: UseGameEngineProps) {
  const character = CHARACTERS.find(c => c.id === characterId) || CHARACTERS[0];
  
  const [gameState, setGameState] = useState<GameState>("menu");
  const [distance, setDistance] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [hp, setHp] = useState(character.hp);
  const [playerY, setPlayerY] = useState(GROUND_Y);
  const [isJumping, setIsJumping] = useState(false);
  const [hasShield, setHasShield] = useState(false);
  const [isInvincible, setIsInvincible] = useState(false);
  const [magnetActive, setMagnetActive] = useState(false);
  const [slowActive, setSlowActive] = useState(false);
  
  const obstaclesRef = useRef<Obstacle[]>([]);
  const itemsRef = useRef<Item[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const lastObstacleTimeRef = useRef(0);
  const lastItemTimeRef = useRef(0);
  const lastCoinTimeRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const playerYRef = useRef(GROUND_Y);
  const velocityRef = useRef(0);
  const distanceRef = useRef(0);
  const isJumpingRef = useRef(false);
  const canDoubleJumpRef = useRef(false);
  const gameStateRef = useRef<GameState>("menu");
  const hasShieldRef = useRef(false);
  const isInvincibleRef = useRef(false);
  const magnetActiveRef = useRef(false);
  const slowActiveRef = useRef(false);
  const hpRef = useRef(character.hp);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    playerYRef.current = GROUND_Y;
    velocityRef.current = 0;
    isJumpingRef.current = false;
    canDoubleJumpRef.current = character.ability === "doubleJump";
    hasShieldRef.current = hasItem("shield");
    setHasShield(hasShieldRef.current);
    hpRef.current = character.hp + (hasItem("heart") ? 1 : 0);
    setHp(hpRef.current);
  }, [character]);

  const getDifficultyLevel = (dist: number): DifficultyLevel => {
    if (dist < 500) return 1;
    if (dist < 1000) return 2;
    if (dist < 2000) return 3;
    if (dist < 3500) return 4;
    return 5;
  };

  const spawnObstacle = useCallback(() => {
    const level = getDifficultyLevel(distanceRef.current);
    const settings = DIFFICULTY_SETTINGS[level];
    const type = settings.obstacleTypes[Math.floor(Math.random() * settings.obstacleTypes.length)];
    const config = OBSTACLE_CONFIG[type];
    
    const obstacle: Obstacle = {
      id: `obs_${Date.now()}_${Math.random()}`,
      type,
      x: 900,
      y: GROUND_Y - config.height + config.groundY,
      width: config.width,
      height: config.height,
    };
    obstaclesRef.current.push(obstacle);
  }, [distance]);

  const spawnItem = useCallback(() => {
    const itemTypes: ItemType[] = ["heart", "shield", "lightning", "magnet", "clock"];
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    
    const item: Item = {
      id: `item_${Date.now()}_${Math.random()}`,
      type,
      x: 900,
      y: GROUND_Y - 80 - Math.random() * 60,
      collected: false,
    };
    itemsRef.current.push(item);
  }, []);

  const spawnCoin = useCallback(() => {
    const patterns = [
      [{ x: 0, y: 0 }, { x: 30, y: -30 }, { x: 60, y: 0 }],
      [{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 60, y: 0 }],
      [{ x: 0, y: -30 }, { x: 30, y: -60 }, { x: 60, y: -30 }],
    ];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    pattern.forEach((pos, i) => {
      const coin: Coin = {
        id: `coin_${Date.now()}_${i}_${Math.random()}`,
        x: 900 + pos.x,
        y: GROUND_Y - 50 + pos.y,
        collected: false,
      };
      coinsRef.current.push(coin);
    });
  }, []);

  const jump = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    
    if (!isJumpingRef.current) {
      velocityRef.current = JUMP_FORCE;
      isJumpingRef.current = true;
      canDoubleJumpRef.current = character.ability === "doubleJump";
    } else if (canDoubleJumpRef.current) {
      velocityRef.current = JUMP_FORCE * 0.85;
      canDoubleJumpRef.current = false;
    }
  }, [character]);

  const checkCollision = useCallback((playerX: number, playerY: number): { hitObstacle: Obstacle | null; hitItem: Item | null; hitCoin: Coin | null } => {
    const playerWidth = 40;
    const playerHeight = 60;
    const playerLeft = playerX - playerWidth / 2;
    const playerRight = playerX + playerWidth / 2;
    const playerTop = playerY - playerHeight;
    const playerBottom = playerY;

    for (const obstacle of obstaclesRef.current) {
      if (
        playerRight > obstacle.x &&
        playerLeft < obstacle.x + obstacle.width &&
        playerBottom > obstacle.y &&
        playerTop < obstacle.y + obstacle.height
      ) {
        return { hitObstacle: obstacle, hitItem: null, hitCoin: null };
      }
    }

    for (const item of itemsRef.current) {
      if (item.collected) continue;
      const config = ITEM_CONFIG[item.type];
      if (
        playerRight > item.x &&
        playerLeft < item.x + config.width &&
        playerBottom > item.y &&
        playerTop < item.y + config.height
      ) {
        return { hitObstacle: null, hitItem: item, hitCoin: null };
      }
    }

    for (const coin of coinsRef.current) {
      if (coin.collected) continue;
      const coinLeft = coin.x;
      const coinRight = coin.x + 25;
      const coinTop = coin.y - 25;
      const coinBottom = coin.y;
      
      if (
        playerRight > coinLeft &&
        playerLeft < coinRight &&
        playerBottom > coinTop &&
        playerTop < coinBottom
      ) {
        return { hitObstacle: null, hitItem: null, hitCoin: coin };
      }
    }

    return { hitObstacle: null, hitItem: null, hitCoin: null };
  }, []);

  const applyItemEffect = useCallback((itemType: ItemType) => {
    switch (itemType) {
      case "heart":
        hpRef.current = Math.min(hpRef.current + 1, character.hp + 2);
        setHp(hpRef.current);
        break;
      case "shield":
        hasShieldRef.current = true;
        setHasShield(true);
        break;
      case "lightning":
        isInvincibleRef.current = true;
        setIsInvincible(true);
        setTimeout(() => {
          isInvincibleRef.current = false;
          setIsInvincible(false);
        }, 3000);
        break;
      case "magnet":
        magnetActiveRef.current = true;
        setMagnetActive(true);
        setTimeout(() => {
          magnetActiveRef.current = false;
          setMagnetActive(false);
        }, 10000);
        break;
      case "clock":
        slowActiveRef.current = true;
        setSlowActive(true);
        setTimeout(() => {
          slowActiveRef.current = false;
          setSlowActive(false);
        }, 5000);
        break;
    }
  }, [character]);

  const gameLoop = useCallback(() => {
    if (gameStateRef.current !== "playing") return;

    const level = getDifficultyLevel(distanceRef.current);
    const settings = DIFFICULTY_SETTINGS[level];
    let speed = BASE_SPEED * character.speed * settings.speedMultiplier;
    
    if (slowActiveRef.current) {
      speed *= 0.5;
    }

    distanceRef.current += speed;
    setDistance(Math.floor(distanceRef.current));

    velocityRef.current += GRAVITY;
    playerYRef.current += velocityRef.current;
    
    if (playerYRef.current >= GROUND_Y) {
      playerYRef.current = GROUND_Y;
      velocityRef.current = 0;
      isJumpingRef.current = false;
      canDoubleJumpRef.current = character.ability === "doubleJump";
    }
    
    setPlayerY(playerYRef.current);

    const now = Date.now();
    const obstacleInterval = settings.minInterval + Math.random() * (settings.maxInterval - settings.minInterval);
    if (now - lastObstacleTimeRef.current > obstacleInterval) {
      spawnObstacle();
      lastObstacleTimeRef.current = now;
    }

    if (now - lastItemTimeRef.current > 15000) {
      if (Math.random() < 0.3) {
        spawnItem();
      }
      lastItemTimeRef.current = now;
    }

    if (now - lastCoinTimeRef.current > 3000) {
      if (Math.random() < 0.5) {
        spawnCoin();
      }
      lastCoinTimeRef.current = now;
    }

    const moveSpeed = speed;
    obstaclesRef.current = obstaclesRef.current.filter(obs => {
      obs.x -= moveSpeed;
      return obs.x > -100;
    });

    itemsRef.current = itemsRef.current.filter(item => {
      item.x -= moveSpeed;
      if (magnetActiveRef.current && item.type === "coin") {
        if (item.x > 50 && item.x < 400) {
          item.y += (GROUND_Y - 30 - item.y) * 0.1;
        }
      }
      return item.x > -50;
    });

    coinsRef.current = coinsRef.current.filter(coin => {
      coin.x -= moveSpeed;
      if (magnetActiveRef.current) {
        if (coin.x > 50 && coin.x < 400) {
          coin.y += (GROUND_Y - 30 - coin.y) * 0.15;
        }
      }
      return coin.x > -30;
    });

    const collision = checkCollision(100, playerYRef.current);
    
    if (collision.hitObstacle && !isInvincibleRef.current) {
      const obs = collision.hitObstacle;
      const config = OBSTACLE_CONFIG[obs.type];
      
      if (hasShieldRef.current) {
        hasShieldRef.current = false;
        setHasShield(false);
        obstaclesRef.current = obstaclesRef.current.filter(o => o.id !== obs.id);
      } else {
        hpRef.current -= config.damage;
        setHp(hpRef.current);
        obstaclesRef.current = obstaclesRef.current.filter(o => o.id !== obs.id);
        
        if (hpRef.current <= 0) {
          const finalDistance = Math.floor(distanceRef.current);
          const earnedCoins = Math.floor(finalDistance / 100) * COIN_REWARD_PER_100M + coinsCollected;
          addCoins(earnedCoins);
          const isNewRecord = updateHighScore(finalDistance);
          setGameState("gameover");
          onGameOver(finalDistance, earnedCoins, isNewRecord);
          return;
        }
      }
    }

    if (collision.hitItem) {
      const item = collision.hitItem;
      applyItemEffect(item.type);
      itemsRef.current = itemsRef.current.filter(i => i.id !== item.id);
    }

    if (collision.hitCoin) {
      const coin = collision.hitCoin;
      setCoinsCollected(prev => prev + 1);
      coinsRef.current = coinsRef.current.filter(c => c.id !== coin.id);
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [character, spawnObstacle, spawnItem, spawnCoin, checkCollision, applyItemEffect, coinsCollected, onGameOver]);

  const startGame = useCallback(() => {
    obstaclesRef.current = [];
    itemsRef.current = [];
    coinsRef.current = [];
    lastObstacleTimeRef.current = Date.now();
    lastItemTimeRef.current = Date.now();
    lastCoinTimeRef.current = Date.now();
    distanceRef.current = 0;
    setDistance(0);
    setCoinsCollected(0);
    playerYRef.current = GROUND_Y;
    setPlayerY(GROUND_Y);
    velocityRef.current = 0;
    isJumpingRef.current = false;
    
    hasShieldRef.current = hasItem("shield");
    setHasShield(hasShieldRef.current);
    hpRef.current = character.hp + (hasItem("heart") ? 1 : 0);
    setHp(hpRef.current);
    
    if (hasItem("heart")) {
      useItem("heart");
    }
    if (hasItem("shield")) {
      useItem("shield");
    }
    
    setGameState("playing");
    
    setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }, 100);
  }, [character, gameLoop]);

  const pauseGame = useCallback(() => {
    setGameState("paused");
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const resumeGame = useCallback(() => {
    setGameState("playing");
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const goToMenu = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setGameState("menu");
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    gameState,
    distance,
    coinsCollected,
    hp,
    playerY,
    isJumping,
    hasShield,
    isInvincible,
    magnetActive,
    slowActive,
    obstacles: obstaclesRef.current,
    items: itemsRef.current,
    coins: coinsRef.current,
    character,
    jump,
    startGame,
    pauseGame,
    resumeGame,
    goToMenu,
  };
}
