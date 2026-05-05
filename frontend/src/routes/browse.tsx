import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { LiveCard, LiveCardSkeleton } from "@/components/cards/LiveCard";
import { useLiveNow } from "@/hooks/useContent";
import type { ContentItem } from "@/types/api";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse Live Streams — LiveVenue" },
      { name: "description", content: "Browse all live streams across every category." },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const { data: streams = [], isLoading } = useLiveNow();
  const { data: categories = [] } = useCategories();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return streams.filter((s: ContentItem) => {
      if (activeCategory && s.categorySlug !== activeCategory) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.host.name.toLowerCase().includes(q) ||
        s.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    });
  }, [streams, search, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav searchValue={search} onSearchChange={setSearch} />
      <div className="flex flex-1">
        <Sidebar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Browse</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every stream live right now.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Pill active={!activeCategory} onClick={() => setActiveCategory(null)}>
              All
            </Pill>
            {categories.map((c) => (
              <Pill
                key={c.slug}
                active={activeCategory === c.slug}
                onClick={() => setActiveCategory(c.slug)}
              >
                {c.name}
              </Pill>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <LiveCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No streams found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((s: ContentItem) => (
                <Link
                  key={s.id}
                  to="/watch/$streamId"
                  params={{ streamId: s.id }}
                  className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <LiveCard stream={s} />
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-primary/60 bg-primary/15 text-foreground shadow-glow"
          : "border-border bg-surface text-foreground/80 hover:bg-surface-elevated",
      )}
    >
      {children}
    </button>
  );
}
