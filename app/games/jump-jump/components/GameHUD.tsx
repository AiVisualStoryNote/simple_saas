"use client";

interface GameHUDProps {
  score: number;
  highScore: number;
  onPause: () => void;
}

export function GameHUD({ score, highScore, onPause }: GameHUDProps) {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
        <div className="flex gap-4">
          <div>
            <span className="text-sm text-gray-600">分数</span>
            <div className="text-2xl font-bold text-blue-600">{score}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">最高分</span>
            <div className="text-2xl font-bold text-yellow-600">{highScore}</div>
          </div>
        </div>
      </div>
      <button
        onClick={onPause}
        className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md hover:bg-white transition-colors"
      >
        ⏸️ 暂停
      </button>
    </div>
  );
}
