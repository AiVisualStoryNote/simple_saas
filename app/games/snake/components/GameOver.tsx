"use client";

interface GameOverProps {
  score: number;
  highScore: number;
  isNewRecord: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOver({ score, highScore, isNewRecord, onRestart, onMenu }: GameOverProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="bg-gray-800/95 p-8 rounded-2xl shadow-2xl w-80 text-white">
        <h2 className="text-3xl font-bold text-center mb-2">游戏结束</h2>
        {isNewRecord && (
          <div className="text-center text-yellow-400 font-bold text-lg mb-4 animate-bounce">
            🏆 新纪录！🏆
          </div>
        )}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-300">本次分数</span>
            <span className="text-2xl font-bold text-green-400">{score}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">最高分数</span>
            <span className="text-2xl font-bold text-yellow-400">{highScore}</span>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            🔄 再玩一次
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            🏠 返回菜单
          </button>
        </div>
      </div>
    </div>
  );
}
