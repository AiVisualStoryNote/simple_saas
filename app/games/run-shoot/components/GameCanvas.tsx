"use client";

import { useEffect, useRef } from "react";
import { Bullet, Enemy, PowerUp } from "../types";
import { GAME_CONFIG, COLORS, POWERUP_NAMES } from "../constants";

interface GameCanvasProps {
  playerY: number;
  playerHp: number;
  bullets: Bullet[];
  enemies: Enemy[];
  powerUps: PowerUp[];
  onMouseMove: (y: number) => void;
}

export function GameCanvas({
  playerY,
  playerHp,
  bullets,
  enemies,
  powerUps,
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
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.canvasHeight);
    gradient.addColorStop(0, COLORS.sky);
    gradient.addColorStop(1, COLORS.background);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    // 绘制地面
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, GAME_CONFIG.canvasHeight - 20, GAME_CONFIG.canvasWidth, 20);

    // 绘制道具
    powerUps.forEach(powerUp => {
      let color = COLORS.healthPowerUp;
      if (powerUp.type === "speed") color = COLORS.speedPowerUp;
      if (powerUp.type === "multishot") color = COLORS.multishotPowerUp;

      ctx.fillStyle = color;
      ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

      // 图标
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        powerUp.type === "health" ? "❤️" : powerUp.type === "speed" ? "⚡" : "🔥",
        powerUp.x + powerUp.width / 2,
        powerUp.y + powerUp.height / 2 + 6
      );
    });

    // 绘制敌人
    enemies.forEach(enemy => {
      ctx.fillStyle = COLORS.enemy;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);

      // 血条
      if (enemy.hp < enemy.maxHp) {
        const hpPercent = enemy.hp / enemy.maxHp;
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x, enemy.y - 8, enemy.width, 5);
        ctx.fillStyle = "green";
        ctx.fillRect(enemy.x, enemy.y - 8, enemy.width * hpPercent, 5);
      }
    });

    // 绘制子弹
    bullets.forEach(bullet => {
      ctx.fillStyle = COLORS.bullet;
      ctx.fillRect(bullet.x, bullet.y, 4, 8);
    });

    // 绘制玩家
    ctx.fillStyle = COLORS.player;
    ctx.fillRect(
      GAME_CONFIG.playerX,
      playerY,
      GAME_CONFIG.playerWidth,
      GAME_CONFIG.playerHeight
    );
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      GAME_CONFIG.playerX,
      playerY,
      GAME_CONFIG.playerWidth,
      GAME_CONFIG.playerHeight
    );

    // 玩家血条
    ctx.fillStyle = "gray";
    ctx.fillRect(10, 10, 100, 10);
    ctx.fillStyle = "green";
    ctx.fillRect(10, 10, 100 * (playerHp / 5), 10);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 100, 10);

    //  buff 显示
    let y = 25;
    if (bullets.length > 0) {
      // 不对，buff在这里显示
    }
  }, [playerY, playerHp, bullets, enemies, powerUps]);

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = e.clientY - rect.top - GAME_CONFIG.playerHeight / 2;
    onMouseMove(y);
  };

  // 触摸移动（移动端）
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    const y = touch.clientY - rect.top - GAME_CONFIG.playerHeight / 2;
    onMouseMove(y);
    e.preventDefault();
  };

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.canvasWidth}
      height={GAME_CONFIG.canvasHeight}
      className="w-full max-w-[800px] border-4 border-gray-700 rounded-xl shadow-lg bg-sky-300"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    />
  );
}
