"use client";

import { useState, useEffect } from "react";
import { BookPage } from "@/types/book";
import { DesktopBookReader } from "./desktop-book-reader";
import { MobileBookReader } from "./mobile-book-reader";
import { Skeleton } from "@/components/ui/skeleton";

interface ResponsiveBookReaderProps {
  pages: BookPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

const BREAKPOINT = 768;

function ReaderSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex min-h-0 p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl h-full flex gap-4">
            <Skeleton className="flex-1 h-[70vh] rounded-lg" />
            <Skeleton className="flex-1 h-[70vh] rounded-lg" />
          </div>
        </div>
      </div>
      <div className="border-t p-4">
        <Skeleton className="h-10 w-48 mx-auto mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function ResponsiveBookReader({ pages, currentPage, onPageChange }: ResponsiveBookReaderProps) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    
    setIsMobile(mql.matches);
    mql.addEventListener("change", handleChange);
    
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  if (isMobile === undefined) {
    return <ReaderSkeleton />;
  }

  if (isMobile) {
    return (
      <MobileBookReader
        pages={pages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    );
  }

  return (
    <DesktopBookReader
      pages={pages}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
  );
}
