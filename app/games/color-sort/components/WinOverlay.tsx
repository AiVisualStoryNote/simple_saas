"use client";

interface WinOverlayProps {
  moves: number;
  onRestart: () => void;
  onMenu: () => void;
}

export function WinOverlay({ moves, onRestart, onMenu }: WinOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-80 text-center">
        <h2 className="text-3xl font-bold text-center mb-4 text-green-600">
          🎉 恭喜完成！
        </h2>
        <div className="mb-6">
          <p className="text-gray-600">
            总共用了 <span className="font-bold text-xl text-blue-600">{moves}</span> 步
          </p>
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
