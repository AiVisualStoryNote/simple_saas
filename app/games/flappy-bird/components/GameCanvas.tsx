"use client";

import { useEffect, useRef } from "react";
import { GAME_CONFIG, GROUND_HEIGHT, BIRD_START_X } from "../constants";
import { Pipe } from "../types";

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

    const { CANVAS_WIDTH, CANVAS_HEIGHT, BIRD_SIZE, PIPE_WIDTH } = GAME_CONFIG;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#E0F6FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    pipes.forEach((pipe) => {
      const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      pipeGradient.addColorStop(0, "#2ECC71");
      pipeGradient.addColorStop(0.5, "#27AE60");
      pipeGradient.addColorStop(1, "#1E8449");
      ctx.fillStyle = pipeGradient;

      const capHeight = 30;
      const capMargin = 5;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY - GAME_CONFIG.PIPE_GAP / 2);
      ctx.fillRect(pipe.x - capMargin, pipe.gapY - GAME_CONFIG.PIPE_GAP / 2 - capHeight, PIPE_WIDTH + capMargin * 2, capHeight);

      ctx.fillRect(pipe.x, pipe.gapY + GAME_CONFIG.PIPE_GAP / 2, PIPE_WIDTH, CANVAS_HEIGHT - pipe.gapY - GAME_CONFIG.PIPE_GAP / 2);
      ctx.fillRect(pipe.x - capMargin, pipe.gapY + GAME_CONFIG.PIPE_GAP / 2, PIPE_WIDTH + capMargin * 2, capHeight);
    });

    ctx.save();
    ctx.translate(BIRD_START_X + BIRD_SIZE / 2, birdY + BIRD_SIZE / 2);
    const angle = Math.max(-0.5, Math.min(0.5, birdRotation * 0.05));
    ctx.rotate(angle);
    ctx.font = `${BIRD_SIZE}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🐦", 0, 0);
    ctx.restore();

    const groundGradient = ctx.createLinearGradient(0, CANVAS_HEIGHT - GROUND_HEIGHT, 0, CANVAS_HEIGHT);
    groundGradient.addColorStop(0, "#8B4513");
    groundGradient.addColorStop(1, "#654321");
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);

  }, [birdY, birdRotation, pipes]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        className="border-4 border-yellow-600 rounded-xl shadow-2xl"
      />
    </div>
  );
}