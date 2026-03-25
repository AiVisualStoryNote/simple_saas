"use client";

import { Tube as TubeType } from "../types";
import { Tube } from "./Tube";

interface GameBoardProps {
  tubes: TubeType[];
  selectedTubeId: number | null;
  onSelectTube: (tube: TubeType) => void;
}

export function GameBoard({ tubes, selectedTubeId, onSelectTube }: GameBoardProps) {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 max-w-md mx-auto">
      {tubes.map(tube => (
        <Tube
          key={tube.id}
          tube={tube}
          isSelected={selectedTubeId === tube.id}
          onClick={() => onSelectTube(tube)}
        />
      ))}
    </div>
  );
}
