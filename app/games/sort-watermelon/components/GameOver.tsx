interface GameOverProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOver({ score, bestScore, isNewBest, onRestart, onMenu }: GameOverProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-2xl max-w-[280px] w-full">
        <h2 className="text-3xl font-bold mb-2 text-red-500">游戏结束</h2>
        {isNewBest && (
          <div className="text-yellow-500 font-bold text-lg mb-3">🎉 新纪录！</div>
        )}
        <div className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
          <p className="text-lg">本局得分: <span className="font-bold text-xl">{score}</span></p>
          <p className="text-gray-500">最高得分: <span className="font-bold">{bestScore}</span></p>
        </div>
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-full hover:from-green-600 hover:to-emerald-600 transition-transform active:scale-95"
          >
            🔄 再来一局
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors active:scale-95"
          >
            🏠 返回游戏中心
          </button>
        </div>
      </div>
    </div>
  );
}
