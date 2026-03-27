"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, Ball, Brick } from "../types";
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT,
  BALL_RADIUS, BRICK_ROWS, BRICK_COLS, BRICK_HEIGHT,
  BRICK_PADDING, BRICK_OFFSET_TOP, BRICK_OFFSET_LEFT, BRICK_COLORS
} from "../constants";
import { getHighScore, saveHighScore } from "../utils/storage";

interface UseGameEngineProps {
  onGameOver: (score: number, bricksLeft: number, isNewRecord: boolean) => void;
}

function createBricks(): Brick[] {
  const bricks: Brick[] = [];
  const brickWidth = (CANVAS_WIDTH - BRICK_OFFSET_LEFT * 2 - (BRICK_COLS - 1) * BRICK_PADDING) / BRICK_COLS;
  
  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      const x = BRICK_OFFSET_LEFT + col * (brickWidth + BRICK_PADDING);
      const y = BRICK_OFFSET_TOP + row * (BRICK_HEIGHT + BRICK_PADDING);
      bricks.push({
        x,
        y,
        width: brickWidth,
        height: BRICK_HEIGHT,
        active: true,
        color: BRICK_COLORS[row % BRICK_COLORS.length],
      });
    }
  }
  
  return bricks;
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [bricksLeft, setBricksLeft] = useState(BRICK_ROWS * BRICK_COLS);
  const [paddleX, setPaddleX] = useState((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
  const [ball, setBall] = useState<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS * 2,
    vx: 3,
    vy: -3,
    radius: BALL_RADIUS,
  });
  const [bricks, setBricks] = useState<Brick[]>([]);
  
  const animationRef = useRef<number | null>(null);

  const startGame = useCallback(() => {
    setScore(0);
    const newBricks = createBricks();
    setBricks(newBricks);
    setBricksLeft(BRICK_ROWS * BRICK_COLS);
    setPaddleX((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS * 2,
      vx: 3,
      vy: -3,
      radius: BALL_RADIUS,
    });
    setGameState("playing");
  }, []);

  const movePaddle = useCallback((ratio: number) => {
    if (gameState !== "playing") return;
    const x = ratio * CANVAS_WIDTH - PADDLE_WIDTH / 2;
    const clamped = Math.max(0, Math.min(x, CANVAS_WIDTH - PADDLE_WIDTH));
    setPaddleX(clamped);
  }, [gameState]);

  const checkCollision = useCallback(() => {
    let changed = false;
    let newBricksLeft = bricksLeft;
    let newScore = score;
    const newBricks = bricks.map(brick => {
      if (!brick.active) return brick;
      
      // Check ball collision with brick
      const ballLeft = ball.x - ball.radius;
      const ballRight = ball.x + ball.radius;
      const ballTop = ball.y - ball.radius;
      const ballBottom = ball.y + ball.radius;
      
      if (
        ballRight > brick.x &&
        ballLeft < brick.x + brick.width &&
        ballBottom > brick.y &&
        ballTop < brick.y + brick.height
      ) {
        // Hit brick
        changed = true;
        newBricksLeft--;
        newScore += 10 * (BRICK_COLORS.length - BRICK_COLORS.indexOf(brick.color));
        return { ...brick, active: false };
      }
      
      return brick;
    });
    
    if (changed) {
      // Reverse vertical direction
      setBall(prev => ({ ...prev, vy: -prev.vy }));
      setBricks(newBricks);
      setBricksLeft(newBricksLeft);
      setScore(newScore);
      
      // Check win
      if (newBricksLeft === 0) {
        setGameState("gameover");
        const storedHigh = getHighScore();
        const isNewRecord = newScore > storedHigh;
        if (isNewRecord) saveHighScore(newScore);
        onGameOver(newScore, newBricksLeft, isNewRecord);
      }
    }
  }, [ball, bricks, bricksLeft, score, onGameOver]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const loop = () => {
      setBall(prev => {
        let newX = prev.x + prev.vx;
        let newY = prev.y + prev.vy;
        let newVx = prev.vx;
        let newVy = prev.vy;
        
        // Wall collision
        if (newX - prev.radius <= 0 || newX + prev.radius >= CANVAS_WIDTH) {
          newVx = -newVx;
        }
        if (newY - prev.radius <= 0) {
          newVy = -newVy;
        }
        
        // Paddle collision
        if (
          newY + prev.radius >= CANVAS_HEIGHT - PADDLE_HEIGHT &&
          newX >= paddleX &&
          newX <= paddleX + PADDLE_WIDTH
        ) {
          // Hit paddle
          newVy = -Math.abs(newVy);
          // Add angle based on where it hit
          const hitPos = (newX - paddleX) / PADDLE_WIDTH;
          newVx = 5 * (hitPos - 0.5);
        }
        
        // Bottom boundary (game over)
        if (newY + prev.radius > CANVAS_HEIGHT) {
          setTimeout(() => {
            setGameState("gameover");
            const storedHigh = getHighScore();
            const isNewRecord = score > storedHigh;
            if (isNewRecord) saveHighScore(score);
            onGameOver(score, bricksLeft, isNewRecord);
          }, 0);
        }
        
        return {
          ...prev,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      });
      
      checkCollision();
      animationRef.current = requestAnimationFrame(loop);
    };
    
    animationRef.current = requestAnimationFrame(loop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, paddleX, score, bricksLeft, checkCollision, onGameOver]);

  return {
    gameState,
    score,
    bricksLeft,
    paddleX,
    ball,
    bricks,
    startGame,
    movePaddle,
  };
}
