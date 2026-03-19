"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createBookmark, getBookmarks, UserBookmark } from "@/lib/bookmark";
import { toast } from "@/hooks/use-toast";

interface AddBookmarkDialogProps {
  novelId: string;
  novelName?: string;
  currentPage: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddBookmarkDialog({
  novelId,
  novelName = "",
  currentPage,
  open,
  onClose,
  onSuccess,
}: AddBookmarkDialogProps) {
  const [name, setName] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isAnchor, setIsAnchor] = useState(false);
  const [loading, setLoading] = useState(false);
  const isCN = true;

  useEffect(() => {
    if (open) {
      setName(`${novelName || 'Book'}_${currentPage}`);
      setPageNumber(currentPage);
      setIsAnchor(false);
    }
  }, [open, novelName, currentPage]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: isCN ? "请输入书签名称" : "Please enter bookmark name",
        variant: "destructive",
      });
      return;
    }

    if (pageNumber < 1) {
      toast({
        title: isCN ? "页码必须大于0" : "Page number must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await createBookmark(
        Number(novelId),
        name.trim(),
        pageNumber,
        isAnchor
      );

      if (result.success) {
        toast({
          title: isCN ? "创建成功" : "Created",
          description: isCN ? "书签已创建" : "Bookmark created",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: isCN ? "创建失败" : "Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: isCN ? "创建失败" : "Failed",
        description: isCN ? "请稍后重试" : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isCN ? "新增书签" : "Add Bookmark"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              {isCN ? "书签名称" : "Bookmark Name"}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isCN ? "输入书签名称" : "Enter bookmark name"}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="page">
              {isCN ? "页码" : "Page Number"}
            </Label>
            <Input
              id="page"
              type="number"
              min={1}
              value={pageNumber}
              onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="anchor">
              {isCN ? "设为锚点书签" : "Set as anchor bookmark"}
            </Label>
            <Checkbox
              id="anchor"
              checked={isAnchor}
              onCheckedChange={(checked) => setIsAnchor(checked === true)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {isCN ? "取消" : "Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (isCN ? "处理中..." : "Processing...") : (isCN ? "确定" : "Confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
