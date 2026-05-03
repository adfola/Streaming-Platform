import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LiveBadge({
  className,
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full bg-live px-2 py-0.5 font-semibold uppercase tracking-wider text-live-foreground live-pulse",
        size === "sm" ? "text-[10px]" : "text-xs px-2.5 py-1",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
      Live
    </motion.span>
  );
}
