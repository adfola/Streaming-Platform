import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { HlsPlayer } from "@/components/player/HlsPlayer";
import { LiveChat } from "@/components/player/LiveChat";
import { LiveCard } from "@/components/cards/LiveCard";
import { ViewerBadge } from "@/components/common/ViewerBadge";
import { useContentItem, useContentByCategory } from "@/hooks/useContent";
import type { ContentItem } from "@/types/api";

export const Route = createFileRoute("/watch/$streamId")({
  head: () => ({
    meta: [
      { title: "Watching live — LiveVenue" },
      { name: "description", content: "Watch a live stream on LiveVenue." },
    ],
  }),
  component: WatchPage,
});

function WatchPage() {
  const { streamId } = Route.useParams();
  const [search, setSearch] = useState("");
  const { data: stream, isLoading } = useContentItem(streamId);
  const { data: relatedAll = [] } = useContentByCategory(stream?.categoryId ?? null);
  // Filter out current stream and cap at 6
  const related = relatedAll
    .filter((s: ContentItem) => s.id !== streamId)
    .slice(0, 6);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav searchValue={search} onSearchChange={setSearch} />
        <div className="flex-1 grid place-items-center text-muted-foreground">
          Loading stream…
        </div>
      </div>
    );
  }

  if (!stream) throw notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav searchValue={search} onSearchChange={setSearch} />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="min-w-0 space-y-5">
            <HlsPlayer src={stream.streamUrl} poster={stream.thumbnailUrl} />

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {stream.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <ViewerBadge count={stream.viewerCount} />
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground">
                      {stream.categorySlug}
                    </span>
                    {stream.tags.map((t: string) => (
                      <span
                        key={t}
                        className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-sm font-medium hover:bg-surface-elevated">
                    <Heart className="h-4 w-4" /> Follow
                  </button>
                  <button
                    onClick={() => {
                      if (typeof navigator !== "undefined" && navigator.share) {
                        navigator
                          .share({ title: stream.title, url: window.location.href })
                          .catch(() => {});
                      } else if (typeof navigator !== "undefined") {
                        navigator.clipboard?.writeText(window.location.href);
                      }
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface hover:bg-surface-elevated"
                    aria-label="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={stream.host.avatarUrl}
                  alt={stream.host.name}
                  className="h-12 w-12 rounded-full bg-muted"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{stream.host.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Live streaming · {stream.categorySlug}
                  </p>
                </div>
              </div>

              {stream.description && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {stream.description}
                </p>
              )}
            </div>

            {related.length > 0 && (
              <section>
                <h2 className="text-lg font-bold tracking-tight mb-3">
                  More in {stream.categorySlug}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {related.map((s: ContentItem) => (
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
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
            <LiveChat streamId={stream.id} />
          </aside>
        </div>
      </main>
    </div>
  );
}
