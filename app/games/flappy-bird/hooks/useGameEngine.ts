"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, Pipe } from "../types";
import { GAME_CONFIG, BIRD_START_X, BIRD_START_Y } from "../constants";
import { getHighScore, setHighScore as saveHighScore } from "../utils/storage";

interface UseGameEngineProps {
  onGameOver: (score: number, isNewRecord: boolean) => void;
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [birdY, setBirdY] = useState(BIRD_START_Y);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [birdRotation, setBirdRotation] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const animationRef = useRef<number | null>(null);
  const lastPipeTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const birdYRef = useRef(BIRD_START_Y);
  const birdVelocityRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const gameStateRef = useRef<GameState>("idle");
  const highScoreRef = useRef(0);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    setHighScore(getHighScore());
    highScoreRef.current = getHighScore();
  }, []);

  const generatePipe = useCallback(() => {
    const { CANVAS_HEIGHT } = GAME_CONFIG;
    const minHeight = 80;
    const maxHeight = CANVAS_HEIGHT - GAME_CONFIG.PIPE_GAP - minHeight - 80;
    const gapY = minHeight + Math.random() * (maxHeight - minHeight);

    return {
      x: GAME_CONFIG.CANVAS_WIDTH,
      gapY,
      passed: false,
    };
  }, []);

  const startGame = useCallback(() => {
    setBirdY(BIRD_START_Y);
    setBirdVelocity(0);
    setBirdRotation(0);
    setPipes([]);
    setScore(0);
    scoreRef.current = 0;
    birdYRef.current = BIRD_START_Y;
    birdVelocityRef.current = 0;
    pipesRef.current = [];
    lastPipeTimeRef.current = performance.now();
    lastTimeRef.current = performance.now();
    setGameState("playing");
  }, []);

  const jump = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    birdVelocityRef.current = GAME_CONFIG.JUMP_FORCE;
    setBirdVelocity(GAME_CONFIG.JUMP_FORCE);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState("paused");
  }, []);

  const resumeGame = useCallback(() => {
    setGameState("playing");
    lastTimeRef.current = performance.now();
    lastPipeTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(gameLoopRef.current);
  }, []);

  const goToMenu = useCallback(() => {
    setGameState("idle");
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const checkCollision = useCallback((birdYPos: number): boolean => {
    const { CANVAS_HEIGHT, BIRD_SIZE } = GAME_CONFIG;
    const birdRadius = BIRD_SIZE / 2;

    if (birdYPos + birdRadius >= CANVAS_HEIGHT || birdYPos - birdRadius <= 0) {
      return true;
    }

    for (const pipe of pipesRef.current) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + GAME_CONFIG.PIPE_WIDTH;

      if (
        BIRD_START_X + birdRadius >= pipeLeft &&
        BIRD_START_X - birdRadius <= pipeRight
      ) {
        const gapTop = pipe.gapY - GAME_CONFIG.PIPE_GAP / 2;
        const gapBottom = pipe.gapY + GAME_CONFIG.PIPE_GAP / 2;

        if (birdYPos - birdRadius <= gapTop || birdYPos + birdRadius >= gapBottom) {
          return true;
        }
      }
    }

    return false;
  }, []);

  const gameLoopRef = useRef<(timestamp: number) => void>((timestamp: number) => {
    if (gameStateRef.current !== "playing") return;

    const deltaTime = timestamp - (lastTimeRef.current || timestamp);
    lastTimeRef.current = timestamp;

    birdVelocityRef.current += GAME_CONFIG.GRAVITY;
    birdYRef.current += birdVelocityRef.current;
    setBirdY(birdYRef.current);
    setBirdVelocity(birdVelocityRef.current);
    setBirdRotation((birdVelocityRef.current / GAME_CONFIG.JUMP_FORCE) * 30);

    if (timestamp - lastPipeTimeRef.current >= GAME_CONFIG.MIN_PIPE_INTERVAL) {
      if (Math.random() < GAME_CONFIG.PIPE_SPAWN_CHANCE || pipesRef.current.length === 0) {
        const newPipe = generatePipe();
        pipesRef.current = [...pipesRef.current, newPipe];
        setPipes([...pipesRef.current]);
        lastPipeTimeRef.current = timestamp;
      }
    }

    pipesRef.current = pipesRef.current
      .map(pipe => ({ ...pipe, x: pipe.x - GAME_CONFIG.PIPE_SPEED }))
      .filter(pipe => pipe.x + GAME_CONFIG.PIPE_WIDTH > 0);

    pipesRef.current.forEach(pipe => {
      if (!pipe.passed && pipe.x + GAME_CONFIG.PIPE_WIDTH < BIRD_START_X) {
        pipe.passed = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }
    });

    setPipes([...pipesRef.current]);

    if (checkCollision(birdYRef.current)) {
      gameStateRef.current = "gameover";
      setGameState("gameover");
      const isNewRecord = scoreRef.current > highScoreRef.current;
      if (isNewRecord) {
        saveHighScore(scoreRef.current);
        highScoreRef.current = scoreRef.current;
        setHighScore(scoreRef.current);
      }
      onGameOver(scoreRef.current, isNewRecord);
      return;
    }

    animationRef.current = requestAnimationFrame(gameLoopRef.current);
  });

  useEffect(() => {
    if (gameState === "playing") {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoopRef.current);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState]);

  return {
    gameState,
    score,
    highScore,
    birdY,
    birdRotation,
    pipes,
    startGame,
    jump,
    pauseGame,
    resumeGame,
    goToMenu,
  };
}
