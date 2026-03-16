"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/reading-room/book-card";
import { CategoryFilter } from "@/components/reading-room/category-filter";
import { BookActionDialog } from "@/components/reading-room/book-action-dialog";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { request } from "@/lib/request";

import { Novel as NovelType, NovelFile } from "@/types/book";

interface Category {
  id: number;
  name: string;
  category: string;
  is_default: boolean;
  is_pub: boolean;
}

interface NovelsResponse {
  novels: NovelType[];
  total: number;
  error?: string;
}

const PAGE_SIZE = 12;

export default function ReadingRoom() {
  const searchParams = new URLSearchParams(window.location.search);
  const mkt = searchParams.get('mkt')

  const [novels, setNovels] = useState<NovelType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const [selectedNovel, setSelectedNovel] = useState<NovelType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await request("/api/categories", {  mkt });
        // const data = await res.json();
        // if (!data.error && data.categories) {
        //   setCategories(data.categories);
        // }
        if (!res.error && res.data?.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchNovels = useCallback(async () => {
    if (categories.length === 0) {
      return;
    }

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
      const res = await request(`/api/novels?${params.toString()}`, { mkt });
      // const data: NovelsResponse = await res.json();

      // if (data.error) {
      //   setError(data.error);
      // } else {
      //   setNovels(data.novels || []);
      //   setTotal(data.total || 0);
      // }
      if(res.error) {
        setError(res.error);
      } else {
        setNovels(res.data?.novels || []);
        setTotal(res.data?.total || 0);
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

  const handleBookClick = (novel: NovelType) => {
    setSelectedNovel(novel);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTimeout(() => setSelectedNovel(null), 200);
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
          categories={categories}
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
                novel={novel as any} 
                categoryName={getCategoryName(novel.category_id)}
                onClick={() => handleBookClick(novel)}
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

      <BookActionDialog 
        mkt={mkt}
        novel={selectedNovel} 
        open={dialogOpen} 
        onClose={handleDialogClose}
      />
    </div>
  );
}
