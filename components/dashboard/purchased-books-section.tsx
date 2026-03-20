"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { request } from "@/lib/request";
import { CharacterDesignDialog } from "@/components/reading-room/character-design-dialog";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<PurchasedBook | null>(null);
  const [showCharacterDialog, setShowCharacterDialog] = useState(false);

  useEffect(() => {
    async function fetchPurchasedBooks() {
      try {
        const res = await request("/api/user-novels", { mkt });
        
        if (res.error) {
          setError(res.error);
        } else {
          setBooks(res.data?.novels || []);
        }
      } catch (err) {
        setError("Failed to load purchased books");
      } finally {
        setLoading(false);
      }
    }

    fetchPurchasedBooks();
  }, [mkt]);

  const handleBookClick = (book: PurchasedBook) => {
    setSelectedBook(book);
    setShowCharacterDialog(true);
  };

  const handleCloseCharacterDialog = () => {
    setShowCharacterDialog(false);
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        {error}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>You haven't purchased any books yet.</p>
      </div>
    );
  }

  return (
    <>
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
              <h3 className="font-medium text-sm truncate mb-2">
                {book?.name}
              </h3>
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
