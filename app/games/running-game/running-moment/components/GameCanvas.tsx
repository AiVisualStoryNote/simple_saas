"use client";

import { useEffect, useRef } from "react";
import { Obstacle, Item, Coin, Character } from "../types/index";
import { OBSTACLE_CONFIG, ITEM_CONFIG } from "../constants";

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
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const distanceRef = useRef(distance);
  const cloudsRef = useRef<Array<{ x: number; y: number; speed: number; scale: number }>>([]);
  const mountainsRef = useRef<Array<{ x: number; layer: number }>>([]);
  const elapsedTimeRef = useRef(0);
  const lastFrameTimeRef = useRef<number | null>(null);

  useEffect(() => {
    distanceRef.current = distance;
  }, [distance]);

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
      obstacles.forEach((obs) => {
        const config = OBSTACLE_CONFIG[obs.type];
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(config.emoji, obs.x + obs.width / 2, obs.y + obs.height - 5);
      });
    };

    const drawItems = () => {
      items.forEach((item) => {
        if (item.collected) return;
        const config = ITEM_CONFIG[item.type];
        
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(config.emoji, item.x + config.width / 2, item.y + config.height - 5);
      });
    };

    const drawCoins = () => {
      coins.forEach((coin) => {
        if (coin.collected) return;
        
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("🪙", coin.x + 12, coin.y + 10);
      });
    };

    const drawPlayer = () => {
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      
      let playerEmoji = character.icon;
      if (isInvincible) {
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.01) * 0.4;
      }
      
      ctx.fillText(playerEmoji, playerX, playerY);
      ctx.globalAlpha = 1;

      if (hasShield) {
        ctx.font = "30px Arial";
        ctx.fillText("🛡️", playerX + 25, playerY - 20);
      }
    };

    const render = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }
      const delta = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;
      elapsedTimeRef.current += Math.min(delta, 32);

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
  }, [character, obstacles, items, coins, hasShield, isInvincible]);

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
