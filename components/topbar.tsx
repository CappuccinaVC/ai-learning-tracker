"use client";
import { useStore } from "@/lib/store";
import { levelFromXp } from "@/lib/xp-engine";
import { Flame, Github, Search, Sparkles, Trophy } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useCommandPalette } from "./command-palette-provider";

const repoUrl = process.env.NEXT_PUBLIC_GITHUB_REPO_URL ?? "https://github.com/CappuccinaVB/ai-learning-tracker";

export function TopBar() {
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streakDays);
  const badges = useStore((s) => s.badges);
  const { current, progress } = levelFromXp(xp);
  const cp = useCommandPalette();

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      {/* Mobile brand */}
      <div className="lg:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-foreground text-background flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="font-semibold text-sm tracking-tight">AI Tracker</span>
      </div>

      {/* Search trigger (⌘K) */}
      <button
        onClick={cp.open}
        className="hidden md:inline-flex items-center gap-2 h-9 pl-2.5 pr-2 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors text-xs min-w-[220px]"
        aria-label="Open command palette"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="flex-1 text-left">Jump to anything…</span>
        <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono">⌘K</kbd>
      </button>

      <div className="flex items-center gap-2">
        {/* Streak */}
        <div className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-border bg-background text-muted-foreground">
          <Flame className={streak > 0 ? "w-3.5 h-3.5 text-orange-500" : "w-3.5 h-3.5"} />
          <span className="text-xs font-medium tabular-nums text-foreground">{streak}</span>
          <span className="text-xs hidden sm:inline">day{streak !== 1 ? "s" : ""}</span>
        </div>

        {/* Badges */}
        <div className="hidden sm:flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-border bg-background text-muted-foreground">
          <Trophy className="w-3.5 h-3.5" />
          <span className="text-xs font-medium tabular-nums text-foreground">{badges.length}</span>
        </div>

        {/* XP / Level */}
        <div className="hidden md:flex items-center gap-2.5 h-9 px-3 rounded-lg border border-border bg-background min-w-[200px]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] gap-2">
              <span className="font-medium text-foreground truncate">L{current.level} · {current.title}</span>
              <span className="text-muted-foreground tabular-nums shrink-0">{formatNumber(xp)} XP</span>
            </div>
            <div className="h-1 mt-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <a
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors text-xs"
          aria-label="Star this project on GitHub"
        >
          <Github className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Star on GitHub</span>
          <span className="lg:hidden">Star</span>
        </a>

        <ThemeToggle />
      </div>
    </header>
  );
}
