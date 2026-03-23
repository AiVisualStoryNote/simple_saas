"use client";

import { useSearchParams } from "next/navigation";
import { getAllGames } from "@/lib/games";
import { GameCard } from "@/components/games/game-card";
import { Gamepad2 } from "lucide-react";

export default function GamesPageClient() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const games = getAllGames();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Gamepad2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            {isZh ? "游戏中心" : "Game Center"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {isZh
              ? "发现并玩转我们的互动游戏集合"
              : "Discover and play our collection of interactive games"}
          </p>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              {isZh ? "暂无可用游戏，敬请期待！" : "No games available yet. Stay tuned!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {games.map((game) => (
              <GameCard key={game.id} game={game} isZh={isZh} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
