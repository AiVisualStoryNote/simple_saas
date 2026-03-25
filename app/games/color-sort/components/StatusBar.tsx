"use client";

interface StatusBarProps {
  moves: number;
  onUndo: () => void;
  onRestart: () => void;
  canUndo: boolean;
}

export function StatusBar({ moves, onUndo, onRestart, canUndo }: StatusBarProps) {
  return (
    <div className="flex justify-between items-center mb-4 max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow">
        <span className="text-gray-600">步数: </span>
        <span className="text-xl font-bold text-blue-600">{moves}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`px-4 py-2 rounded-lg font-bold ${
            canUndo
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          ↩️ 撤销
        </button>
        <button
          onClick={onRestart}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
        >
          🔄 重来
        </button>
      </div>
    </div>
  );
}
