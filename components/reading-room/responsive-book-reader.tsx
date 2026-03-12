"use client";

import { useState, useEffect } from "react";
import { BookPage } from "@/types/book";
import { DesktopBookReader } from "./desktop-book-reader";
import { MobileBookReader } from "./mobile-book-reader";

interface ResponsiveBookReaderProps {
  pages: BookPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

const BREAKPOINT = 768;

export function ResponsiveBookReader({ pages, currentPage, onPageChange }: ResponsiveBookReaderProps) {
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
