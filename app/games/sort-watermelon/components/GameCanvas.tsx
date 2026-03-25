"use client";

import { useEffect, useRef } from "react";
import { Block } from "../types";
import { GAME_CONFIG } from "../constants";
import { FRUIT_SIZES, FRUIT_COLORS } from "../types";

interface GameCanvasProps {
  blocks: Block[];
  currentX: number;
  onMouseMove: (x: number) => void;
}

export function GameCanvas({ blocks, currentX, onMouseMove }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    // 画线
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(GAME_CONFIG.canvasWidth, 40);
    ctx.stroke();

    // 绘制所有水果
    blocks.forEach(block => {
      const size = FRUIT_SIZES[block.level].size;
      const color = FRUIT_COLORS[block.level];
      const centerX = block.x + size / 2;
      const centerY = block.y + size / 2;
      const radius = size / 2;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 数字
      ctx.fillStyle = "#fff";
      ctx.font = "bold " + Math.max(16, size / 3) + "px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(FRUIT_SIZES[block.level].value.toString(), centerX, centerY);
    });

    // 绘制预览即将落下的水果
    if (gameState === "playing") {
      const size = FRUIT_SIZES[0].size;
      const centerX = currentX;
      const centerY = 20 + size / 2;
      const radius = size / 2;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = FRUIT_COLORS[0] + "80";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [blocks, currentX]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    onMouseMove(x);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    onMouseMove(x);
    e.preventDefault();
  };

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.canvasWidth}
      height={GAME_CONFIG.canvasHeight}
      className="border-4 border-gray-200 rounded-xl shadow-lg bg-white max-w-full mx-auto"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    />
  );
}
