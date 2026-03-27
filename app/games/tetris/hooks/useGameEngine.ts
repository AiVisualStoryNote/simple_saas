"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, Piece, Board } from "../types";
import { COLS, ROWS, SHAPES, COLORS, LEVEL_SPEED, POINTS } from "../constants";
import { getHighScore, saveHighScore } from "../utils/storage";

interface UseGameEngineProps {
  onGameOver: (score: number, lines: number, level: number, isNewRecord: boolean) => void;
}

function createEmptyBoard(): Board {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
}

function randomPiece(): Piece {
  const index = Math.floor(Math.random() * SHAPES.length);
  return {
    shape: SHAPES[index],
    x: Math.floor((COLS - SHAPES[index][0].length) / 2),
    y: 0,
    color: COLORS[index],
  };
}

function collides(board: Board, piece: Piece): boolean {
  const shape = piece.shape;
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardX = piece.x + x;
        const boardY = piece.y + y;
        
        if (
          boardX < 0 || 
          boardX >= COLS || 
          boardY >= ROWS || 
          (boardY >= 0 && board[boardY][boardX])
        ) {
          return true;
        }
      }
    }
  }
  
  return false;
}

function rotate(matrix: number[][]): number[][] {
  const result = matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
  return result;
}

function merge(board: Board, piece: Piece): Board {
  const newBoard = board.map(row => [...row]);
  const shape = piece.shape;
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardY = piece.y + y;
        const boardX = piece.x + x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }
  
  return newBoard;
}

function clearLines(board: Board): { linesCleared: number; newBoard: Board } {
  let linesCleared = 0;
  const newBoard = [...board];
  
  for (let y = ROWS - 1; y >= 0; y--) {
    if (newBoard[y].every(cell => cell !== null)) {
      newBoard.splice(y, 1);
      newBoard.unshift(Array(COLS).fill(null));
      linesCleared++;
      y++; // Check the same row again after shift
    }
  }
  
  return { linesCleared, newBoard };
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  
  const dropIntervalRef = useRef<number | null>(null);

  const getLevel = (linesCleared: number) => Math.floor(linesCleared / 10) + 1;
  
  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameState("playing");
    setCurrentPiece(randomPiece());
  }, []);

  const pauseGame = useCallback(() => {
    setGameState("paused");
  }, []);

  const resumeGame = useCallback(() => {
    setGameState("playing");
  }, []);

  const goToMenu = useCallback(() => {
    setGameState("menu");
    if (dropIntervalRef.current) {
      cancelAnimationFrame(dropIntervalRef.current);
    }
  }, []);

  const moveLeft = useCallback(() => {
    if (!currentPiece || gameState !== "playing") return;
    const newPiece = { ...currentPiece, x: currentPiece.x - 1 };
    if (!collides(board, newPiece)) {
      setCurrentPiece(newPiece);
    }
  }, [currentPiece, board, gameState]);

  const moveRight = useCallback(() => {
    if (!currentPiece || gameState !== "playing") return;
    const newPiece = { ...currentPiece, x: currentPiece.x + 1 };
    if (!collides(board, newPiece)) {
      setCurrentPiece(newPiece);
    }
  }, [currentPiece, board, gameState]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameState !== "playing") return;
    const rotated = { 
      ...currentPiece, 
      shape: rotate(currentPiece.shape) 
    };
    if (!collides(board, rotated)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, board, gameState]);

  const softDrop = useCallback(() => {
    if (!currentPiece || gameState !== "playing") return;
    const newPiece = { ...currentPiece, y: currentPiece.y + 1 };
    if (!collides(board, newPiece)) {
      setCurrentPiece(newPiece);
      setScore(prev => prev + POINTS.SOFT_DROP);
    }
  }, [currentPiece, board, gameState]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameState !== "playing") return;
    let newY = currentPiece.y;
    while (!collides(board, { ...currentPiece, y: newY + 1 })) {
      newY++;
    }
    const dropDistance = newY - currentPiece.y;
    setScore(prev => prev + POINTS.HARD_DROP * dropDistance);
    setCurrentPiece(prev => prev ? { ...prev, y: newY } : null);
  }, [currentPiece, board, gameState]);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;
    
    const newBoard = merge(board, currentPiece);
    const { linesCleared, newBoard: clearedBoard } = clearLines(newBoard);
    
    const newLines = lines + linesCleared;
    const newScore = score + [0, POINTS.SINGLE, POINTS.DOUBLE, POINTS.TRIPLE, POINTS.TETRIS][linesCleared] * level;
    const newLevel = getLevel(newLines);
    
    setBoard(clearedBoard);
    setLines(newLines);
    setScore(newScore);
    setLevel(newLevel);
    
    const nextPiece = randomPiece();
    if (collides(clearedBoard, nextPiece)) {
      // Game over
      setGameState("gameover");
      const storedHigh = getHighScore();
      const isNewRecord = newScore > storedHigh;
      if (isNewRecord) {
        saveHighScore(newScore);
      }
      onGameOver(newScore, newLines, newLevel, isNewRecord);
    } else {
      setCurrentPiece(nextPiece);
    }
  }, [currentPiece, board, score, lines, level, onGameOver]);

  const drop = useCallback(() => {
    if (!currentPiece || gameState !== "playing") return;
    
    const newPiece = { ...currentPiece, y: currentPiece.y + 1 };
    if (!collides(board, newPiece)) {
      setCurrentPiece(newPiece);
    } else {
      lockPiece();
    }
  }, [currentPiece, board, gameState, lockPiece]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const speed = LEVEL_SPEED[Math.min(level - 1, LEVEL_SPEED.length - 1)];
    let lastTime = 0;
    
    const loop = (time: number) => {
      if (lastTime === 0) {
        lastTime = time;
      }
      
      const delta = time - lastTime;
      if (delta > speed) {
        drop();
        lastTime = time;
      }
      
      dropIntervalRef.current = requestAnimationFrame(loop);
    };
    
    dropIntervalRef.current = requestAnimationFrame(loop);
    
    return () => {
      if (dropIntervalRef.current) {
        cancelAnimationFrame(dropIntervalRef.current);
      }
    };
  }, [gameState, level, drop]);

  return {
    gameState,
    score,
    lines,
    level,
    board,
    currentPiece,
    startGame,
    pauseGame,
    resumeGame,
    goToMenu,
    moveLeft,
    moveRight,
    rotate: rotatePiece,
    softDrop,
    hardDrop,
  };
}
