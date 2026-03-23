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
  isZh: boolean;
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
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const cloudsRef = useRef<Array<{ x: number; y: number; speed: number }>>([]);
  const mountainsRef = useRef<Array<{ x: number; layer: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;
    const GROUND_Y = 350;

    cloudsRef.current = Array.from({ length: 5 }, () => ({
      x: Math.random() * CANVAS_WIDTH,
      y: 30 + Math.random() * 80,
      speed: 0.3 + Math.random() * 0.3,
    }));

    mountainsRef.current = Array.from({ length: 8 }, (_, i) => ({
      x: i * 150,
      layer: i % 3,
    }));

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

    const drawClouds = (offset: number) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      cloudsRef.current.forEach((cloud) => {
        cloud.x -= cloud.speed;
        if (cloud.x < -100) cloud.x = CANVAS_WIDTH + 100;

        const drawX = (cloud.x - offset * 0.1) % (CANVAS_WIDTH + 200);
        const adjustedX = drawX < -50 ? drawX + CANVAS_WIDTH + 200 : drawX;

        ctx.beginPath();
        ctx.arc(adjustedX, cloud.y, 25, 0, Math.PI * 2);
        ctx.arc(adjustedX + 20, cloud.y - 10, 20, 0, Math.PI * 2);
        ctx.arc(adjustedX + 40, cloud.y, 25, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawMountains = (offset: number) => {
      const colors = ["#2E8B57", "#228B22", "#006400"];
      mountainsRef.current.forEach((mountain) => {
        const x = ((mountain.x - offset * (0.2 + mountain.layer * 0.1)) % (CANVAS_WIDTH + 200));
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

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      drawBackground();
      drawMountains(Date.now() * 0.05);
      drawClouds(Date.now() * 0.02);
      drawObstacles();
      drawItems();
      drawCoins();
      drawPlayer();

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
