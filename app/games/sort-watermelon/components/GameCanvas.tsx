"use client";

import { useEffect, useRef } from "react";
import { Block } from "../types";
import { GAME_CONFIG } from "../constants";
import { FRUIT_SIZES } from "../types";

interface GameCanvasProps {
  blocks: Block[];
  currentX: number;
}

const FRUIT_COLORS = [
  "#8B5CF6", // 葡萄 - 紫色
  "#EC4899", // 樱桃 - 粉色
  "#F59E0B", // 柠檬 - 黄色
  "#10B981", // 青苹果 - 绿色
  "#EF4444", // 草莓 - 红色
  "#F97316", // 橙子 - 橙色
  "#8B4513", // 椰子 - 棕色
  "#EAB308", // 菠萝 - 金黄
  "#22C55E", // 哈密瓜 - 浅绿
  "#16A34A", // 西瓜 - 深绿
];

export function GameCanvas({ blocks, currentX }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    // 绘制背景
    ctx.fillStyle = "#166534";
    ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    // 绘制预览水果
    if (currentX > 0) {
      const size = FRUIT_SIZES[0].size;
      ctx.beginPath();
      ctx.arc(currentX, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = FRUIT_COLORS[0] + "80";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 水果文字
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("1", currentX, size / 2);
    }

    // 绘制所有方块
    blocks.forEach(block => {
      const { size } = FRUIT_SIZES[block.level];
      const color = FRUIT_COLORS[block.level] || "#999";
      
      ctx.beginPath();
      ctx.arc(block.x + size / 2, block.y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 等级文字
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(block.level + 1), block.x + size / 2, block.y + size / 2);
    });
  }, [blocks, currentX]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.canvasWidth}
      height={GAME_CONFIG.canvasHeight}
      className="w-full rounded-xl shadow-lg bg-green-800"
    />
  );
}
