"use client";

import { useEffect, useRef } from "react";
import { CharacterSprite } from "../types/index";
import { clampSpriteConfig, getSpriteFrameSource, getSpriteRenderSize, getSpriteSheetMetrics } from "../utils/sprite";

interface SpritePreviewCanvasProps {
  sprite: CharacterSprite | null;
  frameIndex: number;
  isPlaying: boolean;
}

export function SpritePreviewCanvas({ sprite, frameIndex, isPlaying }: SpritePreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageReadyRef = useRef(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sprite?.src) {
      imageRef.current = null;
      imageReadyRef.current = false;
      return;
    }

    const image = new Image();
    let isActive = true;

    imageReadyRef.current = false;
    image.onload = () => {
      if (!isActive) return;
      imageRef.current = image;
      imageReadyRef.current = true;
    };
    image.onerror = () => {
      if (!isActive) return;
      imageRef.current = null;
      imageReadyRef.current = false;
    };
    image.src = sprite.src;

    return () => {
      isActive = false;
    };
  }, [sprite?.src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const safeSprite = sprite ? clampSpriteConfig(sprite) : null;
    const width = canvas.width;
    const height = canvas.height;

    const drawChecker = () => {
      const size = 18;
      for (let y = 0; y < height; y += size) {
        for (let x = 0; x < width; x += size) {
          ctx.fillStyle = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0 ? "#f5f5f5" : "#d4d4d4";
          ctx.fillRect(x, y, size, size);
        }
      }
    };

    const drawGuides = (renderWidth: number, renderHeight: number) => {
      const baselineY = height - 16;
      const centerX = width / 2;

      ctx.strokeStyle = "rgba(220, 38, 38, 0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, baselineY);
      ctx.lineTo(width, baselineY);
      ctx.stroke();

      ctx.strokeStyle = "rgba(37, 99, 235, 0.75)";
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      ctx.strokeStyle = "rgba(16, 185, 129, 0.9)";
      ctx.strokeRect(centerX - renderWidth / 2, baselineY - renderHeight, renderWidth, renderHeight);
      ctx.setLineDash([]);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      drawChecker();

      if (!safeSprite) {
        ctx.fillStyle = "#111827";
        ctx.font = "14px monospace";
        ctx.fillText("No sprite config", 16, 24);
        return;
      }

      const { width: renderWidth, height: renderHeight } = getSpriteRenderSize(safeSprite);
      drawGuides(renderWidth, renderHeight);

      if (!imageRef.current || !imageReadyRef.current) {
        ctx.fillStyle = "#111827";
        ctx.font = "14px monospace";
        ctx.fillText("Loading sprite...", 16, 24);
        return;
      }

      const metrics = getSpriteSheetMetrics(safeSprite);
      const frame = getSpriteFrameSource(
        safeSprite,
        frameIndex,
        imageRef.current.naturalWidth,
        imageRef.current.naturalHeight,
      );
      const baselineY = height - 16;
      const drawX = width / 2 - renderWidth / 2;
      const drawY = baselineY - renderHeight;

      ctx.drawImage(
        imageRef.current,
        frame.sourceX,
        frame.sourceY,
        frame.sourceWidth,
        frame.sourceHeight,
        drawX,
        drawY,
        renderWidth,
        renderHeight,
      );

      ctx.fillStyle = "rgba(17, 24, 39, 0.8)";
      ctx.fillRect(10, 8, 180, 40);
      ctx.fillStyle = "#fff";
      ctx.font = "11px monospace";
      ctx.fillText(`frame ${frame.frameIndex + 1}/${metrics.frameCount}`, 18, 24);
      ctx.fillText(`${isPlaying ? "play" : "pause"} ${safeSprite.frameDurationMs}ms`, 18, 38);
    };

    render();
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [sprite, frameIndex, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={96}
      className="h-[96px] w-full rounded-2xl border border-black/10 bg-white shadow-inner"
    />
  );
}
