"use client";

type BoardType = (number | null)[][];
type Cell = { row: number; col: number } | null;

interface BoardProps {
  board: BoardType;
  original: boolean[][];
  selectedCell: Cell;
  onCellClick: (row: number, col: number) => void;
}

export function Board({ board, original, selectedCell, onCellClick }: BoardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg">
      <div className="grid grid-cols-9 gap-[2px]">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isOriginal = original[rowIndex][colIndex];
            const isHighlighted = selectedCell && selectedCell.row === rowIndex;
            const isColHighlighted = selectedCell && selectedCell.col === colIndex;
            const sameValue = selectedCell && board[selectedCell.row][selectedCell.col] === cell && cell !== null;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onCellClick(rowIndex, colIndex)}
                className={`
                  w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base font-medium rounded
                  transition-colors
                  ${isOriginal ? "font-bold" : ""}
                  ${isSelected ? "bg-blue-500 text-white" : ""}
                  ${!isSelected && isHighlighted ? "bg-blue-100 dark:bg-blue-900/30" : ""}
                  ${!isSelected && isColHighlighted ? "bg-blue-100 dark:bg-blue-900/30" : ""}
                  ${!isSelected && sameValue ? "bg-blue-200 dark:bg-blue-800/50" : ""}
                  ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? "border-b-2 border-gray-400" : ""}
                  ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? "border-r-2 border-gray-400" : ""}
                  hover:bg-gray-100 dark:hover:bg-gray-700
                `}
              >
                {cell || ""}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}