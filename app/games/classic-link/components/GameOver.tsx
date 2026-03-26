"use client";

interface GameOverProps {
  won: boolean;
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOver({ won, score, bestScore, isNewBest, onRestart, onMenu }: GameOverProps) {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-80 text-center">
        <h2 className="text-3xl font-bold mb-2">
          {won ? "🎉 恭喜过关！" : "💥 游戏结束"}
        </h2>
        {isNewBest && (
          <div className="text-yellow-500 font-bold text-lg mb-4 animate-bounce">
            🏆 新纪录！🏆
          </div>
        )}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">步数：</span>
            <span className="font-bold text-xl">{score}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">最佳：</span>
            <span className="font-bold text-xl">{bestScore}</span>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            🔄 再来一局
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            🏠 返回菜单
          </button>
        </div>
      </div>
    </div>
  );
}
