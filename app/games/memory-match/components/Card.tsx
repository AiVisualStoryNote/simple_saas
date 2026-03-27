"use client";

interface CardProps {
  content: string;
  flipped: boolean;
  matched: boolean;
  onClick: () => void;
}

export function Card({ content, flipped, matched, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      disabled={flipped || matched}
      className={`aspect-square flex items-center justify-center text-3xl rounded-xl transition-all duration-300 cursor-pointer ${
        flipped || matched
          ? matched 
            ? "bg-green-100 dark:bg-green-800 border-green-400" 
            : "bg-white dark:bg-gray-700 border-blue-400"
          : "bg-purple-300 dark:bg-purple-800 hover:bg-purple-400 hover:dark:bg-purple-700 border-purple-400"
      } border-2 ${
        matched ? "opacity-70" : ""
      }`}
    >
      {flipped || matched ? content : ""}
    </button>
  );
}
