interface GameHUDProps {
  score: number;
  lines: number;
  level: number;
  highScore: number;
  onPause: () => void;
}

export function GameHUD({ score, lines, level, highScore, onPause }: GameHUDProps) {
  return (
    <div className="flex justify-between items-center mb-3 bg-slate-800 rounded-lg p-3 text-white">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-gray-400">分数</div>
          <div className="font-bold text-xl">{score}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">行数</div>
          <div className="font-bold text-xl">{lines}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">等级</div>
          <div className="font-bold text-xl">{level}</div>
        </div>
      </div>
      <button
        onClick={onPause}
        className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm font-medium"
      >
        ⏸️ 暂停
      </button>
    </div>
  );
}
