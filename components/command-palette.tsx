"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Hash, ListChecks, BookOpen, Wrench, Lightbulb, Trophy, Rocket,
  CornerDownLeft, ExternalLink,
} from "lucide-react";
import { searchIndex, type SearchItem, type SearchKind } from "@/lib/data/search-index";
import { cn } from "@/lib/utils";

const kindMeta: Record<SearchKind, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  page: { label: "Page", Icon: Hash },
  task: { label: "Task", Icon: ListChecks },
  course: { label: "Course", Icon: BookOpen },
  tool: { label: "Tool", Icon: Wrench },
  tip: { label: "Tip", Icon: Lightbulb },
  badge: { label: "Badge", Icon: Trophy },
  setup: { label: "Setup", Icon: Rocket },
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => searchIndex(query, 40), [query]);

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // small delay to ensure modal is mounted
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  // Reset active when query changes
  useEffect(() => {
    setActive(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const select = (item: SearchItem) => {
    onClose();
    if (item.href) router.push(item.href);
    else if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) select(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl bg-popover text-popover-foreground rounded-xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search row */}
        <div className="flex items-center gap-2 px-4 h-12 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="Jump to a task, course, tool, tip, page…"
            className="flex-1 h-full bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No results for "{query}".
          </div>
        ) : (
          <ul ref={listRef} className="max-h-[60vh] overflow-y-auto py-1">
            {results.map((item, idx) => {
              const meta = kindMeta[item.kind];
              const Icon = meta.Icon;
              const isActive = idx === active;
              return (
                <li
                  key={item.id}
                  data-idx={idx}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => select(item)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md mx-1 transition-colors",
                    isActive ? "bg-accent" : "hover:bg-accent/60"
                  )}
                >
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm truncate">{item.title}</p>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
                        {meta.label}
                      </span>
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                    )}
                  </div>
                  {item.url && !item.href && <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                  {isActive && <CornerDownLeft className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer hints */}
        <div className="border-t border-border bg-muted/30 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1 rounded border border-border bg-background font-mono">↑↓</kbd>
              navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1 rounded border border-border bg-background font-mono">↵</kbd>
              open
            </span>
          </div>
          <span className="tabular-nums">{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
