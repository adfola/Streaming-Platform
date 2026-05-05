import {
  Trophy,
  Shirt,
  Gamepad2,
  Mic,
  UtensilsCrossed,
  Music2,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types/api";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Trophy,
  Shirt,
  Gamepad2,
  Mic,
  UtensilsCrossed,
  Music2,
};

const slugIconMap: Record<string, LucideIcon> = {
  sports: Trophy,
  fashion: Shirt,
  gaming: Gamepad2,
  podcasts: Mic,
  food: UtensilsCrossed,
  music: Music2,
};

const colorMap: Record<string, string> = {
  sports: "from-sky-500 to-blue-600",
  fashion: "from-emerald-400 to-teal-600",
  gaming: "from-violet-500 to-fuchsia-600",
  podcasts: "from-fuchsia-500 to-pink-600",
  food: "from-amber-400 to-orange-600",
  music: "from-rose-500 to-red-600",
};

export function CategoryChips({
  categories,
  active,
  onSelect,
}: {
  categories: Category[];
  active: string | null;
  onSelect: (slug: string | null) => void;
}) {
  const activeCategory = categories.find((c) => c.slug === active);

  return (
    <div className="rounded-3xl border border-border bg-surface/60 backdrop-blur-md p-4 sm:p-6 shadow-card">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-semibold tracking-tight">
          Browse by category
        </h3>
        {active && (
          <button
            onClick={() => onSelect(null)}
            className="text-xs font-medium text-primary hover:text-primary-glow"
          >
            Clear
          </button>
        )}
      </div>

      {/* Mobile: native select for ergonomic touch */}
      <div className="sm:hidden">
        <div className="relative">
          <LayoutGrid className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={active ?? ""}
            onChange={(e) => onSelect(e.target.value || null)}
            className="w-full appearance-none rounded-2xl border border-border bg-surface-elevated/80 pl-10 pr-10 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            ▾
          </span>
        </div>
        {activeCategory && (
          <p className="mt-2 text-xs text-muted-foreground">
            Showing <span className="text-foreground font-medium">{activeCategory.name}</span>
          </p>
        )}
      </div>

      {/* Desktop / tablet: chip rail */}
      <div className="hidden sm:flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
            !active
              ? "border-primary/60 bg-primary/15 text-foreground shadow-glow"
              : "border-border bg-surface-elevated/70 text-foreground/85 hover:bg-surface-elevated",
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          All
        </button>
        {categories.map((c) => {
          const Icon =
            iconMap[c.icon ?? ""] ?? slugIconMap[c.slug] ?? Trophy;
          const isActive = active === c.slug;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(isActive ? null : c.slug)}
              className={cn(
                "shrink-0 inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "border-primary/60 bg-primary/15 text-foreground shadow-glow"
                  : "border-border bg-surface-elevated/70 text-foreground/85 hover:bg-surface-elevated hover:border-border/80",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br shadow-soft",
                  colorMap[c.slug] ?? "from-slate-500 to-slate-700",
                )}
              >
                <Icon className="h-3.5 w-3.5 text-white" />
              </span>
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
