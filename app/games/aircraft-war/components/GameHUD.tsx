"use client";

interface GameHUDProps {
  score: number;
  highScore: number;
  onPause: () => void;
}

export function GameHUD({ score, highScore, onPause }: GameHUDProps) {
  return (
    <div className="absolute top-4 right-4 flex gap-4">
      <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
        <div className="text-sm text-gray-300">分数</div>
        <div className="text-2xl font-bold text-yellow-400">{score}</div>
      </div>
      <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
        <div className="text-sm text-gray-300">最高分</div>
        <div className="text-xl font-bold text-gray-300">{highScore}</div>
      </div>
      <button
        onClick={onPause}
        className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-black/80 transition-colors"
      >
        ⏸️
      </button>
    </div>
  );
}
