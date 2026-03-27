interface GameOverProps {
  score: number;
  lines: number;
  level: number;
  highScore: number;
  isNewRecord: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOver({ score, lines, level, highScore, isNewRecord, onRestart, onMenu }: GameOverProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
      <div className="bg-slate-800 rounded-2xl p-6 text-center shadow-2xl max-w-[280px] w-full text-white">
        <h2 className="text-3xl font-bold mb-2 text-red-500">游戏结束</h2>
        {isNewRecord && (
          <div className="text-yellow-400 font-bold text-lg mb-3">🎉 新纪录！</div>
        )}
        <div className="space-y-2 mb-6 text-gray-300">
          <p>分数: <span className="font-bold text-xl">{score}</span></p>
          <p>消除行数: <span className="font-bold">{lines}</span></p>
          <p>等级: <span className="font-bold">{level}</span></p>
          <p className="text-sm text-gray-400">最高分: {highScore}</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-transform active:scale-95"
          >
            🔄 再来一局
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-slate-700 text-white font-bold py-3 px-4 rounded-full hover:bg-slate-600 transition-colors active:scale-95"
          >
            🏠 返回游戏中心
          </button>
        </div>
      </div>
    </div>
  );
}
