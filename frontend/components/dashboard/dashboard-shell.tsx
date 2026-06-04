"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  RiChat3Line,
  RiCodeSSlashLine,
  RiImageLine,
  RiVideoLine,
  RiSparklingLine,
  RiLogoutBoxRLine,
  RiUser3Line,
  RiMoonClearLine,
} from "react-icons/ri";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../ui/mode-toggle";

const nav = [
  {
    href: "/chat",
    label: "Chat",
    icon: RiChat3Line,
  },
  {
    href: "/code",
    label: "Code",
    icon: RiCodeSSlashLine,
  },
  {
    href: "/image",
    label: "Image",
    icon: RiImageLine,
  },
  {
    href: "/video",
    label: "Video",
    icon: RiVideoLine,
  },
];

type DashboardShellProps = {
  userEmail: string;
  children: ReactNode;
};

export function DashboardShell({ userEmail, children }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[270px] shrink-0 border-r border-border/60 bg-card/40 backdrop-blur-xl lg:flex lg:flex-col">
          {/* Logo */}
          <div className="border-b border-border/60 px-6 py-5">
            <Link href="/dashboard" className="group flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
                <RiSparklingLine className="h-5 w-5" />
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  AIverse
                </span>
                <span className="text-xs text-muted-foreground">
                  AI Workspace
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6">
            <div className="mb-4 px-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Workspace
              </p>
            </div>

            <nav className="space-y-1">
              {nav.map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                        active
                          ? "bg-white/15"
                          : "bg-muted text-muted-foreground group-hover:bg-background",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/60 p-4">
            {/* Theme */}
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
              <div>
                <p className="text-xs font-medium text-foreground">
                  Appearance
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Customize theme
                </p>
              </div>

              <ModeToggle />
            </div>

            {/* User */}
            <div className="mb-4 rounded-2xl border border-border/60 bg-background/80 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted">
                  <RiUser3Line className="h-5 w-5 text-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Signed in as</p>

                  <p
                    className="truncate text-sm font-medium text-foreground"
                    title={userEmail}
                  >
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout */}
            <form action={() => {}}>
              <Button
                type="submit"
                variant="outline"
                className="h-11 w-full justify-start gap-2 rounded-2xl border-border/60 text-sm"
              >
                <RiLogoutBoxRLine className="h-4 w-4" />
                Log out
              </Button>
            </form>
          </div>
        </aside>

        {/* Mobile Topbar */}
        <div className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <RiSparklingLine className="h-5 w-5" />
              </div>

              <span className="text-base font-semibold tracking-tight">
                AIverse
              </span>
            </Link>

            <Button size="icon" variant="outline" className="rounded-xl">
              <RiMoonClearLine className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto px-4 pb-4">
            {nav.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border/60 bg-card text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="min-h-screen p-4 pt-28 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
