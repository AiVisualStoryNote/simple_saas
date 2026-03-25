"use client";

import { useEffect, useRef } from "react";
import { Bullet, Enemy } from "../types";
import { GAME_CONFIG, COLORS, ENEMY_CONFIG } from "../constants";

interface GameCanvasProps {
  playerX: number;
  playerY: number;
  playerHp: number;
  bullets: Bullet[];
  enemies: Enemy[];
  onMouseMove: (x: number) => void;
}

export function GameCanvas({
  playerX,
  playerY,
  playerHp,
  bullets,
  enemies,
  onMouseMove,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    // 绘制星星背景
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    for (let i = 0; i < 50; i++) {
      const x = (i * 137) % GAME_CONFIG.canvasWidth;
      const y = (i * 214) % GAME_CONFIG.canvasHeight;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 绘制子弹
    bullets.forEach(bullet => {
      ctx.fillStyle = bullet.isPlayer ? COLORS.bulletPlayer : COLORS.bulletEnemy;
      ctx.fillRect(bullet.x, bullet.y, 4, 10);
    });

    // 绘制敌机
    enemies.forEach(enemy => {
      const config = ENEMY_CONFIG[enemy.type];
      let color = COLORS.enemySmall;
      if (enemy.type === "medium") color = COLORS.enemyMedium;
      if (enemy.type === "large") color = COLORS.enemyLarge;

      ctx.fillStyle = color;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

      // 血条
      if (enemy.hp < enemy.maxHp) {
        const hpPercent = enemy.hp / enemy.maxHp;
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x, enemy.y - 8, enemy.width, 5);
        ctx.fillStyle = "green";
        ctx.fillRect(enemy.x, enemy.y - 8, enemy.width * hpPercent, 5);
      }

      // 边框
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // 绘制玩家飞机
    ctx.fillStyle = COLORS.player;
    // 飞机形状：三角形
    ctx.beginPath();
    ctx.moveTo(playerX + GAME_CONFIG.playerWidth / 2, playerY);
    ctx.lineTo(playerX, playerY + GAME_CONFIG.playerHeight);
    ctx.lineTo(playerX + GAME_CONFIG.playerWidth, playerY + GAME_CONFIG.playerHeight);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 玩家血条
    const hpPercent = playerHp / 5;
    ctx.fillStyle = "gray";
    ctx.fillRect(10, 10, 100, 10);
    ctx.fillStyle = "green";
    ctx.fillRect(10, 10, 100 * hpPercent, 10);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 100, 10);
  }, [playerX, playerY, playerHp, bullets, enemies]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    onMouseMove(x - GAME_CONFIG.playerWidth / 2);
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    handleMouseMove(e);
  };

  // 触摸移动（移动端）
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    onMouseMove(x - GAME_CONFIG.playerWidth / 2);
    e.preventDefault();
  };

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.canvasWidth}
      height={GAME_CONFIG.canvasHeight}
      className="w-full max-w-[800px] border-4 border-gray-700 rounded-xl shadow-lg bg-black"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMove}
      onTouchMove={handleTouchMove}
    />
  );
}
