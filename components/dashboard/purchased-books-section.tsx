"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Loader2, Users, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { request } from "@/lib/request";
import { CharacterDesignDialog } from "@/components/reading-room/character-design-dialog";
import { CategoryFilter } from "@/components/reading-room/category-filter";

interface Category {
  id: number;
  name: string;
  category: string;
  is_default: boolean;
  is_pub: boolean;
}

interface PurchasedBook {
  id: number;
  name: string;
  category_id: number;
  status: string;
  rating: number;
  word_count: number;
  credits: number;
  created_at: string;
  updated_at: string | null;
  overall_outline: string;
  overall_introduction: string;
  file_id_list: number[];
  files: Array<{
    id: number;
    file_type: string;
    file_url: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    prompt: string | null;
    voice_type_id: string | null;
    created_at: string;
  }>;
}

export function PurchasedBooksSection({ mkt }: { mkt: string }) {
  const [books, setBooks] = useState<PurchasedBook[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [keyword, setKeyword] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  
  const [skip, setSkip] = useState(0);
  const skipRef = useRef(0);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  const [selectedBook, setSelectedBook] = useState<PurchasedBook | null>(null);
  const [showCharacterDialog, setShowCharacterDialog] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await request("/api/categories", { mkt });
        if (!res.error && res.data?.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, [mkt]);

  const fetchBooks = useCallback(async (isLoadMore = false) => {
    if (loadingCategories) return;
    if (isLoadMore && (!hasMore || isLoadingMore)) return;
    
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
      skipRef.current = 0;
    }
    
    try {
      const currentSkip = isLoadMore ? skipRef.current : 0;
      const categoryIds = selectedCategoryIds.length > 0 
        ? selectedCategoryIds.join(",") 
        : "";
      
      const params = {
        keyword: keyword || "",
        category_id: categoryIds,
        skip: String(currentSkip),
        limit: String(limit),
      };
      
      const paramsStr = new URLSearchParams(params).toString();
      const res = await request(`/api/user-novels?${paramsStr}`, { mkt });
      
      if (res.error) {
        setError(res.error);
      } else {
        const newBooks = res.data?.novels || [];
        if (isLoadMore) {
          setBooks(prev => [...prev, ...newBooks]);
          skipRef.current += newBooks.length;
        } else {
          setBooks(newBooks);
          skipRef.current = newBooks.length;
        }
        setSkip(skipRef.current);
        setHasMore(newBooks.length === limit);
      }
    } catch (err) {
      setError("Failed to load purchased books");
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setLoading(false);
        setIsFirstLoad(false);
      }
    }
  }, [mkt, loadingCategories, keyword, selectedCategoryIds, hasMore, isLoadingMore]);

  useEffect(() => {
    fetchBooks();
  }, [keyword, selectedCategoryIds, loadingCategories]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !loading && !isFirstLoad) {
          fetchBooks(true);
        }
      },
      { rootMargin: "200px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isLoadingMore, loading, fetchBooks]);

  const handleBookClick = (book: PurchasedBook) => {
    setSelectedBook(book);
    setShowCharacterDialog(true);
  };

  const handleCloseCharacterDialog = () => {
    setShowCharacterDialog(false);
    setSelectedBook(null);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "";
  };

  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={mkt === 'cn' ? "搜索书名..." : "Search by title..."}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10"
          />
        </div>

        <CategoryFilter
          categories={categories}
          selectedIds={selectedCategoryIds}
          onChange={(ids) => setSelectedCategoryIds(ids)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-muted-foreground">
          {error}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>{mkt === 'cn' ? "暂无书籍" : "No books found"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => {
            const coverFile = book.files?.find(f => f.file_type === 'image');
            return (
            <Card 
              key={book.id} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="relative aspect-[3/4] bg-muted overflow-hidden"
              onClick={() => handleBookClick(book)}>
                {coverFile?.file_url ? (
                  <Image
                    src={coverFile.file_url}
                    alt={book.name || "Book cover"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Users className="h-4 w-4" />
                      Characters
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm truncate mb-1" title={book.name}>
                  {book?.name}
                </h3>
                {getCategoryName(book.category_id) && (
                  <p className="text-xs text-muted-foreground truncate mb-2">
                    {getCategoryName(book.category_id)}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link href={`/read?novelId=${book.id}&mkt=${mkt}`}>
                      <BookOpen className="h-4 w-4 mr-1" />
                      {mkt === 'cn' ? '阅读' : 'Read'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}

      <div ref={loadMoreRef} className="h-4">
        {isLoadingMore && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              {mkt === 'cn' ? '加载中...' : 'Loading more...'}
            </span>
          </div>
        )}
        {!loading && !hasMore && books.length > 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            {mkt === 'cn' ? '没有更多了' : 'No more books'}
          </div>
        )}
      </div>

      {selectedBook && (
        <CharacterDesignDialog
          novelId={String(selectedBook.id)}
          novelName={selectedBook.name}
          mkt={mkt}
          open={showCharacterDialog}
          onClose={handleCloseCharacterDialog}
        />
      )}
    </>
  );
}
