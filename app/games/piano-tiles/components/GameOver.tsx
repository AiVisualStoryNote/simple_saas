interface GameOverProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onRestart: () => void;
  onMenu: () => void;
  isZh: boolean;
}

export function GameOver({ score, bestScore, isNewBest, onRestart, onMenu, isZh }: GameOverProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
      <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-2xl max-w-[280px] w-full text-white">
        <h2 className="text-3xl font-bold mb-2 text-red-500">
          {isZh ? "游戏结束" : "Game Over"}
        </h2>
        {isNewBest && (
          <div className="text-yellow-400 font-bold text-lg mb-3">🎉 新纪录！</div>
        )}
        <div className="space-y-2 mb-6 text-gray-300">
          <p className="text-lg">
            {isZh ? "得分：" : "Score: "}
            <span className="font-bold text-xl">{score}</span>
          </p>
          <p className="text-sm text-gray-400">
            {isZh ? "最好成绩：" : "Best: "} {bestScore}
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-full hover:from-indigo-600 hover:to-purple-700 transition-transform active:scale-95"
          >
            🔄 {isZh ? "再来一局" : "Play Again"}
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-full hover:bg-gray-600 transition-colors active:scale-95"
          >
            🏠 {isZh ? "返回游戏中心" : "Back to Games"}
          </button>
        </div>
      </div>
    </div>
  );
}
