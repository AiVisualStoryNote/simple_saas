"use client";

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  onNewGame: () => void;
}

export function ScoreBoard({ score, bestScore, onNewGame }: ScoreBoardProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-4xl font-bold text-gray-700">2048</h1>
        <p className="text-gray-600">经典数字合成游戏</p>
      </div>
      <div className="flex gap-3">
        <div className="bg-[#bbada0] px-3 py-2 rounded-md text-white text-center min-w-[60px]">
          <div className="text-xs uppercase">分数</div>
          <div className="text-xl font-bold">{score}</div>
        </div>
        <div className="bg-[#bbada0] px-3 py-2 rounded-md text-white text-center min-w-[60px]">
          <div className="text-xs uppercase">最佳</div>
          <div className="text-xl font-bold">{bestScore}</div>
        </div>
      </div>
    </div>
  );
}
