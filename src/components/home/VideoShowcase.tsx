import { motion } from "framer-motion";
import { Play } from "lucide-react";

const SPOTLIGHTS = [
  {
    title: "Stadium energy",
    tag: "Sports",
    video: "https://cdn.pixabay.com/video/2020/09/08/49375-457699571_large.mp4",
    poster: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Court courtside",
    tag: "Basketball",
    video: "https://cdn.pixabay.com/video/2020/06/25/42826-435839347_large.mp4",
    poster: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Studio sessions",
    tag: "Music",
    video: "https://cdn.pixabay.com/video/2020/03/20/33572-400877146_large.mp4",
    poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "City after dark",
    tag: "Lifestyle",
    video: "https://cdn.pixabay.com/video/2019/08/15/26025-355173243_large.mp4",
    poster: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=900&q=80",
  },
];

export function VideoShowcase() {
  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">In motion right now</h2>
          <p className="text-sm text-muted-foreground">A taste of what's streaming on LiveVenue.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SPOTLIGHTS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl border border-border shadow-card"
          >
            <video
              src={s.video}
              poster={s.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <span className="self-start rounded-full bg-black/50 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                {s.tag}
              </span>
              <div className="flex items-end justify-between gap-2">
                <p className="text-sm font-bold text-white drop-shadow leading-tight">{s.title}</p>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/95 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-4 w-4 fill-black" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
