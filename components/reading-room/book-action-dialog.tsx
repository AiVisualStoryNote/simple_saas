"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Headphones, BookOpen, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Novel {
  id: number;
  name: string;
  category_id: number;
}

interface BookActionDialogProps {
  novel: Novel | null;
  open: boolean;
  onClose: () => void;
}

export function BookActionDialog({ novel, open, onClose }: BookActionDialogProps) {
  const router = useRouter();

  const handlePodcast = () => {
    router.push(`/podcast?novelId=${novel?.id}`);
    onClose();
  };

  const handleRead = () => {
    router.push(`/read?novelId=${novel?.id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && novel && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="bg-background rounded-lg p-6 shadow-xl pointer-events-auto max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">{novel.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 gap-2"
                  onClick={handlePodcast}
                >
                  <Headphones className="h-4 w-4" />
                  Listen
                </Button>
                <Button
                  className="flex-1 h-12 gap-2"
                  onClick={handleRead}
                >
                  <BookOpen className="h-4 w-4" />
                  Read
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
