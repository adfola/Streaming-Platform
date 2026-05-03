import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { HeroCarousel } from "@/components/hero/HeroCarousel";
import { CategoryChips } from "@/components/categories/CategoryChips";
import { CategoryShowcase } from "@/components/categories/CategoryShowcase";
import { StatsStrip } from "@/components/home/StatsStrip";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { LiveCard, LiveCardSkeleton } from "@/components/cards/LiveCard";
import { useFeaturedContent, useLiveNow } from "@/hooks/useContent";
import { useCategories } from "@/hooks/useCategories";
import { DEMO_CONTENT, DEMO_FEATURED } from "@/lib/demoContent";
import type { ContentItem } from "@/types/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LiveVenue — Premium Live Streaming Dashboard" },
      {
        name: "description",
        content:
          "Watch live sports, gaming, fashion, podcasts, food and music — all in one premium streaming dashboard.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { data: featuredApi = [], isLoading: featuredLoading } = useFeaturedContent();
  const { data: categories = [], isLoading: catLoading } = useCategories();
  const { data: streamsApi = [], isLoading: streamsLoading } = useLiveNow();

  // Always show rich content — fall back to curated demo data when the
  // backend has nothing yet so the landing page is never visually empty.
  const featured = featuredApi.length > 0 ? featuredApi : DEMO_FEATURED;
  const streams = streamsApi.length > 0 ? streamsApi : DEMO_CONTENT;

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return streams.filter((s: ContentItem) => {
      if (activeCategory && s.categorySlug !== activeCategory) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.host.name.toLowerCase().includes(q) ||
        s.tags.some((t: string) => t.toLowerCase().includes(q)) ||
        s.categorySlug.includes(q)
      );
    });
  }, [streams, search, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav
        searchValue={search}
        onSearchChange={setSearch}
        onOpenMenu={() => setMobileOpen(true)}
      />

      <div className="flex flex-1">
        <Sidebar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                className="lg:hidden fixed left-0 top-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border"
              >
                <div className="block lg:hidden w-full h-full">
                  <Sidebar
                    activeCategory={activeCategory}
                    onSelectCategory={(v) => {
                      setActiveCategory(v);
                      setMobileOpen(false);
                    }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-6 space-y-8">
          {featuredLoading ? (
            <div className="aspect-[16/7] rounded-3xl bg-surface animate-pulse" />
          ) : (
            <HeroCarousel items={featured} />
          )}

          {catLoading ? (
            <div className="h-28 rounded-3xl bg-surface animate-pulse" />
          ) : (
            <>
              <StatsStrip
                liveCount={streams.length}
                viewers={streams.reduce((s, x) => s + x.viewerCount, 0)}
              />
              <VideoShowcase />
              <CategoryShowcase
                categories={categories}
                active={activeCategory}
                onSelect={setActiveCategory}
              />
              <CategoryChips
                categories={categories}
                active={activeCategory}
                onSelect={setActiveCategory}
              />
            </>
          )}

          <section>
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Live Now
                {activeCategory && (
                  <span className="ml-2 text-sm font-medium text-muted-foreground capitalize">
                    · {activeCategory}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="text-sm font-medium text-primary hover:text-primary-glow"
                  >
                    Clear filter
                  </button>
                )}
                <Link
                  to="/create"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
                >
                  <Plus className="h-4 w-4" /> Go Live
                </Link>
              </div>
            </div>

            {streamsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <LiveCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState onClear={() => { setSearch(""); setActiveCategory(null); }} />
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((s: ContentItem) => (
                    <motion.div
                      key={s.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to="/watch/$streamId"
                        params={{ streamId: s.id }}
                        className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl"
                      >
                        <LiveCard stream={s} />
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            <div className="mt-6 flex justify-center">
              <Link
                to="/browse"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-5 py-2 text-sm font-medium text-foreground/85 hover:bg-surface-elevated transition-colors"
              >
                Browse all <ChevronDown className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>

          <footer className="py-10 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} LiveVenue · Premium live streaming
          </footer>
        </main>
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/40 p-12 text-center">
      <p className="text-base font-semibold">No streams match your filters</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Try a different search term or clear the active category.
      </p>
      <button
        onClick={onClear}
        className="mt-4 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow transition-colors"
      >
        Reset filters
      </button>
    </div>
  );
}
