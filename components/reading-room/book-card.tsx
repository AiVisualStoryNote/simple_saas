import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
}

export function BookCard({ novel }: BookCardProps) {
  const coverImage = novel.files?.find((f) => f.file_type === "image")?.file_url;

  const statusMap: Record<string, string> = {
    writing: "写作中",
    completed: "已完成",
    hiatus: "休载中",
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      writing: { label: "写作中", variant: "default" },
      completed: { label: "已完成", variant: "secondary" },
      hiatus: { label: "休载中", variant: "outline" },
    };
    return statusMap[status] || { label: status, variant: "outline" };
  };

  const formatWordCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万字`;
    }
    return `${count}字`;
  };

  const statusInfo = getStatusBadge(novel.status);

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
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate mb-2">{novel.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          {novel.rating > 0 && (
            <span className="text-sm text-yellow-500">★ {novel.rating.toFixed(1)}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {formatWordCount(novel.word_count)}
        </p>
      </CardContent>
    </Card>
  );
}
