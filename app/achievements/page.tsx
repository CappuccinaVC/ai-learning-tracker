"use client";
import { BADGES, RARITY_COLORS } from "@/lib/data/badges";
import { LEVELS, levelFromXp } from "@/lib/xp-engine";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import * as Icons from "lucide-react";
import { Lock, Trophy } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { useState } from "react";

type RarityFilter = "all" | "common" | "rare" | "epic" | "legendary";

export default function AchievementsPage() {
  const earned = useStore((s) => s.badges);
  const xp = useStore((s) => s.xp);
  const { current } = levelFromXp(xp);
  const [filter, setFilter] = useState<RarityFilter>("all");
  const [showLocked, setShowLocked] = useState(true);

  const filtered = BADGES.filter((b) => {
    if (filter !== "all" && b.rarity !== filter) return false;
    if (!showLocked && !earned.includes(b.id)) return false;
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Heading */}
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Progress</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Achievements</h1>
        <p className="text-base text-muted-foreground">
          {earned.length} of {BADGES.length} unlocked · {formatNumber(xp)} XP · Level {current.level} {current.title}
        </p>
      </div>

      {/* Stat band */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
        <Stat label="Earned" value={`${earned.length}/${BADGES.length}`} />
        <Stat label="Common" value={`${earned.filter((id) => BADGES.find((b) => b.id === id)?.rarity === "common").length}/${BADGES.filter((b) => b.rarity === "common").length}`} />
        <Stat label="Rare + Epic" value={`${earned.filter((id) => { const r = BADGES.find((b) => b.id === id)?.rarity; return r === "rare" || r === "epic"; }).length}/${BADGES.filter((b) => b.rarity === "rare" || b.rarity === "epic").length}`} />
        <Stat label="Legendary" value={`${earned.filter((id) => BADGES.find((b) => b.id === id)?.rarity === "legendary").length}/${BADGES.filter((b) => b.rarity === "legendary").length}`} />
      </div>

      {/* Levels timeline */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Level Progression</h2>
          <p className="text-sm text-muted-foreground">10 levels · earned via XP</p>
        </div>
        <Card>
          <CardContent className="p-0">
            {LEVELS.map((lvl, i) => {
              const isCurrent = lvl.level === current.level;
              const isPast = xp >= lvl.minXp && !isCurrent;
              const next = LEVELS[i + 1];
              const progress = !next ? 100 : Math.min(100, Math.max(0, ((xp - lvl.minXp) / (next.minXp - lvl.minXp)) * 100));
              return (
                <div
                  key={lvl.level}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4",
                    i !== LEVELS.length - 1 && "border-b border-border",
                    isCurrent && "bg-accent/30"
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm tabular-nums shrink-0 transition-colors",
                      isPast ? "bg-foreground text-background" : isCurrent ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {lvl.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className={cn("text-sm", (isCurrent || isPast) ? "font-medium text-foreground" : "text-muted-foreground")}>
                        {lvl.title}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatNumber(lvl.minXp)} XP
                      </span>
                    </div>
                    {isCurrent && next && (
                      <>
                        <Progress value={progress} className="h-1 mt-2" />
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {formatNumber(next.minXp - xp)} XP to {next.title}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      {/* Badge grid */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold tracking-tight">Badges</h2>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["all", "common", "rare", "epic", "legendary"] as RarityFilter[]).map((r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={cn(
                  "h-7 px-2.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors border",
                  filter === r
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                )}
              >
                {r}
              </button>
            ))}
            <button
              onClick={() => setShowLocked(!showLocked)}
              className="h-7 px-2.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors border bg-background text-muted-foreground border-border hover:text-foreground"
            >
              {showLocked ? "Hide locked" : "Show locked"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((badge) => {
            const isEarned = earned.includes(badge.id);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Icon = ((Icons as unknown as Record<string, any>)[badge.icon]) ?? Trophy;
            const rarity = RARITY_COLORS[badge.rarity];
            return (
              <div
                key={badge.id}
                className={cn(
                  "group relative p-5 rounded-xl border bg-card transition-all hover:-translate-y-0.5",
                  isEarned ? rarity.accent : "border-border",
                  !isEarned && "opacity-60 hover:opacity-100"
                )}
              >
                {/* Locked indicator chip */}
                {!isEarned && (
                  <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium uppercase tracking-wider bg-muted text-muted-foreground">
                    <Lock className="w-2.5 h-2.5" /> Locked
                  </div>
                )}

                <div className="flex flex-col items-center text-center gap-3">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                      isEarned ? rarity.iconBg : "bg-muted/60"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-7 h-7 transition-colors",
                        isEarned ? rarity.iconText : "text-muted-foreground/40"
                      )}
                      strokeWidth={isEarned ? 2 : 1.5}
                    />
                  </div>
                  <div>
                    <p className={cn("font-medium text-sm leading-tight", !isEarned && "text-muted-foreground")}>
                      {badge.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{badge.description}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider border",
                        isEarned ? cn(rarity.accent, rarity.text) : "border-border text-muted-foreground"
                      )}
                    >
                      {rarity.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 leading-snug">{badge.criteria}</p>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">No badges match this filter.</p>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
    </div>
  );
}
