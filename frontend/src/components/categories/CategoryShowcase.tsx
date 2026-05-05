import { motion } from "framer-motion";
import { Trophy, Shirt, Gamepad2, Mic, UtensilsCrossed, Music2, type LucideIcon } from "lucide-react";
import type { Category } from "@/types/api";
import { cn } from "@/lib/utils";

const meta: Record<string, { img: string; icon: LucideIcon; gradient: string; tagline: string }> = {
  sports: {
    img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80",
    icon: Trophy,
    gradient: "from-sky-500/80 to-blue-700/90",
    tagline: "Live matches & highlights",
  },
  fashion: {
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
    icon: Shirt,
    gradient: "from-emerald-400/80 to-teal-700/90",
    tagline: "Runway shows & lookbooks",
  },
  gaming: {
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
    icon: Gamepad2,
    gradient: "from-violet-500/80 to-fuchsia-700/90",
    tagline: "Esports & playthroughs",
  },
  podcasts: {
    img: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=900&q=80",
    icon: Mic,
    gradient: "from-fuchsia-500/80 to-pink-700/90",
    tagline: "Conversations that matter",
  },
  food: {
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    icon: UtensilsCrossed,
    gradient: "from-amber-400/80 to-orange-700/90",
    tagline: "Live cookalongs & tastings",
  },
  music: {
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80",
    icon: Music2,
    gradient: "from-rose-500/80 to-red-700/90",
    tagline: "Concerts & DJ sets",
  },
};

export function CategoryShowcase({
  categories,
  active,
  onSelect,
}: {
  categories: Category[];
  active: string | null;
  onSelect: (slug: string | null) => void;
}) {
  if (!categories.length) return null;
  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Explore by vibe</h2>
          <p className="text-sm text-muted-foreground">Tap a tile to filter the live feed below.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((c, i) => {
          const m = meta[c.slug] ?? meta.sports;
          const Icon = m.icon;
          const isActive = active === c.slug;
          return (
            <motion.button
              key={c.id}
              onClick={() => onSelect(isActive ? null : c.slug)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              whileHover={{ y: -4 }}
              className={cn(
                "group relative aspect-[4/5] overflow-hidden rounded-2xl border text-left shadow-card transition-all",
                isActive ? "border-primary shadow-glow" : "border-border hover:border-primary/40",
              )}
            >
              <img
                src={m.img}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={cn("absolute inset-0 bg-gradient-to-t opacity-90", m.gradient)} />
              <div className="absolute inset-0 flex flex-col justify-between p-3">
                <span className="self-start flex h-8 w-8 items-center justify-center rounded-lg bg-black/30 backdrop-blur-md">
                  <Icon className="h-4 w-4 text-white" />
                </span>
                <div>
                  <p className="text-sm font-bold text-white drop-shadow">{c.name}</p>
                  <p className="text-[11px] text-white/80 line-clamp-1">{m.tagline}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
