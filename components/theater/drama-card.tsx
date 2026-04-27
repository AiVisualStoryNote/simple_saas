"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Loader2 } from "lucide-react";

interface DramaTag {
  id: number;
  name: string;
  color: string;
}

interface Drama {
  id: number;
  name: string;
  cover_image_key: string;
  resolution: string;
  orientation: string;
  description: string;
  tags?: DramaTag[];
}

interface DramaCardProps {
  drama: Drama;
  onClick?: () => void;
}

export function DramaCard({ drama, onClick }: DramaCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (!drama.cover_image_key) return;

    const fetchImageUrl = async () => {
      setLoadingImage(true);
      try {
        const response = await fetch('/api/file-store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ file_key: drama.cover_image_key }),
        });
        const data = await response.json();
        if (data.success && data.data?.file_url) {
          setImageUrl(data.data.file_url);
        }
      } catch (err) {
        console.error('Failed to fetch image URL:', err);
      } finally {
        setLoadingImage(false);
      }
    };

    fetchImageUrl();
  }, [drama.cover_image_key]);

  const isVertical = drama.orientation === '竖屏';

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className={`relative ${isVertical ? 'aspect-[3/4]' : 'aspect-video'} bg-muted overflow-hidden`}>
        {loadingImage ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={drama.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Cover
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {isVertical && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded-md text-xs font-medium text-white">
            竖屏
          </div>
        )}
        {drama.resolution && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded-md text-xs font-medium text-white">
            {drama.resolution}
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {drama.tags?.slice(0, 2).map(tag => (
            <div
              key={tag.id}
              className="px-2 py-0.5 rounded-md text-xs font-medium text-white"
              style={{ backgroundColor: tag.color || '#6366f1' }}
            >
              {tag.name}
            </div>
          ))}
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold truncate text-sm">{drama.name}</h3>
        {drama.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {drama.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}