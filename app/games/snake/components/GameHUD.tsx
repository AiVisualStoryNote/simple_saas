"use client";

interface GameHUDProps {
  score: number;
  highScore: number;
  onPause: () => void;
}

export function GameHUD({ score, highScore, onPause }: GameHUDProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-6">
        <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
          <span className="text-sm text-gray-300">分数</span>
          <div className="text-2xl font-bold text-green-400">{score}</div>
        </div>
        <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
          <span className="text-sm text-gray-300">最高分</span>
          <div className="text-xl font-bold text-yellow-400">{highScore}</div>
        </div>
      </div>
      <button
        onClick={onPause}
        className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-gray-700 transition-colors"
      >
        ⏸️ 暂停
      </button>
    </div>
  );
}
