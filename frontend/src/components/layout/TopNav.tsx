import { Link } from "@tanstack/react-router";
import { Search, Menu, Tv2, LogOut, User as UserIcon, Radio } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function TopNav({
  searchValue,
  onSearchChange,
  onOpenMenu,
}: {
  searchValue: string;
  onSearchChange: (v: string) => void;
  onOpenMenu?: () => void;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const displayName = user?.displayName || user?.username || "Account";
  const initial = (displayName[0] || "U").toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6">
        <button
          onClick={onOpenMenu}
          className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface hover:bg-surface-elevated"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="LiveVenue home">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-glow">
            <Tv2 className="h-4 w-4 text-white" />
          </span>
          <span className="hidden sm:block text-base font-semibold tracking-tight">
            Live<span className="text-primary">Venue</span>
          </span>
        </Link>

        <div className="flex-1 max-w-xl mx-auto min-w-0">
          <label className="relative block">
            <span className="sr-only">Search streams</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search streams…"
              className="w-full rounded-full border border-border bg-surface pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </label>
        </div>

        {isAuthenticated && user ? (
          <div ref={ref} className="relative shrink-0">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-border bg-surface pl-1 pr-3 py-1 hover:bg-surface-elevated transition-colors"
              aria-label="Open profile menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-sm font-bold text-white">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  initial
                )}
              </span>
              <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                {displayName}
              </span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-base font-bold text-white">
                      {initial}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-primary">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-1.5">
                  <Link
                    to="/create"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface-elevated"
                  >
                    <Radio className="h-4 w-4 text-primary" />
                    Go Live
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              asChild
              variant="ghost"
              className="hidden sm:inline-flex h-10 rounded-full px-4 text-foreground hover:bg-surface-elevated"
            >
              <Link to="/login">
                <UserIcon className="h-4 w-4 mr-1.5" />
                Log in
              </Link>
            </Button>
            <Button
              asChild
              className="h-10 rounded-full bg-gradient-to-r from-primary to-primary-glow px-4 sm:px-5 font-semibold text-primary-foreground shadow-glow hover:opacity-95"
            >
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
