import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, Radio, ArrowLeft, Link as LinkIcon } from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { useCategories } from "@/hooks/useCategories";
import { useCreateContent } from "@/hooks/useContent";
import type { Category } from "@/types/api";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Go Live — LiveVenue" },
      {
        name: "description",
        content:
          "Start your own live broadcast by pasting an HLS (.m3u8) stream URL.",
      },
    ],
  }),
  component: CreatePage,
});

// Public HLS test stream — handy for trying the form without a real source.
const SAMPLE_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

const PRESET_THUMBS = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
];

function CreatePage() {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const createContent = useCreateContent();
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [hostName, setHostName] = useState("");
  const [description, setDescription] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(PRESET_THUMBS[0]);
  const [tagsRaw, setTagsRaw] = useState("");
  const [error, setError] = useState<string | null>(null);

  const valid =
    title.trim().length >= 3 &&
    hostName.trim().length >= 2 &&
    /^https?:\/\/.+\.m3u8(\?.*)?$/i.test(streamUrl.trim()) &&
    !!categoryId;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setError(null);
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 5);

    try {
      const stream = await createContent.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        categoryId,
        thumbnailUrl,
        streamUrl: streamUrl.trim(),
        hostName: hostName.trim(),
        tags,
      });
      navigate({ to: "/watch/$streamId", params: { streamId: stream.id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create stream");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav searchValue={search} onSearchChange={setSearch} />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-8 max-w-3xl mx-auto w-full">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-md p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-glow">
              <Radio className="h-5 w-5 text-white" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Go Live</h1>
              <p className="text-sm text-muted-foreground">
                Paste an HLS playlist URL (.m3u8) — we'll play it in-browser.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Stream title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Late Night Showdown — Game 7"
                className="lv-input"
                maxLength={100}
              />
            </Field>

            <Field label="Your name (host)">
              <input
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Jane Doe"
                className="lv-input"
                maxLength={50}
              />
            </Field>

            <Field
              label="HLS stream URL (.m3u8)"
              hint={
                <button
                  type="button"
                  onClick={() => setStreamUrl(SAMPLE_STREAM)}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-glow"
                >
                  <LinkIcon className="h-3 w-3" /> Use a sample test stream
                </button>
              }
            >
              <input
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                placeholder="https://example.com/live/playlist.m3u8"
                className="lv-input font-mono text-xs"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="lv-input"
                >
                  <option value="">Select a category</option>
                  {categories.map((c: Category) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tags (comma separated)">
                <input
                  value={tagsRaw}
                  onChange={(e) => setTagsRaw(e.target.value)}
                  placeholder="esports, finals"
                  className="lv-input"
                />
              </Field>
            </div>

            <Field label="Description (optional)">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={300}
                className="lv-input resize-none"
                placeholder="What's this stream about?"
              />
            </Field>

            <Field label="Thumbnail">
              <div className="space-y-3">
                {/* Upload from device */}
                <label className="flex items-center justify-between gap-3 rounded-xl border-2 border-dashed border-border bg-surface-elevated/40 px-4 py-3 cursor-pointer hover:border-primary/60 hover:bg-surface-elevated transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">Upload your own photo</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary shrink-0">Browse</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (f.size > 5 * 1024 * 1024) {
                        setError("Image must be under 5MB");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string") setThumbnailUrl(reader.result);
                      };
                      reader.readAsDataURL(f);
                    }}
                  />
                </label>

                <p className="text-xs text-muted-foreground">Or pick a preset</p>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_THUMBS.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setThumbnailUrl(t)}
                      className={`relative aspect-video overflow-hidden rounded-lg border-2 transition-all ${thumbnailUrl === t ? "border-primary shadow-glow" : "border-transparent opacity-70 hover:opacity-100"}`}
                    >
                      <img src={t} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Preview */}
                {thumbnailUrl && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
                    <img src={thumbnailUrl} alt="Selected thumbnail preview" className="h-full w-full object-cover" />
                    <span className="absolute left-2 top-2 rounded-full bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">Preview</span>
                  </div>
                )}
              </div>
            </Field>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!valid || createContent.isPending}
              className="w-full h-12 rounded-full bg-gradient-to-r from-primary to-primary-glow font-semibold text-primary-foreground shadow-glow disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {createContent.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Radio className="h-4 w-4" /> Start broadcasting
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Inline input styling (scoped via class name) */}
      <style>{`
        .lv-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-border);
          background: var(--color-input);
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          outline: none;
          transition: all 0.15s;
        }
        .lv-input:focus {
          box-shadow: 0 0 0 2px var(--color-ring);
          border-color: transparent;
        }
        .lv-input::placeholder {
          color: oklch(0.66 0.018 270 / 0.6);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground/90">{label}</span>
        {hint}
      </div>
      {children}
    </label>
  );
}
