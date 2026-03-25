"use client";

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export function PauseMenu({ onResume, onRestart, onMenu }: PauseMenuProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="bg-gray-800/95 p-8 rounded-2xl shadow-2xl w-80 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">⏸️ 暂停</h2>
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            ▶️ 继续游戏
          </button>
          <button
            onClick={onRestart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            🔄 重新开始
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
