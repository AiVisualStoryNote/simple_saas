"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GameState, Tile } from "../types";
import { COLS, INITIAL_SPEED, SPEED_INCREMENT, INITIAL_ROWS } from "../constants";
import { getBestScore, saveBestScore } from "../utils/storage";

interface UseGameEngineProps {
  onGameOver: (score: number, bestScore: number, isNewBest: boolean) => void;
}

let nextTileId = 0;

function generateRow(): boolean[] {
  const blackCol = Math.floor(Math.random() * COLS);
  return Array(COLS).fill(false).map((_, i) => i === blackCol);
}

export function useGameEngine({ onGameOver }: UseGameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const tileHeightRef = useRef(100);
  const containerHeightRef = useRef(400);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  const addRow = useCallback((currentTiles: Tile[]) => {
    const rowIsBlack = generateRow();
    const newTiles = [...currentTiles];
    
    for (let col = 0; col < COLS; col++) {
      newTiles.push({
        id: nextTileId++,
        isBlack: rowIsBlack[col],
        y: -tileHeightRef.current * (newTiles.length / COLS + 1),
      });
    }
    
    return newTiles;
  }, []);

  const startGame = useCallback(() => {
    let initialTiles: Tile[] = [];
    for (let i = 0; i < INITIAL_ROWS; i++) {
      initialTiles = addRow(initialTiles);
    }
    
    setTiles(initialTiles);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState("playing");
    nextTileId = 0;
  }, [addRow]);

  const tapTile = useCallback((tile: Tile) => {
    if (gameState !== "playing") return;
    
    if (!tile.isBlack) {
      // Game over
      setGameState("gameover");
      const storedBest = getBestScore();
      const isNewBest = score > storedBest;
      if (isNewBest) {
        saveBestScore(score);
      }
      onGameOver(score, storedBest, isNewBest);
      return;
    }
    
    // Correct tap
    setScore(prev => prev + 1);
    setTiles(prev => prev.filter(t => t.id !== tile.id));
    // Increase speed every 10 points
    if ((score + 1) % 10 === 0) {
      setSpeed(prev => prev + SPEED_INCREMENT);
    }
  }, [gameState, score, onGameOver]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const loop = (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }
      
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;
      
      setTiles(prev => {
        const movedTiles = prev.map(tile => ({
          ...tile,
          y: tile.y + speed * delta * 100,
        }));
        
        // Remove tiles that went off screen
        const filtered = movedTiles.filter(tile => tile.y < containerHeightRef.current);
        
        // Check if any black tile went off (missed)
        const missedBlack = movedTiles.some(tile => 
          tile.isBlack && tile.y >= containerHeightRef.current
        );
        
        if (missedBlack) {
          // Missed black tile - game over
          setTimeout(() => {
            setGameState("gameover");
            const storedBest = getBestScore();
            const isNewBest = score > storedBest;
            if (isNewBest) saveBestScore(score);
            onGameOver(score, storedBest, isNewBest);
          }, 0);
          return prev;
        }
        
        // Add new row when needed
        const currentRows = filtered.length / COLS;
        if (currentRows < INITIAL_ROWS + Math.floor(score / 5) + 1) {
          return addRow(filtered);
        }
        
        return filtered;
      });
      
      animationRef.current = requestAnimationFrame(loop);
    };
    
    animationRef.current = requestAnimationFrame(loop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, speed, score, addRow, onGameOver]);

  return {
    gameState,
    score,
    speed,
    tiles,
    startGame,
    tapTile,
  };
}
