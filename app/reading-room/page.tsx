"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookCard } from "@/components/reading-room/book-card";
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

const PAGE_SIZE = 12;

export default function ReadingRoom() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [categoryId, setCategoryId] = useState<string>("");

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
    if (status && status !== "all") {
      params.set("status", status);
    }
    if (categoryId) {
      params.set("category_id", categoryId);
    }

    try {
      const res = await fetch(`/api/novels?${params.toString()}`);
      const data: NovelsResponse = await res.json();

      console.log(data);

      if (data.error) {
        setError(data.error);
      } else {
        setNovels(data.novels || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取书籍列表失败");
    } finally {
      setLoading(false);
    }
  }, [page, keyword, status, categoryId]);

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

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">阅览室</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索书名..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="writing">写作中</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
            <SelectItem value="hiatus">休载中</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="分类ID"
          type="number"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-[120px]"
        />

        <Button onClick={handleSearch}>搜索</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">
          <p>加载失败: {error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchNovels}>
            重试
          </Button>
        </div>
      ) : novels.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>暂无书籍</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {novels.map((novel) => (
              <BookCard key={novel.id} novel={novel} />
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
                第 {page} / {totalPages} 页 (共 {total} 本)
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
