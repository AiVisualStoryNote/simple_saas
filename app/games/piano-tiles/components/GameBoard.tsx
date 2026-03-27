"use client";

import { Tile } from "../types";
import { COLS } from "../constants";

interface GameBoardProps {
  tiles: Tile[];
  onTap: (tile: Tile) => void;
}

export function GameBoard({ tiles, onTap }: GameBoardProps) {
  return (
    <div 
      className="relative bg-white rounded-lg overflow-hidden shadow-xl"
      style={{ height: 400 }}
    >
      {tiles.map(tile => {
        const tileHeight = 100;
        const tileWidth = 100 / COLS;
        const col = tile.id % COLS;
        return (
          <div
            key={tile.id}
            onClick={() => onTap(tile)}
            className={`absolute transition-transform cursor-pointer ${
              tile.isBlack ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-100 border-b border-gray-200"
            }`}
            style={{
              top: tile.y,
              left: `${col * tileWidth}%`,
              width: `${tileWidth}%`,
              height: tileHeight,
            }}
          />
        );
      })}
    </div>
  );
}
