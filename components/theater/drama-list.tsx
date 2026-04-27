"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DramaCard } from "./drama-card";
import { Pagination } from "@/components/reading-room/pagination";
import { Search, Loader2, Smartphone, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDramas, type Drama, type DramaTag } from "@/lib/drama";

interface DramaListProps {
  initialDramas?: Drama[];
  initialTotal?: number;
}

export function DramaList({ initialDramas = [], initialTotal = 0 }: DramaListProps) {
  const [dramas, setDramas] = useState<Drama[]>(initialDramas);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tags, setTags] = useState<DramaTag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [selectedOrientation, setSelectedOrientation] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/dramas/tags');
        const data = await response.json();
        if (data.tags) {
          setTags(data.tags);
        }
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchTags();
  }, []);

  const fetchDramas = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getDramas({
        page,
        keyword,
        orientation: selectedOrientation,
        tagIds: selectedTagIds,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setDramas(result.dramas);
        setTotal(result.total);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dramas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDramas();
  }, [page, selectedOrientation, selectedTagIds]);

  const handleSearch = () => {
    setPage(1);
    fetchDramas();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
    setPage(1);
  };

  const handleOrientationChange = (orientation: string) => {
    setSelectedOrientation(orientation);
    setPage(1);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Theater</h1>

      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by drama name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <Button
              variant={selectedOrientation === "" ? "default" : "outline"}
              size="sm"
              onClick={() => handleOrientationChange("")}
            >
              全部
            </Button>
            <Button
              variant={selectedOrientation === "竖屏" ? "default" : "outline"}
              size="sm"
              onClick={() => handleOrientationChange("竖屏")}
              className="gap-1"
            >
              <Smartphone className="h-3 w-3" />
              竖屏
            </Button>
            <Button
              variant={selectedOrientation === "横屏" ? "default" : "outline"}
              size="sm"
              onClick={() => handleOrientationChange("横屏")}
              className="gap-1"
            >
              <Monitor className="h-3 w-3" />
              横屏
            </Button>
          </div>

          {!loadingTags && tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                    "border hover:shadow-md",
                    selectedTagIds.includes(tag.id)
                      ? "text-white border-transparent"
                      : "bg-background text-muted-foreground border-border hover:bg-accent"
                  )}
                  style={selectedTagIds.includes(tag.id) ? { backgroundColor: tag.color } : {}}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">
          <p>Failed to load: {error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchDramas}>
            Retry
          </Button>
        </div>
      ) : dramas.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No dramas found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {dramas.map(drama => (
              <DramaCard
                key={drama.id}
                drama={drama}
                onClick={() => window.location.href = `/theater/${drama.id}`}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}

          <div className="text-center text-sm text-muted-foreground mt-4">
            Page {page} of {totalPages} ({total} dramas)
          </div>
        </>
      )}
    </div>
  );
}