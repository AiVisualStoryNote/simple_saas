"use client";

interface StatusBarProps {
  score: number;
  bestScore: number;
  onNewGame: () => void;
}

export function StatusBar({ score, bestScore, onNewGame }: StatusBarProps) {
  return (
    <div className="flex justify-between items-center p-4 max-w-md mx-auto">
      <div className="flex gap-4">
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <div className="text-xs text-gray-500">步数</div>
          <div className="text-2xl font-bold text-blue-600">{score}</div>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <div className="text-xs text-gray-500">最佳</div>
          <div className="text-xl font-bold text-gray-600">{bestScore}</div>
        </div>
      </div>
      <button
        onClick={onNewGame}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
      >
        🔄 新游戏
      </button>
    </div>
  );
}
