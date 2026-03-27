interface GameOverProps {
  score: number;
  bricksLeft: number;
  highScore: number;
  isNewRecord: boolean;
  onRestart: () => void;
  onMenu: () => void;
  isZh: boolean;
  isWin: boolean;
}

export function GameOver({ 
  score, bricksLeft, highScore, isNewRecord, 
  onRestart, onMenu, isZh, isWin 
}: GameOverProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
      <div className="bg-slate-800 rounded-2xl p-6 text-center shadow-2xl max-w-[280px] w-full text-white">
        <h2 className="text-3xl font-bold mb-2 text-green-500">
          {isWin ? (isZh ? "🎉 恭喜通关！" : "🎉 You Win!") : (isZh ? "游戏结束" : "Game Over")}
        </h2>
        {isNewRecord && (
          <div className="text-yellow-400 font-bold text-lg mb-3">🏆 新纪录！</div>
        )}
        <div className="space-y-2 mb-6 text-gray-300">
          <p className="text-lg">
            {isZh ? "得分：" : "Score: "}
            <span className="font-bold text-xl">{score}</span>
          </p>
          {!isWin && (
            <p>
              {isZh ? "剩余砖块：" : "Bricks Left: "}
              <span className="font-bold">{bricksLeft}</span>
            </p>
          )}
          <p className="text-sm text-gray-400">
            {isZh ? "最高分：" : "High Score: "} {highScore}
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-4 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-transform active:scale-95"
          >
            🔄 {isZh ? "再来一局" : "Play Again"}
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-slate-700 text-white font-bold py-3 px-4 rounded-full hover:bg-slate-600 transition-colors active:scale-95"
          >
            🏠 {isZh ? "返回游戏中心" : "Back to Games"}
          </button>
        </div>
      </div>
    </div>
  );
}
