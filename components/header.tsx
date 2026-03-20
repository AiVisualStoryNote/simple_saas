"use client";

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { DynamicVideoSwitch } from "./dynamic-video-switch";
import { Undo2 } from "lucide-react";

interface HeaderProps {
  user: any;
}

interface NavItem {
  label: string;
  href: string;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isReadPage = pathname?.match(/^\/read($|\?)/) !== null;

  // Main navigation items for generic SaaS
  const mainNavItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  // Dashboard items - empty array as we don't want navigation items in dashboard
  const dashboardItems: NavItem[] = [];

  // Choose which navigation items to show
  // const navItems = isDashboard ? dashboardItems : mainNavItems;
  const navItems = mainNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Logo />
        </div>
        
        {/* Centered Navigation */}
        {/* <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav> */}

        <div className="flex items-center gap-2">
          {isReadPage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-1"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          )}
          {isReadPage && <DynamicVideoSwitch />}
          <ThemeSwitcher />
          {/* {user ? (
            <div className="hidden md:flex items-center gap-2">
              {isDashboard && (
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {user.email}
                </span>
              )}
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )} */}
          <MobileNav items={navItems} user={user} isDashboard={isDashboard} />
        </div>
      </div>
    </header>
  );
}
