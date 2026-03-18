"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, Pencil, Check, X, Coins } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";

interface MobileNavProps {
  items: { label: string; href: string }[];
  user: any;
  isDashboard: boolean;
}

export function MobileNav({ items, user, isDashboard }: MobileNavProps) {
  const [localUser, setLocalUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(localUser?.user_metadata?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchCredits = async () => {
      setLoadingCredits(true);
      try {
        const response = await fetch("/api/credits");
        const data = await response.json();
        if (response.ok && data.credits) {
          setCredits(data.credits.remaining_credits ?? data.credits.total_credits ?? 0);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setLoadingCredits(false);
      }
    };

    fetchCredits();
  }, [user]);

  const handleEditClick = () => {
    setEditValue(localUser?.user_metadata?.name || "");
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditValue(localUser?.user_metadata?.name || "");
  };

  const handleConfirmClick = async () => {
    if (!editValue.trim()) return;

    setIsUpdating(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { name: editValue.trim() },
    });
    setIsUpdating(false);

    if (!error) {
      setLocalUser({
        ...localUser,
        user_metadata: {
          ...localUser?.user_metadata,
          name: editValue.trim(),
        },
      });
      setIsEditing(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsEditing(false);
      setEditValue(localUser?.user_metadata?.name || "");
    }
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        {user ? (
          <div className="pt-2 pb-4 border-b">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-9"
                  placeholder="Enter your name"
                  disabled={isUpdating}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0"
                  onClick={handleConfirmClick}
                  disabled={isUpdating}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0"
                  onClick={handleCancelClick}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-foreground flex-1">
                    {localUser?.user_metadata?.name || localUser?.email}
                  </p>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0 scale-[0.9]"
                    onClick={handleEditClick}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="text-muted-foreground">Credits:</span>
                  <span className="font-semibold text-foreground">
                    {loadingCredits ? "..." : credits ?? 0}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="pb-4 border-b">
            <SheetClose asChild>
              <Link href="/sign-in" className="text-lg font-semibold text-foreground">
                Sign in to continue
              </Link>
            </SheetClose>
          </div>
        )}
        <SheetHeader>
          {/* <SheetTitle className="mt-4">Navigation</SheetTitle> */}
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t">
          {user ? (
            <form action={signOutAction} className="w-full">
              <Button type="submit" variant="outline" className="w-full">
                Sign out
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-2">
              <SheetClose asChild>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild variant="default" className="w-full">
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
