"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsDialog({ open, onOpenChange }: TermsDialogProps) {
  const [activeTab, setActiveTab] = useState("en");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0 overflow-hidden">
        <div className="p-4 border-b shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="zh">中文</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="h-[60vh] min-h-[400px]">
          {activeTab === "en" ? (
            <iframe
              src="/terms-en.html"
              className="w-full h-full border-0"
              title="Terms of Service (English)"
            />
          ) : (
            <iframe
              src="/terms-zh.html"
              className="w-full h-full border-0"
              title="服务条款 (中文)"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
