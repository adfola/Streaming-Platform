import { motion } from "framer-motion";
import type { ContentItem } from "@/types/api";
import { LiveBadge } from "@/components/common/LiveBadge";
import { ViewerBadge } from "@/components/common/ViewerBadge";

/**
 * LiveCard — single live stream tile used across home, browse, and related sidebar.
 * Accepts a ContentItem from the backend.
 */
export function LiveCard({ stream }: { stream: ContentItem }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-glow hover:border-primary/30 transition-all"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={stream.thumbnailUrl}
          alt={stream.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-card-overlay)" }}
        />
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          {stream.isLive && <LiveBadge />}
          <ViewerBadge count={stream.viewerCount} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <h4 className="line-clamp-1 text-sm font-semibold text-foreground">
          {stream.title}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {stream.tags.map((t: string) => (
            <span
              key={t}
              className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-1">
          <img
            src={stream.host.avatarUrl}
            alt=""
            className="h-6 w-6 rounded-full bg-muted"
          />
          <span className="text-xs font-medium text-muted-foreground">
            {stream.host.name}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function LiveCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[16/10] bg-muted animate-pulse" />
      <div className="space-y-2 p-3.5">
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
        <div className="h-6 w-24 rounded bg-muted animate-pulse mt-1" />
      </div>
    </div>
  );
}
