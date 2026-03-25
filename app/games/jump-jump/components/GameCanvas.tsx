"use client";

import { useEffect, useRef } from "react";
import { Block } from "../types";
import { GAME_CONFIG, COLORS } from "../constants";

interface GameCanvasProps {
  blocks: Block[];
  playerX: number;
  playerY: number;
  playerRadius: number;
  currentPower: number;
  isCharging: boolean;
}

export function GameCanvas({ blocks, playerX, playerY, playerRadius, currentPower, isCharging }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    // 绘制背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.canvasHeight);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#E0F6FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    // 绘制方块
    blocks.forEach((block) => {
      ctx.fillStyle = block.color;
      ctx.fillRect(block.x, block.y, block.width, block.height);

      // 方块边框
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(block.x, block.y, block.width, block.height);
    });

    // 绘制蓄力条
    if (isCharging) {
      const powerBarHeight = (currentPower / GAME_CONFIG.maxPower) * 150;
      const gradientPower = ctx.createLinearGradient(
        GAME_CONFIG.canvasWidth - 40,
        GAME_CONFIG.canvasHeight - 160,
        GAME_CONFIG.canvasWidth - 40,
        GAME_CONFIG.canvasHeight - 10
      );
      gradientPower.addColorStop(0, "#FF6B6B");
      gradientPower.addColorStop(1, "#FFE66D");
      ctx.fillStyle = gradientPower;
      ctx.fillRect(
        GAME_CONFIG.canvasWidth - 40,
        GAME_CONFIG.canvasHeight - 160,
        30,
        powerBarHeight
      );
      ctx.strokeStyle = "#2C3E50";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        GAME_CONFIG.canvasWidth - 40,
        GAME_CONFIG.canvasHeight - 160,
        30,
        150
      );
    }

    // 绘制玩家小球
    const centerX = playerX + playerRadius / 2;
    const centerY = playerY + playerRadius / 2;

    // 阴影
    ctx.beginPath();
    ctx.arc(centerX + 3, centerY + 3, playerRadius / 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fill();

    // 小球
    ctx.beginPath();
    ctx.arc(centerX, centerY, playerRadius / 2, 0, Math.PI * 2);
    const playerGradient = ctx.createRadialGradient(
      centerX - 5,
      centerY - 5,
      0,
      centerX,
      centerY,
      playerRadius / 2
    );
    playerGradient.addColorStop(0, "#FF8787");
    playerGradient.addColorStop(1, "#FF6B6B");
    ctx.fillStyle = playerGradient;
    ctx.fill();
    ctx.strokeStyle = "#2C3E50";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 高光
    ctx.beginPath();
    ctx.arc(centerX - 6, centerY - 6, 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();
  }, [blocks, playerX, playerY, playerRadius, currentPower, isCharging]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.canvasWidth}
      height={GAME_CONFIG.canvasHeight}
      className="w-full max-w-[800px] border-2 border-gray-200 rounded-xl shadow-lg bg-white"
    />
  );
}
