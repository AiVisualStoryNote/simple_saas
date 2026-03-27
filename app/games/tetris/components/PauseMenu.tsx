interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
  isZh: boolean;
}

export function PauseMenu({ onResume, onRestart, onMenu, isZh }: PauseMenuProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
      <div className="bg-slate-800 rounded-2xl p-6 text-center shadow-2xl max-w-[280px] w-full text-white">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">⏸️ {isZh ? "暂停" : "Paused"}</h2>
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-full hover:from-green-600 hover:to-emerald-600 transition-transform active:scale-95"
          >
            ▶️ {isZh ? "继续游戏" : "Resume"}
          </button>
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-4 rounded-full hover:from-yellow-600 hover:to-orange-600 transition-transform active:scale-95"
          >
            🔄 {isZh ? "重新开始" : "Restart"}
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-slate-700 text-white font-bold py-3 px-4 rounded-full hover:bg-slate-600 transition-colors active:scale-95"
          >
            🏠 {isZh ? "返回菜单" : "Main Menu"}
          </button>
        </div>
      </div>
    </div>
  );
}
