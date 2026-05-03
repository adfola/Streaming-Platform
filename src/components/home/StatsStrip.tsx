import { motion } from "framer-motion";
import { Radio, Users, Sparkles, Globe2 } from "lucide-react";
import { formatViewers } from "@/lib/format";

export function StatsStrip({ liveCount, viewers }: { liveCount: number; viewers: number }) {
  const items = [
    { icon: Radio, label: "Live now", value: liveCount.toString(), color: "text-rose-400" },
    { icon: Users, label: "Watching", value: formatViewers(viewers), color: "text-sky-400" },
    { icon: Sparkles, label: "Categories", value: "6+", color: "text-amber-400" },
    { icon: Globe2, label: "Worldwide", value: "24/7", color: "text-emerald-400" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface/70 backdrop-blur-md p-3 shadow-card"
        >
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated ${it.color}`}>
            <it.icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-bold leading-none">{it.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{it.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
