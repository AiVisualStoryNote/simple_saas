"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Coins, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PurchaseConfirmDialogProps {
  open: boolean;
  bookName: string;
  bookCredits: number;
  userCredits: number;
  isCN: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function PurchaseConfirmDialog({
  open,
  bookName,
  bookCredits,
  userCredits,
  isCN,
  onClose,
  onConfirm,
}: PurchaseConfirmDialogProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPurchase = bookCredits === 0 || userCredits >= bookCredits;

  useEffect(() => {
    if (!open) {
      setIsProcessing(false);
      setError(null);
    }
  }, [open]);

  const handlePurchase = async () => {
    if (!canPurchase) return;

    setIsProcessing(true);
    setError(null);

    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTopUp = () => {
    onClose();
    router.push('/#pricing');
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
        <div
          className="bg-background rounded-lg shadow-xl pointer-events-auto max-w-md w-full mx-4 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">
            {isCN ? '确认购买' : 'Confirm Purchase'}
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {isCN ? '书本' : 'Book'}
              </span>
              <span className="font-medium truncate max-w-[200px]">{bookName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {isCN ? '价格' : 'Price'}
              </span>
              <div className="flex items-center gap-1">
                {bookCredits > 0 ? (
                  <>
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{bookCredits}</span>
                  </>
                ) : (
                  <span className="font-semibold text-green-500">
                    {isCN ? '免费' : 'Free'}
                  </span>
                )}
              </div>
            </div>

            {bookCredits > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {isCN ? '当前积分' : 'Your Credits'}
                </span>
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{userCredits}</span>
                </div>
              </div>
            )}

            {bookCredits > 0 && !canPurchase && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {isCN 
                    ? `积分不足，需要 ${bookCredits} 积分，您仅有 ${userCredits} 积分`
                    : `Insufficient credits. Need ${bookCredits}, you have only ${userCredits}`
                  }
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isProcessing}
            >
              {isCN ? '取消' : 'Cancel'}
            </Button>

            {!canPurchase ? (
              <Button
                className="flex-1"
                onClick={handleTopUp}
              >
                {isCN ? '充值' : 'Top Up'}
              </Button>
            ) : (
              <Button
                className="flex-1"
                onClick={handlePurchase}
                disabled={isProcessing}
              >
                {isProcessing 
                  ? (isCN ? '处理中...' : 'Processing...')
                  : (isCN ? '购买' : 'Purchase')
                }
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
