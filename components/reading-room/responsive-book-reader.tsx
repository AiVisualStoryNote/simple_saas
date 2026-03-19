"use client";

import { useState, useEffect } from "react";
import { BookPage, Novel } from "@/types/book";
import { DesktopBookReader } from "./desktop-book-reader";
import { MobileBookReader } from "./mobile-book-reader";

interface ResponsiveBookReaderProps {
  pages: BookPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
  isAutoReading?: boolean;
  onStartAutoReading?: () => void;
  onStopAutoReading?: () => void;
  onAutoReadingComplete?: () => void;
  mkt?: string | null;
  novelId?: string;
  novel?: Novel | null;
}

const BREAKPOINT = 768;

export function ResponsiveBookReader({ pages, currentPage, onPageChange, isAutoReading, onStartAutoReading, onStopAutoReading, onAutoReadingComplete, mkt, novelId, novel }: ResponsiveBookReaderProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < BREAKPOINT);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <MobileBookReader
        pages={pages}
        currentPage={currentPage}
        onPageChange={onPageChange}
        isAutoReading={isAutoReading}
        onStartAutoReading={onStartAutoReading}
        onStopAutoReading={onStopAutoReading}
        onAutoReadingComplete={onAutoReadingComplete}
        mkt={mkt}
        novelId={novelId}
        novel={novel}
      />
    );
  }

  return (
    <DesktopBookReader
      pages={pages}
      currentPage={currentPage}
      onPageChange={onPageChange}
      isAutoReading={isAutoReading}
      onStartAutoReading={onStartAutoReading}
      onStopAutoReading={onStopAutoReading}
      onAutoReadingComplete={onAutoReadingComplete}
      mkt={mkt}
      novelId={novelId}
      novel={novel}
    />
  );
}
