"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/actions";

interface MobileNavProps {
  items: { label: string; href: string }[];
  user: any;
  isDashboard: boolean;
}

export function MobileNav({ items, user, isDashboard }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        {user ? (
          <div className="pb-4 border-b">
            <p className="text-lg font-semibold text-foreground">
              {user.email}
            </p>
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
          <SheetTitle className="mt-4">Navigation</SheetTitle>
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
