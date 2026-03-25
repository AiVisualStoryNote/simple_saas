"use client";

import { useEffect, useRef } from "react";
import { Pipe } from "../types";
import { GAME_CONFIG, COLORS } from "../constants";

interface GameCanvasProps {
  birdY: number;
  birdRotation: number;
  pipes: Pipe[];
}

export function GameCanvas({ birdY, birdRotation, pipes }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.canvasHeight);
    gradient.addColorStop(0, "#71C5CF");
    gradient.addColorStop(1, "#87CEEB");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    // 绘制管道
    pipes.forEach(pipe => {
      // 上方管道
      ctx.fillStyle = COLORS.pipe;
      ctx.fillRect(pipe.x, 0, GAME_CONFIG.pipeWidth, pipe.topHeight);
      ctx.strokeStyle = COLORS.pipeBorder;
      ctx.lineWidth = 4;
      ctx.strokeRect(pipe.x, 0, GAME_CONFIG.pipeWidth, pipe.topHeight);

      // 下方管道
      const bottomY = pipe.topHeight + GAME_CONFIG.pipeGap;
      const bottomHeight = GAME_CONFIG.canvasHeight - bottomY;
      ctx.fillStyle = COLORS.pipe;
      ctx.fillRect(pipe.x, bottomY, GAME_CONFIG.pipeWidth, bottomHeight);
      ctx.strokeStyle = COLORS.pipeBorder;
      ctx.lineWidth = 4;
      ctx.strokeRect(pipe.x, bottomY, GAME_CONFIG.pipeWidth, bottomHeight);

      // 管道帽
      const capHeight = 20;
      ctx.fillRect(pipe.x - 5, pipe.topHeight - capHeight, GAME_CONFIG.pipeWidth + 10, capHeight);
      ctx.fillRect(pipe.x - 5, bottomY, GAME_CONFIG.pipeWidth + 10, capHeight);
    });

    // 绘制地面
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, GAME_CONFIG.canvasHeight - 40, GAME_CONFIG.canvasWidth, 40);

    // 绘制小鸟
    ctx.save();
    ctx.translate(GAME_CONFIG.birdX, birdY);
    ctx.rotate((birdRotation * Math.PI) / 180);

    // 鸟身体
    const gradientBird = ctx.createRadialGradient(
      -5, -5, 0,
      0, 0, GAME_CONFIG.birdRadius
    );
    gradientBird.addColorStop(0, "#FFE58A");
    gradientBird.addColorStop(1, "#FADC5D");
    ctx.fillStyle = gradientBird;
    ctx.beginPath();
    ctx.arc(0, 0, GAME_CONFIG.birdRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2C3E50";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 眼睛
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(8, -5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(10, -5, 3, 0, Math.PI * 2);
    ctx.fill();

    // 嘴巴
    ctx.fillStyle = "#FF6B35";
    ctx.beginPath();
    ctx.moveTo(GAME_CONFIG.birdRadius, 0);
    ctx.lineTo(GAME_CONFIG.birdRadius + 8, -4);
    ctx.lineTo(GAME_CONFIG.birdRadius + 8, 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }, [birdY, birdRotation, pipes]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.canvasWidth}
      height={GAME_CONFIG.canvasHeight}
      className="w-full max-w-[800px] border-4 border-gray-200 rounded-xl shadow-lg"
    />
  );
}
