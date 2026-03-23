import { Suspense } from "react";
import GamesClient from "./games-client";
import { Loader2 } from "lucide-react";

export default function GamesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <GamesClient />
    </Suspense>
  );
}
