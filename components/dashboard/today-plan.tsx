"use client";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Clock, ExternalLink, Rocket, Target, Sparkles } from "lucide-react";
import Link from "next/link";
import { PLAN, IMAGE_PLAN, VIDEO_PLAN, AUDIO_PLAN } from "@/lib/data/plan";
import { SETUP_ITEMS } from "@/lib/data/setup";
import type { Task } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type Slot = {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  href: string;
  task: Task | null;
  hint: string;
  dot: string;
};

interface TodayPlanProps {
  mode?: "default" | "focus";
}

export function TodayPlan({ mode = "default" }: TodayPlanProps) {
  const tasks = useStore((s) => s.tasks);
  const setStatus = useStore((s) => s.setTaskStatus);

  const isDone = (id: string) => {
    const t = tasks[id];
    return t?.status === "done" || t?.status === "mastered";
  };

  // Setup
  const nextSetupItem = SETUP_ITEMS.find((i) => !isDone(i.id));
  const setupAsTask: Task | null = nextSetupItem
    ? {
        id: nextSetupItem.id,
        title: nextSetupItem.title,
        description: nextSetupItem.description,
        xpReason: "setup_item",
        link: nextSetupItem.url,
        estMin: nextSetupItem.estimatedMinutes,
      }
    : null;

  // Main roadmap
  const findFirstUndone = (planArr: typeof PLAN): Task | null => {
    for (const w of planArr) {
      for (const t of w.tasks) {
        if (!isDone(t.id)) return t;
      }
    }
    return null;
  };
  const nextMain = findFirstUndone(PLAN);

  // Specialization: pick the track with the most progress that isn't 100% done
  const trackProgress = (planArr: typeof PLAN) => {
    const all = planArr.flatMap((w) => w.tasks);
    const done = all.filter((t) => isDone(t.id)).length;
    return { done, total: all.length, pct: all.length === 0 ? 0 : done / all.length };
  };
  const trackOptions: { name: string; href: string; plan: typeof PLAN; dot: string }[] = [
    { name: "Image", href: "/image", plan: IMAGE_PLAN, dot: "#a855f7" },
    { name: "Video", href: "/video", plan: VIDEO_PLAN, dot: "#3b82f6" },
    { name: "Audio", href: "/audio", plan: AUDIO_PLAN, dot: "#10b981" },
  ];
  const activeTrack = trackOptions
    .map((t) => ({ ...t, progress: trackProgress(t.plan) }))
    .filter((t) => t.progress.pct < 1)
    .sort((a, b) => b.progress.done - a.progress.done)[0] ?? null;
  const nextSpec = activeTrack ? findFirstUndone(activeTrack.plan) : null;

  const slots: Slot[] = [
    {
      label: "Pre-Flight",
      Icon: Rocket,
      href: "/setup",
      task: setupAsTask,
      hint: nextSetupItem ? nextSetupItem.category : "Setup complete",
      dot: "#94a3b8",
    },
    {
      label: "Roadmap",
      Icon: Target,
      href: "/roadmap",
      task: nextMain,
      hint: nextMain ? `Up next on the main track` : "Main roadmap complete",
      dot: "#f97316",
    },
    {
      label: activeTrack ? `${activeTrack.name} Track` : "Pick a track",
      Icon: Sparkles,
      href: activeTrack?.href ?? "/image",
      task: nextSpec,
      hint: activeTrack ? `${activeTrack.progress.done}/${activeTrack.progress.total} done` : "Start a specialization",
      dot: activeTrack?.dot ?? "#a855f7",
    },
  ];

  const focusSlots = slots.filter((slot) => !!slot.task);
  const focusTotalMin = focusSlots.reduce((sum, slot) => sum + (slot.task?.estMin ?? 0), 0);

  if (mode === "focus") {
    return (
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Today Focus</h2>
          <p className="text-sm text-muted-foreground">{focusSlots.length} priorities · {focusTotalMin}m total</p>
        </div>
        <Card>
          <CardContent className="p-0">
            {slots.map((slot, idx) => (
              <div
                key={slot.label}
                className={cn(
                  "px-5 py-4",
                  idx !== slots.length - 1 && "border-b border-border"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{slot.label}</p>
                    {slot.task ? (
                      <>
                        <p className="mt-1 text-sm font-semibold leading-snug">{slot.task.title}</p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          {slot.task.estMin !== undefined && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" /> <span className="tabular-nums">{slot.task.estMin}m</span>
                            </span>
                          )}
                          <span className="truncate">{slot.hint}</span>
                        </div>
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{slot.hint}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {slot.task && (
                      <button
                        onClick={() => setStatus(slot.task!.id, "done", slot.task!.xpReason, slot.task!.title)}
                        className="h-8 px-3 rounded-md text-xs font-medium border bg-foreground text-background border-foreground hover:bg-foreground/90 transition-colors"
                      >
                        Done
                      </button>
                    )}
                    <Link
                      href={slot.href}
                      className="h-8 px-3 rounded-md text-xs font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors inline-flex items-center gap-1"
                    >
                      Open <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Today&apos;s plan</h2>
        <p className="text-sm text-muted-foreground">3 tracks · pick one and ship it</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {slots.map((slot) => (
          <Card key={slot.label}>
            <CardContent className="p-5 flex flex-col h-full">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: slot.dot }}
                  />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {slot.label}
                  </span>
                </div>
                <Link
                  href={slot.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Open ${slot.label}`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {slot.task ? (
                <>
                  <p className="mt-3 text-sm font-medium leading-snug line-clamp-3 flex-1">
                    {slot.task.title}
                  </p>
                  <div className="mt-3 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {slot.task.estMin !== undefined && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> <span className="tabular-nums">{slot.task.estMin}m</span>
                      </span>
                    )}
                    {slot.task.link && (
                      <a
                        href={slot.task.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> Open
                      </a>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => slot.task && setStatus(slot.task.id, "done", slot.task.xpReason, slot.task.title)}
                      className={cn(
                        "h-8 px-3 rounded-md text-xs font-medium border transition-colors",
                        "bg-foreground text-background border-foreground hover:bg-foreground/90"
                      )}
                    >
                      Mark done
                    </button>
                    <Link
                      href={slot.href}
                      className="h-8 px-3 rounded-md text-xs font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors flex items-center"
                    >
                      Details
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-3 text-sm text-muted-foreground flex-1">{slot.hint}</p>
                  <Link
                    href={slot.href}
                    className="mt-3 inline-flex items-center gap-1 text-xs text-foreground hover:text-foreground/70 transition-colors"
                  >
                    <slot.Icon className="w-3.5 h-3.5" /> Browse {slot.label}
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
