"use client";

import { motion } from "framer-motion";

interface LoadingProgressProps {
  progress: number;
  current: number;
  total: number;
}

export function LoadingProgress({ progress, current, total }: LoadingProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Loading book data...</h3>
        <p className="text-sm text-muted-foreground">
          Chapter {current} of {total}
        </p>
      </div>

      <div className="w-full max-w-md">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
