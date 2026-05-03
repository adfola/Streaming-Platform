import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Radio,
  Compass,
  Plus,
  Trophy,
  Shirt,
  Gamepad2,
  Mic,
  UtensilsCrossed,
  Music2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLiveNow } from "@/hooks/useContent";
import { formatViewers } from "@/lib/format";

const mainNav = [
  { label: "Home", icon: Home, to: "/" as const },
  { label: "Browse", icon: Compass, to: "/browse" as const },
  { label: "Go Live", icon: Plus, to: "/create" as const },
] as const;

const categoryIconMap = {
  sports: Trophy,
  fashion: Shirt,
  gaming: Gamepad2,
  podcasts: Mic,
  food: UtensilsCrossed,
  music: Music2,
} as const;

const categoryColors: Record<string, string> = {
  sports: "from-sky-500 to-blue-600",
  fashion: "from-emerald-400 to-teal-600",
  gaming: "from-violet-500 to-fuchsia-600",
  podcasts: "from-fuchsia-500 to-pink-600",
  food: "from-amber-400 to-orange-600",
  music: "from-rose-500 to-red-600",
};

const categories = [
  { slug: "sports", name: "Sports" },
  { slug: "fashion", name: "Fashion" },
  { slug: "gaming", name: "Gaming" },
  { slug: "podcasts", name: "Podcasts" },
  { slug: "food", name: "Food" },
  { slug: "music", name: "Music" },
];

export function Sidebar({
  activeCategory,
  onSelectCategory,
}: {
  activeCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}) {
  const [seeAll, setSeeAll] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: streams = [] } = useLiveNow();
  const liveChannels = streams.slice(0, 5);

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-1 border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl px-3 py-5 overflow-y-auto scrollbar-thin">
      <nav className="flex flex-col gap-0.5">
        {mainNav.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-foreground shadow-soft"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary" : "text-sidebar-foreground/60",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <h4 className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Categories
        </h4>
        <div className="flex flex-col gap-0.5">
          {categories.map((c) => {
            const Icon = categoryIconMap[c.slug as keyof typeof categoryIconMap];
            const isActive = activeCategory === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => onSelectCategory(isActive ? null : c.slug)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all text-left",
                  isActive
                    ? "bg-sidebar-accent text-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br shadow-soft",
                    categoryColors[c.slug],
                  )}
                >
                  <Icon className="h-3.5 w-3.5 text-white" />
                </span>
                {c.name}
              </button>
            );
          })}
          <button
            onClick={() => setSeeAll((s) => !s)}
            className="mt-1 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary hover:text-primary-glow"
          >
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                !seeAll && "-rotate-90",
              )}
            />
            Live channels
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {seeAll && liveChannels.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="flex flex-col gap-0.5">
              {liveChannels.map((ch) => (
                <Link
                  key={ch.id}
                  to="/watch/$streamId"
                  params={{ streamId: ch.id }}
                  className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-all hover:bg-sidebar-accent/60"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={ch.host.avatarUrl}
                      alt=""
                      className="h-7 w-7 rounded-full bg-muted"
                      loading="lazy"
                    />
                    <div className="min-w-0 text-left">
                      <p className="truncate text-sm font-medium text-foreground">
                        {ch.host.name}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {ch.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-primary">
                    <Radio className="h-3 w-3" />
                    {formatViewers(ch.viewerCount)}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
