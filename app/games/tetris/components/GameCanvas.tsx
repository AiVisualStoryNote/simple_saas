"use client";

import { useRef, useEffect } from "react";
import { Board, Piece } from "../types";
import { COLS, ROWS, BLOCK_SIZE } from "../constants";

interface GameCanvasProps {
  board: Board;
  currentPiece: Piece | null;
}

export function GameCanvas({ board, currentPiece }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 0.5;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }

    // Draw placed blocks
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const color = board[y][x];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(
            x * BLOCK_SIZE + 1,
            y * BLOCK_SIZE + 1,
            BLOCK_SIZE - 2,
            BLOCK_SIZE - 2
          );
          // Highlight
          ctx.fillStyle = color + "80";
          ctx.fillRect(
            x * BLOCK_SIZE + 1,
            y * BLOCK_SIZE + 1,
            BLOCK_SIZE - 2,
            BLOCK_SIZE - 2
          );
        }
      }
    }

    // Draw current piece
    if (currentPiece) {
      const shape = currentPiece.shape;
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardX = (currentPiece.x + x) * BLOCK_SIZE;
            const boardY = (currentPiece.y + y) * BLOCK_SIZE;
            ctx.fillStyle = currentPiece.color;
            ctx.fillRect(
              boardX + 1,
              boardY + 1,
              BLOCK_SIZE - 2,
              BLOCK_SIZE - 2
            );
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.strokeRect(
              boardX + 1,
              boardY + 1,
              BLOCK_SIZE - 2,
              BLOCK_SIZE - 2
            );
          }
        }
      }
    }
  }, [board, currentPiece]);

  return (
    <canvas
      ref={canvasRef}
      width={COLS * BLOCK_SIZE}
      height={ROWS * BLOCK_SIZE}
      className="w-full rounded-lg shadow-lg border-2 border-gray-700"
    />
  );
}
