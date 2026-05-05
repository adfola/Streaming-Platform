import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import type { ChatMessage } from "@/types/api";

const SAMPLE_USERS = [
  { name: "stream_fan_42", color: "text-sky-400" },
  { name: "MidnightOwl", color: "text-fuchsia-400" },
  { name: "GoalKeeper99", color: "text-emerald-400" },
  { name: "ProGamerX", color: "text-violet-400" },
  { name: "SoundWave", color: "text-amber-400" },
  { name: "Curator", color: "text-rose-400" },
];

const SAMPLE_MSGS = [
  "LET'S GOOO 🔥",
  "What a play!",
  "First time here, this is awesome",
  "GG everyone",
  "PogChamp",
  "Anyone else watching from EU?",
  "Stream quality is 🔥",
  "Refresh if you have lag",
  "Subbed!",
  "🎉🎉🎉",
  "incredible moment",
  "Wait for it...",
  "lol",
  "Best stream of the week",
];

const avatarFor = (n: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(n)}`;

export function LiveChat({ streamId }: { streamId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset chat per stream
  useEffect(() => {
    setMessages([]);
  }, [streamId]);

  // Simulated chat stream
  useEffect(() => {
    const interval = setInterval(() => {
      const user = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)];
      const msg = SAMPLE_MSGS[Math.floor(Math.random() * SAMPLE_MSGS.length)];
      setMessages((m) =>
        [
          ...m,
          {
            id: `m-${Date.now()}-${Math.random()}`,
            user: user.name,
            color: user.color,
            avatarUrl: avatarFor(user.name),
            message: msg,
            timestamp: Date.now(),
          },
        ].slice(-100),
      );
    }, 1800 + Math.random() * 1200);

    return () => clearInterval(interval);
  }, [streamId]);

  // Autoscroll
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      {
        id: `me-${Date.now()}`,
        user: "you",
        color: "text-primary",
        avatarUrl: avatarFor("you"),
        message: text,
        timestamp: Date.now(),
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Live chat</h3>
        <span className="text-[11px] text-muted-foreground">
          {messages.length} messages
        </span>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-thin flex-1 space-y-2 overflow-y-auto px-3 py-3"
      >
        {messages.length === 0 && (
          <p className="px-2 py-8 text-center text-xs text-muted-foreground">
            Chat is starting…
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="flex items-start gap-2 text-sm">
            <img
              src={m.avatarUrl}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full bg-muted"
            />
            <div className="min-w-0 flex-1">
              <span className={`mr-1.5 font-semibold ${m.color}`}>
                {m.user}
              </span>
              <span className="break-words text-foreground/90">
                {m.message}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Send a message"
            maxLength={200}
            className="flex-1 rounded-full border border-border bg-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            aria-label="Send"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-opacity hover:opacity-90 disabled:opacity-40 disabled:shadow-none"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
