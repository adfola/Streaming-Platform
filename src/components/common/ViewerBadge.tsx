import { Eye } from "lucide-react";
import { formatViewers } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ViewerBadge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-md",
        className,
      )}
    >
      <Eye className="h-3 w-3" />
      {formatViewers(count)} Viewers
    </span>
  );
}
