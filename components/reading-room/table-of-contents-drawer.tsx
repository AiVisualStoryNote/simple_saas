"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookPage } from "@/types/book";
import { Button } from "@/components/ui/button";
import { List, X } from "lucide-react";

interface TableOfContentsDrawerProps {
  pages: BookPage[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (pageNumber: number) => void;
}

interface TocItem {
  pageNumber: number;
  title: string;
  type: string;
}

export function TableOfContentsDrawer({ pages, isOpen, onClose, onNavigate }: TableOfContentsDrawerProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const items: TocItem[] = [];

    pages.forEach((page) => {
      switch (page.type) {
        case "cover":
        case "introduction":
          break;

        case "chapter-title":
          items.push({
            pageNumber: page.pageNumber,
            title: `Chapter ${page.chapterIndex}: ${page.textContent || ""}`,
            type: "chapter",
          });
          break;

        case "ending-choice":
          items.push({
            pageNumber: page.pageNumber,
            title: "Ending Choice",
            type: "ending-choice",
          });
          break;

        case "ending-chapter":
          items.push({
            pageNumber: page.pageNumber,
            title: `${page.textContent}`,
            type: "ending",
          });
          break;
      }
    });

    setTocItems(items);
  }, [pages]);

  const handleItemClick = (pageNumber: number) => {
    onNavigate(pageNumber);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-background shadow-xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Table of Contents</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {tocItems.map((item, index) => (
                  <Button
                    key={`${item.type}-${index}`}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-3 px-4 whitespace-normal"
                    onClick={() => handleItemClick(item.pageNumber)}
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
