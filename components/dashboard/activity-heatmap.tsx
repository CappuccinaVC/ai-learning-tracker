"use client";
import { useStore } from "@/lib/store";
import { lastNDays } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  days?: number;
}

/**
 * 30-day activity heatmap derived from xpLog. Each cell shows total XP
 * earned that day; the cell darkens with more activity.
 */
export function ActivityHeatmap({ days = 30 }: Props) {
  const xpLog = useStore((s) => s.xpLog);

  // Aggregate XP per day-key
  const byDay = new Map<string, number>();
  for (const entry of xpLog) {
    const key = entry.at.slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + entry.amount);
  }

  const dayKeys = lastNDays(days);
  const max = Math.max(1, ...Array.from(byDay.values()));

  // Group into weeks for a github-style grid (rows = weekday, cols = week)
  const cols: string[][] = [];
  let current: string[] = [];
  for (const k of dayKeys) {
    current.push(k);
    if (current.length === 7) {
      cols.push(current);
      current = [];
    }
  }
  if (current.length) cols.push(current);

  const totalXp = Array.from(byDay.values()).reduce((a, b) => a + b, 0);
  const activeDays = dayKeys.filter((k) => (byDay.get(k) ?? 0) > 0).length;

  const intensity = (xp: number) => {
    if (xp === 0) return 0;
    const ratio = xp / max;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-sm">
          <span className="font-medium tabular-nums">{activeDays}</span>{" "}
          <span className="text-muted-foreground">/ {days} active days</span>
        </p>
        <p className="text-sm tabular-nums text-muted-foreground">{totalXp} XP earned</p>
      </div>

      <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
        {cols.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, day) => {
              const key = week[day];
              if (!key) return <div key={day} className="w-3 h-3" />;
              const xp = byDay.get(key) ?? 0;
              const level = intensity(xp);
              return (
                <div
                  key={day}
                  title={`${key} · ${xp} XP`}
                  className={cn(
                    "w-3 h-3 rounded-[2px] transition-colors",
                    level === 0 && "bg-muted",
                    level === 1 && "bg-emerald-500/30",
                    level === 2 && "bg-emerald-500/55",
                    level === 3 && "bg-emerald-500/80",
                    level === 4 && "bg-emerald-500"
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-0.5">
          <div className="w-2.5 h-2.5 rounded-[2px] bg-muted" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/30" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/55" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/80" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
