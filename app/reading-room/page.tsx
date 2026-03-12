"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/reading-room/book-card";
import { CategoryFilter } from "@/components/reading-room/category-filter";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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

interface NovelsResponse {
  novels: Novel[];
  total: number;
  error?: string;
}

interface Category {
  id: number;
  name: string;
}

const PAGE_SIZE = 12;

export default function ReadingRoom() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (!data.error && data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchNovels = useCallback(async () => {
    setLoading(true);
    setError(null);

    const skip = (page - 1) * PAGE_SIZE;
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: PAGE_SIZE.toString(),
    });

    if (keyword) {
      params.set("keyword", keyword);
    }

    const categoryIds = selectedCategoryIds.length > 0
      ? selectedCategoryIds.join(",")
      : categories.map((c) => c.id).join(",");
    params.set("category_id", categoryIds);

    try {
      const res = await fetch(`/api/novels?${params.toString()}`);
      const data: NovelsResponse = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setNovels(data.novels || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  }, [page, keyword, selectedCategoryIds, categories]);

  useEffect(() => {
    fetchNovels();
  }, [fetchNovels]);

  const handleSearch = () => {
    setPage(1);
    fetchNovels();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "";
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Reading Room</h1>

      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>

          <Button onClick={handleSearch}>Search</Button>
        </div>

        <CategoryFilter
          selectedIds={selectedCategoryIds}
          onChange={(ids) => {
            setSelectedCategoryIds(ids);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">
          <p>Failed to load: {error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchNovels}>
            Retry
          </Button>
        </div>
      ) : novels.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No books found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {novels.map((novel) => (
              <BookCard 
                key={novel.id} 
                novel={novel} 
                categoryName={getCategoryName(novel.category_id)} 
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} books)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
