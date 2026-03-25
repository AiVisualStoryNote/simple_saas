"use client";

import { useEffect, useRef } from "react";
import { Position } from "../types";
import { GAME_CONFIG, COLORS } from "../constants";

interface GameCanvasProps {
  snake: Position[];
  food: Position;
}

export function GameCanvas({ snake, food }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = GAME_CONFIG.gridSize * GAME_CONFIG.cellCount;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 绘制网格线
    ctx.strokeStyle = COLORS.gridLine;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GAME_CONFIG.cellCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GAME_CONFIG.gridSize, 0);
      ctx.lineTo(i * GAME_CONFIG.gridSize, canvasSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * GAME_CONFIG.gridSize);
      ctx.lineTo(canvasSize, i * GAME_CONFIG.gridSize);
      ctx.stroke();
    }

    // 绘制食物
    const foodX = food.x * GAME_CONFIG.gridSize;
    const foodY = food.y * GAME_CONFIG.gridSize;
    const padding = 2;
    ctx.fillStyle = COLORS.food;
    ctx.beginPath();
    ctx.arc(
      foodX + GAME_CONFIG.gridSize / 2,
      foodY + GAME_CONFIG.gridSize / 2,
      (GAME_CONFIG.gridSize - padding * 2) / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 绘制蛇
    snake.forEach((segment, index) => {
      const x = segment.x * GAME_CONFIG.gridSize;
      const y = segment.y * GAME_CONFIG.gridSize;
      const padding = 1;

      if (index === 0) {
        // 蛇头
        ctx.fillStyle = COLORS.snakeHead;
      } else {
        // 蛇身
        ctx.fillStyle = COLORS.snakeBody;
      }

      ctx.fillRect(
        x + padding,
        y + padding,
        GAME_CONFIG.gridSize - padding * 2,
        GAME_CONFIG.gridSize - padding * 2
      );

      // 蛇头眼睛
      if (index === 0) {
        ctx.fillStyle = COLORS.background;
        const eyeSize = 3;
        // 根据方向调整眼睛位置，这里简化处理
        ctx.beginPath();
        ctx.arc(x + GAME_CONFIG.gridSize / 3, y + GAME_CONFIG.gridSize / 3, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + GAME_CONFIG.gridSize * 2 / 3, y + GAME_CONFIG.gridSize / 3, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [snake, food, canvasSize]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      className="border-4 border-gray-700 rounded-lg shadow-xl bg-gray-900 max-w-full"
    />
  );
}
