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
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-80">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">游戏结束</h2>
        {isNewRecord && (
          <div className="text-center text-yellow-600 font-bold text-lg mb-4 animate-bounce">
            🏆 新纪录！🏆
          </div>
        )}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">本次分数</span>
            <span className="text-2xl font-bold text-blue-600">{score}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">最高分数</span>
            <span className="text-2xl font-bold text-yellow-600">{highScore}</span>
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
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            🏠 返回菜单
          </button>
        </div>
      </div>
    </div>
  );
}
