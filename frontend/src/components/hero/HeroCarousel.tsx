import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import type { ContentItem } from "@/types/api";
import { LiveBadge } from "@/components/common/LiveBadge";
import { ViewerBadge } from "@/components/common/ViewerBadge";
import { cn } from "@/lib/utils";

/**
 * Rotating ambient sports/event b-roll, muted + looped behind the hero.
 * All Pixabay / Pexels CC0 clips.
 */
const AMBIENT_VIDEOS = [
  "https://cdn.pixabay.com/video/2020/09/08/49375-457699571_large.mp4", // football stadium
  "https://cdn.pixabay.com/video/2020/06/25/42826-435839347_large.mp4", // basketball
  "https://cdn.pixabay.com/video/2019/08/15/26025-355173243_large.mp4", // crowd cheer
];
const AMBIENT_POSTER =
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1800&q=80";

export function HeroCarousel({ items }: { items: ContentItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Autoplay rotation
  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  // Best-effort video play (some browsers block autoplay until interaction)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      /* swallow autoplay rejections */
    });
  }, []);

  if (items.length === 0) {
    return <div className="aspect-[16/7] rounded-3xl bg-surface animate-pulse" />;
  }

  const item = items[index];
  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured streams"
    >
      <div className="relative aspect-[16/8] sm:aspect-[16/7] lg:aspect-[16/6]">
        {/* Ambient muted background video */}
        <video
          ref={videoRef}
          src={AMBIENT_VIDEOS[index % AMBIENT_VIDEOS.length]}
          key={AMBIENT_VIDEOS[index % AMBIENT_VIDEOS.length]}
          poster={AMBIENT_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />

        {/* Foreground featured image (crossfades on rotation) */}
        <AnimatePresence mode="wait">
          <motion.img
            key={item.id}
            src={item.thumbnailUrl}
            alt={item.title}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.95, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity"
          />
        </AnimatePresence>

        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero-overlay)" }}
        />

        {/* Top-left badges */}
        <div className="absolute left-5 top-5 flex items-center gap-2">
          <LiveBadge size="md" />
          <ViewerBadge count={item.viewerCount} />
        </div>

        {/* Bottom content */}
        <motion.div
          key={`${item.id}-text`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white max-w-2xl drop-shadow">
            {item.title}
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-white/70 max-w-xl">
            {item.subtitle ?? item.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5">
              <img
                src={item.host.avatarUrl}
                alt={item.host.name}
                className="h-6 w-6 rounded-full bg-muted"
              />
              <span className="text-sm font-medium text-white">
                {item.host.name}
              </span>
            </div>
            <Link
              to="/watch/$streamId"
              params={{ streamId: item.id }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-soft hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Join Stream
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all flex items-center justify-center"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
