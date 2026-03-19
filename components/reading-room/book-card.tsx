import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Coins } from "lucide-react";

interface NovelFile {
  id: number;
  file_type: string;
  file_url: string;
  file_name: string;
}

interface Novel {
  id: number;
  name: string;
  category_id: number;
  status: string;
  rating: number;
  word_count: number;
  credits: number;
  created_at: string;
  updated_at: string;
  files: NovelFile[];
}

interface BookCardProps {
  novel: Novel;
  categoryName?: string;
  onClick?: () => void;
}

export function BookCard({ novel, categoryName, onClick }: BookCardProps) {
  const coverImage = novel.files?.find((f) => f.file_type === "image")?.file_url;
  const credits = novel.credits ?? 0;
  const isFree = credits === 0;

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" 
      onClick={onClick}
    >
      <div className="aspect-[3/4] relative bg-muted overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={novel.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Cover
          </div>
        )}
        {categoryName && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-md text-xs font-medium text-foreground shadow-sm">
            {categoryName}
          </div>
        )}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-md text-xs font-medium shadow-sm flex items-center gap-1">
          {isFree ? (
            <span className="text-green-500 font-semibold">Free</span>
          ) : (
            <>
              <Coins className="h-3 w-3 text-yellow-500" />
              <span className="text-foreground">{credits}</span>
            </>
          )}
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold truncate text-sm">{novel.name}</h3>
      </CardContent>
    </Card>
  );
}
