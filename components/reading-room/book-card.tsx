import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

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
  created_at: string;
  updated_at: string;
  files: NovelFile[];
}

interface BookCardProps {
  novel: Novel;
  categoryName?: string;
}

export function BookCard({ novel, categoryName }: BookCardProps) {
  const coverImage = novel.files?.find((f) => f.file_type === "image")?.file_url;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
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
            暂无封面
          </div>
        )}
        {categoryName && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-md text-xs font-medium text-foreground shadow-sm">
            {categoryName}
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold truncate text-sm">{novel.name}</h3>
      </CardContent>
    </Card>
  );
}
