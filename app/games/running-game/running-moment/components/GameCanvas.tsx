"use client";

import { useEffect, useRef } from "react";
import { Obstacle, Item, Coin, Character, CharacterSprite, GameState } from "../types/index";
import { OBSTACLE_CONFIG, ITEM_CONFIG } from "../constants";
import { clampSpriteConfig, getSpriteFrameSource, getSpriteRenderSize, resolveCharacterSprite } from "../utils/sprite";

interface GameCanvasProps {
  playerX: number;
  playerY: number;
  character: Character;
  obstacles: Obstacle[];
  items: Item[];
  coins: Coin[];
  hasShield: boolean;
  isInvincible: boolean;
  distance: number;
  gameState: GameState;
  spriteOverride?: CharacterSprite | null;
  showDebugOverlay?: boolean;
}

export function GameCanvas({
  playerX,
  playerY,
  character,
  obstacles,
  items,
  coins,
  hasShield,
  isInvincible,
  distance,
  gameState,
  spriteOverride,
  showDebugOverlay = false,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const distanceRef = useRef(distance);
  const playerYRef = useRef(playerY);
  const characterRef = useRef(character);
  const obstaclesRef = useRef(obstacles);
  const itemsRef = useRef(items);
  const coinsRef = useRef(coins);
  const hasShieldRef = useRef(hasShield);
  const isInvincibleRef = useRef(isInvincible);
  const gameStateRef = useRef(gameState);
  const previousGameStateRef = useRef<GameState>(gameState);
  const cloudsRef = useRef<Array<{ x: number; y: number; speed: number; scale: number }>>([]);
  const mountainsRef = useRef<Array<{ x: number; layer: number }>>([]);
  const elapsedTimeRef = useRef(0);
  const lastFrameTimeRef = useRef<number | null>(null);
  const playerAnimationTimeRef = useRef(0);
  const playerSpriteRef = useRef<HTMLImageElement | null>(null);
  const isSpriteReadyRef = useRef(false);
  const spriteOverrideRef = useRef<CharacterSprite | null>(spriteOverride ?? null);

  useEffect(() => {
    distanceRef.current = distance;
  }, [distance]);

  useEffect(() => {
    playerYRef.current = playerY;
  }, [playerY]);

  useEffect(() => {
    characterRef.current = character;
  }, [character]);

  useEffect(() => {
    spriteOverrideRef.current = spriteOverride ?? null;
  }, [spriteOverride]);

  useEffect(() => {
    obstaclesRef.current = obstacles;
  }, [obstacles]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    coinsRef.current = coins;
  }, [coins]);

  useEffect(() => {
    hasShieldRef.current = hasShield;
  }, [hasShield]);

  useEffect(() => {
    isInvincibleRef.current = isInvincible;
  }, [isInvincible]);

  useEffect(() => {
    const previousGameState = previousGameStateRef.current;
    gameStateRef.current = gameState;

    if (gameState === "playing" && (previousGameState === "menu" || previousGameState === "gameover")) {
      playerAnimationTimeRef.current = 0;
      elapsedTimeRef.current = 0;
      lastFrameTimeRef.current = null;
    }

    previousGameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const sprite = resolveCharacterSprite(character, spriteOverride ?? null);
    if (!sprite) {
      playerSpriteRef.current = null;
      isSpriteReadyRef.current = false;
      return;
    }

    const image = new Image();
    let isActive = true;

    isSpriteReadyRef.current = false;
    image.onload = () => {
      if (!isActive) return;
      playerSpriteRef.current = image;
      isSpriteReadyRef.current = true;
    };
    image.onerror = () => {
      if (!isActive) return;
      playerSpriteRef.current = null;
      isSpriteReadyRef.current = false;
    };
    image.src = sprite.src;

    return () => {
      isActive = false;
    };
  }, [character, spriteOverride]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;
    const GROUND_Y = 350;

    if (cloudsRef.current.length === 0) {
      cloudsRef.current = Array.from({ length: 5 }, () => ({
        x: Math.random() * (CANVAS_WIDTH + 120) - 60,
        y: 30 + Math.random() * 80,
        speed: 4 + Math.random() * 6,
        scale: 0.85 + Math.random() * 0.45,
      }));
    }

    if (mountainsRef.current.length === 0) {
      mountainsRef.current = Array.from({ length: 8 }, (_, i) => ({
        x: i * 150,
        layer: i % 3,
      }));
    }

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(0.6, "#B0E0E6");
      gradient.addColorStop(1, "#90EE90");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "#228B22";
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

      ctx.fillStyle = "#32CD32";
      for (let i = 0; i < CANVAS_WIDTH; i += 20) {
        const height = 5 + Math.sin(i * 0.1) * 3;
        ctx.fillRect(i, GROUND_Y - height, 15, height);
      }
    };

    const drawClouds = (elapsedMs: number) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      cloudsRef.current.forEach((cloud) => {
        const travelWidth = CANVAS_WIDTH + 180;
        const offset = (elapsedMs / 1000) * cloud.speed;
        const drawX = ((cloud.x - offset) % travelWidth + travelWidth) % travelWidth - 90;
        const radius = 25 * cloud.scale;

        ctx.beginPath();
        ctx.arc(drawX, cloud.y, radius, 0, Math.PI * 2);
        ctx.arc(drawX + 20 * cloud.scale, cloud.y - 10 * cloud.scale, 20 * cloud.scale, 0, Math.PI * 2);
        ctx.arc(drawX + 40 * cloud.scale, cloud.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawMountains = (distance: number) => {
      const colors = ["#2E8B57", "#228B22", "#006400"];
      mountainsRef.current.forEach((mountain) => {
        const offset = distance * 0.1 * (0.2 + mountain.layer * 0.1);
        const x = ((mountain.x - offset) % (CANVAS_WIDTH + 200));
        const adjustedX = x < -150 ? x + CANVAS_WIDTH + 200 : x;
        
        ctx.fillStyle = colors[mountain.layer];
        ctx.beginPath();
        ctx.moveTo(adjustedX, GROUND_Y);
        ctx.lineTo(adjustedX + 60, GROUND_Y - 80 - mountain.layer * 20);
        ctx.lineTo(adjustedX + 120, GROUND_Y);
        ctx.closePath();
        ctx.fill();
      });
    };

    const drawObstacles = () => {
      obstaclesRef.current.forEach((obs) => {
        const config = OBSTACLE_CONFIG[obs.type];
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(config.emoji, obs.x + obs.width / 2, obs.y + obs.height - 5);
      });
    };

    const drawItems = () => {
      itemsRef.current.forEach((item) => {
        if (item.collected) return;
        const config = ITEM_CONFIG[item.type];
        
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(config.emoji, item.x + config.width / 2, item.y + config.height - 5);
      });
    };

    const drawCoins = () => {
      coinsRef.current.forEach((coin) => {
        if (coin.collected) return;
        
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("🪙", coin.x + 12, coin.y + 10);
      });
    };

    const drawPlayer = () => {
      const currentCharacter = characterRef.current;
      const sprite = resolveCharacterSprite(currentCharacter, spriteOverrideRef.current);
      const spriteImage = playerSpriteRef.current;
      const baselineY = playerYRef.current;
      let playerBounds = {
        x: playerX - 20,
        y: baselineY - 40,
        width: 40,
        height: 40,
      };
      let drawBox: { x: number; y: number; width: number; height: number } | null = null;

      if (isInvincibleRef.current) {
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.01) * 0.4;
      }

      if (sprite && spriteImage && isSpriteReadyRef.current) {
        const safeSprite = clampSpriteConfig(sprite);
        const frameIndex = Math.floor(playerAnimationTimeRef.current / safeSprite.frameDurationMs);
        const frame = getSpriteFrameSource(
          safeSprite,
          frameIndex,
          spriteImage.naturalWidth,
          spriteImage.naturalHeight,
        );
        const renderSize = getSpriteRenderSize(safeSprite);
        const targetHeight = renderSize.height;
        const targetWidth = renderSize.width;
        const drawX = playerX - targetWidth / 2;
        const drawY = baselineY - targetHeight;

        ctx.drawImage(
          spriteImage,
          frame.sourceX,
          frame.sourceY,
          frame.sourceWidth,
          frame.sourceHeight,
          drawX,
          drawY,
          targetWidth,
          targetHeight,
        );

        playerBounds = {
          x: drawX,
          y: drawY,
          width: targetWidth,
          height: targetHeight,
        };
        drawBox = playerBounds;
      } else {
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(currentCharacter.icon, playerX, baselineY);
      }

      ctx.globalAlpha = 1;

      if (showDebugOverlay) {
        ctx.save();
        ctx.strokeStyle = "rgba(220, 38, 38, 0.95)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, baselineY);
        ctx.lineTo(CANVAS_WIDTH, baselineY);
        ctx.stroke();

        ctx.strokeStyle = "rgba(37, 99, 235, 0.9)";
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(playerBounds.x, playerBounds.y, playerBounds.width, playerBounds.height);
        ctx.beginPath();
        ctx.moveTo(playerX, 0);
        ctx.lineTo(playerX, CANVAS_HEIGHT);
        ctx.stroke();

        if (drawBox) {
          ctx.strokeStyle = "rgba(16, 185, 129, 0.95)";
          ctx.setLineDash([]);
          ctx.strokeRect(drawBox.x, drawBox.y, drawBox.width, drawBox.height);
        }

        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.fillRect(14, 14, 216, 64);
        ctx.fillStyle = "#fff";
        ctx.font = "12px monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`baselineY: ${Math.round(baselineY)}`, 24, 26);
        ctx.fillText(`bounds: ${Math.round(playerBounds.width)} x ${Math.round(playerBounds.height)}`, 24, 44);
        ctx.fillText(`centerX: ${Math.round(playerX)}`, 24, 62);
        ctx.restore();
      }

      if (hasShieldRef.current) {
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🛡️", playerBounds.x + playerBounds.width - 2, playerBounds.y + 10);
      }
    };

    const render = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }
      const delta = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;
      const clampedDelta = Math.min(delta, 32);

      if (gameStateRef.current === "playing") {
        elapsedTimeRef.current += clampedDelta;
        playerAnimationTimeRef.current += clampedDelta;
      }

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      drawBackground();
      drawMountains(distanceRef.current);
      drawClouds(elapsedTimeRef.current);
      drawObstacles();
      drawItems();
      drawCoins();
      drawPlayer();

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      lastFrameTimeRef.current = null;
    };
  }, [playerX]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border-4 border-green-600 rounded-xl shadow-2xl"
      />
    </div>
  );
}
