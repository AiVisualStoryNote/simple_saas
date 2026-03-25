"use client";

import { Play, Home, RefreshCw } from "lucide-react";

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export function PauseMenu({ onResume, onRestart, onMenu }: PauseMenuProps) {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 p-8 rounded-3xl text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6">
          Paused
        </h2>

        <div className="space-y-4">
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold transition-colors"
          >
            <Play className="h-5 w-5" />
            Resume
          </button>
          
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Restart
          </button>
          
          <button
            onClick={onMenu}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium transition-colors"
          >
            <Home className="h-5 w-5" />
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}
