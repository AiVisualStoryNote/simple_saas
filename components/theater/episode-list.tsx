"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DramaEpisodeWithPrice } from "@/lib/drama";

interface EpisodeListProps {
  episodes: DramaEpisodeWithPrice[];
  selectedEpisodeId: number | null;
  onEpisodeSelect: (episode: DramaEpisodeWithPrice) => void;
  onPurchaseClick: (episode: DramaEpisodeWithPrice) => void;
}

export function EpisodeList({
  episodes,
  selectedEpisodeId,
  onEpisodeSelect,
  onPurchaseClick,
}: EpisodeListProps) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 px-4">Episodes</h3>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 px-4 pb-4">
          {episodes.map(episode => {
            const isSelected = selectedEpisodeId === episode.id;
            const isFree = episode.price === 0;
            const isPurchased = episode.is_purchased;
            const hasAccess = isFree || isPurchased;

            return (
              <div
                key={episode.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                )}
                onClick={() => onEpisodeSelect(episode)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      EP {episode.episode_number}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {episode.name}
                    </span>
                  </div>
                  {hasAccess ? (
                    isPurchased ? (
                      <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                        <Check className="h-3 w-3" />
                        Got
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                        <Play className="h-3 w-3" />
                        Free
                      </span>
                    )
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-yellow-500 font-medium">
                      <Coins className="h-3 w-3" />
                      {episode.price}
                    </span>
                  )}
                </div>
                {!hasAccess && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPurchaseClick(episode);
                    }}
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Purchase
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}