"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Plus, Pin, Bookmark } from "lucide-react";
import { UserBookmark, getBookmarks, deleteBookmark, updateBookmarkAnchor } from "@/lib/bookmark";
import { toast } from "@/hooks/use-toast";

interface BookmarkDrawerProps {
  novelId: string;
  novelName?: string;
  currentPage: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (pageNumber: number) => void;
  onRefreshBookmarks: () => void;
  onAddBookmark: () => void;
}

const getBookmarkTypeColor = (type: number, isCN: boolean) => {
  switch (type) {
    case 0:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        border: "border-gray-300 dark:border-gray-600",
        text: "text-gray-600 dark:text-gray-300",
        label: isCN ? "默认" : "Default",
      };
    case 1:
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        border: "border-blue-300 dark:border-blue-700",
        text: "text-blue-600 dark:text-blue-300",
        label: isCN ? "书签1" : "Bookmark 1",
      };
    case 2:
      return {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        border: "border-purple-300 dark:border-purple-700",
        text: "text-purple-600 dark:text-purple-300",
        label: isCN ? "书签2" : "Bookmark 2",
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        border: "border-gray-300 dark:border-gray-600",
        text: "text-gray-600 dark:text-gray-300",
        label: isCN ? "自定义" : "Custom",
      };
  }
};

export function BookmarkDrawer({
  novelId,
  currentPage,
  isOpen,
  onClose,
  onNavigate,
  onRefreshBookmarks,
  onAddBookmark,
}: BookmarkDrawerProps) {
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const isCN = true;

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const data = await getBookmarks(Number(novelId));
      setBookmarks(data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBookmarks();
    }
  }, [isOpen, novelId]);

  const handleBookmarkClick = (pageNumber: number) => {
    onNavigate(pageNumber);
    onClose();
  };

  const handleDeleteBookmark = async (bookmarkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const result = await deleteBookmark(bookmarkId);
    if (result.success) {
      toast({
        title: isCN ? "删除成功" : "Deleted",
        description: isCN ? "书签已删除" : "Bookmark deleted",
      });
      fetchBookmarks();
      onRefreshBookmarks();
    } else {
      toast({
        title: isCN ? "删除失败" : "Delete Failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleSetAnchor = async (bookmark: UserBookmark, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const result = await updateBookmarkAnchor(bookmark.id, !bookmark.is_anchor, Number(novelId));
    if (result.success) {
      toast({
        title: isCN ? "设置成功" : "Updated",
        description: bookmark.is_anchor 
          ? (isCN ? "已取消锚点" : "Anchor removed")
          : (isCN ? "已设为锚点" : "Anchor set"),
      });
      fetchBookmarks();
      onRefreshBookmarks();
    } else {
      toast({
        title: isCN ? "设置失败" : "Update Failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const canAddBookmark = bookmarks.length < 3;

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
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-background shadow-xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                {isCN ? "书签" : "Bookmarks"}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bookmark className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{isCN ? "暂无书签" : "No bookmarks"}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarks.map((bookmark) => {
                    const style = getBookmarkTypeColor(bookmark.bookmark_type, isCN);
                    return (
                      <motion.div
                        key={bookmark.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
                          relative p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${style.bg} ${style.border} hover:shadow-md
                        `}
                        onClick={() => handleBookmarkClick(bookmark.page_number)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                                {style.label}
                              </span>
                              {bookmark.is_anchor && (
                                <Pin className="h-3 w-3 text-red-500 fill-red-500" />
                              )}
                            </div>
                            <h3 className="font-medium truncate">{bookmark.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {isCN ? "第" : "Page "}{bookmark.page_number}{isCN ? "页" : ""}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleSetAnchor(bookmark, e)}
                              title={bookmark.is_anchor ? (isCN ? "取消锚点" : "Remove anchor") : (isCN ? "设为锚点" : "Set as anchor")}
                            >
                              <Pin className={`h-4 w-4 ${bookmark.is_anchor ? "text-red-500 fill-red-500" : "text-muted-foreground"}`} />
                            </Button>
                            {bookmark.bookmark_type !== 0 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={(e) => handleDeleteBookmark(bookmark.id, e)}
                                title={isCN ? "删除" : "Delete"}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {canAddBookmark && (
              <div className="p-4 border-t shrink-0">
                <Button
                  className="w-full"
                  onClick={() => {
                    onClose();
                    onAddBookmark();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isCN ? "新增书签" : "Add Bookmark"}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
