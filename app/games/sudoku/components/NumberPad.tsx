"use client";

interface NumberPadProps {
  onNumberClick: (num: number | null) => void;
  onClear: () => void;
  onHint: () => void;
  disabled: boolean;
  isZh: boolean;
}

export function NumberPad({ onNumberClick, onClear, onHint, disabled, isZh }: NumberPadProps) {
  return (
    <div className="mt-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg">
        <div className="grid grid-cols-9 gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => onNumberClick(num)}
              disabled={disabled}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={onClear}
            disabled={disabled}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isZh ? "清除" : "Clear"}
          </button>
          <button
            onClick={onHint}
            disabled={disabled}
            className="flex-1 bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-700 dark:text-yellow-300 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            💡 {isZh ? "提示" : "Hint"}
          </button>
        </div>
      </div>
    </div>
  );
}