"use client";
import { useStore, selectCompletedTaskCount } from "@/lib/store";
import { levelFromXp } from "@/lib/xp-engine";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PLAN, IMAGE_PLAN, VIDEO_PLAN, AUDIO_PLAN } from "@/lib/data/plan";
import { SETUP_ITEMS } from "@/lib/data/setup";
import { PHASES } from "@/lib/data/phases";
import { BADGES } from "@/lib/data/badges";
import Link from "next/link";
import {
  ArrowUpRight, Image as ImageIcon, Film, Music,
  Sparkles, Target,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { TodayPlan } from "@/components/dashboard/today-plan";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { WeeklyGoalCard } from "@/components/dashboard/weekly-goal";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { useState } from "react";

export default function DashboardPage() {
  const [focusMode, setFocusMode] = useState(false);
  const xp = useStore((s) => s.xp);
  const tasks = useStore((s) => s.tasks);
  const streak = useStore((s) => s.streakDays);
  const badges = useStore((s) => s.badges);
  const xpLog = useStore((s) => s.xpLog);
  const completedCount = useStore(selectCompletedTaskCount);
  const { current, next, progress } = levelFromXp(xp);
  const hasInProgress = Object.values(tasks).some((t) => t.status === "in_progress");

  const isDone = (id: string) => {
    const t = tasks[id];
    return t?.status === "done" || t?.status === "mastered";
  };

  // Setup progress
  const setupTotal = SETUP_ITEMS.length;
  const setupDone = SETUP_ITEMS.filter((i) => isDone(i.id)).length;
  const setupPct = Math.round((setupDone / setupTotal) * 100);

  // Roadmap progress
  const allTasks = PLAN.flatMap((w) => w.tasks);
  const mainDone = allTasks.filter((t) => isDone(t.id)).length;
  const mainPct = Math.round((mainDone / allTasks.length) * 100);

  const trackProgress = (planArr: typeof PLAN) => {
    const all = planArr.flatMap((w) => w.tasks);
    const done = all.filter((t) => isDone(t.id)).length;
    return all.length === 0 ? 0 : Math.round((done / all.length) * 100);
  };
  const imgPct = trackProgress(IMAGE_PLAN);
  const vidPct = trackProgress(VIDEO_PLAN);
  const audPct = trackProgress(AUDIO_PLAN);

  return (
    <div className="space-y-10">
      {/* Heading */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Welcome back · {streak > 0 ? `${streak}-day streak` : "Start a streak today"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              {focusMode ? "Today Focus" : "Three tracks. One next step."}
            </h1>
            <p className="text-base text-muted-foreground">
              {focusMode
                ? "Only your highest-priority tasks for today."
                : "Pick a card. Open the resource. Mark it done. Repeat tomorrow."}
            </p>
          </div>
          <button
            onClick={() => setFocusMode((v) => !v)}
            className="h-9 px-3 rounded-md border border-border bg-card hover:bg-accent transition-colors text-xs font-medium"
          >
            {focusMode ? "Exit focus mode" : "Today Focus mode"}
          </button>
        </div>
      </div>

      {/* Today's plan (3 cards) */}
      <TodayPlan mode={focusMode ? "focus" : "default"} />

      {/* Resume + Weekly goal */}
      {!focusMode && (
        <section className={`grid gap-3 grid-cols-1 ${hasInProgress ? "md:grid-cols-2" : ""}`}>
          {hasInProgress && <ResumeCard />}
          <WeeklyGoalCard />
        </section>
      )}

      {focusMode ? null : (
        <>

      {/* Level + Stats */}
      <section className="space-y-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Level
            </p>
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tabular-nums tracking-tight">L{current.level}</span>
                <span className="text-sm text-muted-foreground">{current.title}</span>
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">
                {formatNumber(xp)} XP{next ? ` · ${formatNumber(next.minXp - xp)} to ${next.title}` : " · max level"}
              </div>
            </div>
            <Progress value={progress} className="h-1 mt-3" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
          <Stat label="Setup" value={`${setupDone}/${setupTotal}`} pct={setupPct} />
          <Stat label="Roadmap" value={`${mainDone}/${allTasks.length}`} pct={mainPct} />
          <Stat label="Badges" value={`${badges.length}/${BADGES.length}`} pct={Math.round((badges.length / BADGES.length) * 100)} />
          <Stat label="Tasks done" value={completedCount.toString()} />
        </div>
      </section>

      {/* Activity heatmap */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Last 30 days</h2>
          <p className="text-sm text-muted-foreground">XP earned per day · keep the streak alive</p>
        </div>
        <Card>
          <CardContent className="p-5">
            <ActivityHeatmap days={35} />
          </CardContent>
        </Card>
      </section>

      {/* Tracks */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Tracks</h2>
          <p className="text-sm text-muted-foreground">Run in parallel from Phase 3 onwards.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Track href="/roadmap" Icon={Target} title="Main Roadmap" desc="40 weeks · 6 phases" pct={mainPct} dot="#f97316" />
          <Track href="/image" Icon={ImageIcon} title="Image Generation" desc="12-week specialization" pct={imgPct} dot="#a855f7" />
          <Track href="/video" Icon={Film} title="Video Generation" desc="12-week specialization" pct={vidPct} dot="#3b82f6" />
          <Track href="/audio" Icon={Music} title="Audio Generation" desc="12-week specialization" pct={audPct} dot="#10b981" />
        </div>
      </section>

      {/* Phases */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Phases</h2>
          <p className="text-sm text-muted-foreground">From beginner to elite operator.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PHASES.map((p) => {
            const weeks = PLAN.filter((w) => w.phase === p.phase);
            const allP = weeks.flatMap((w) => w.tasks);
            const doneP = allP.filter((t) => isDone(t.id)).length;
            const pct = allP.length === 0 ? 0 : Math.round((doneP / allP.length) * 100);
            return (
              <Link key={p.phase} href="/roadmap" className="group block">
                <div className="p-4 rounded-xl border border-border bg-card hover:bg-accent/40 transition-colors h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Phase {p.phase}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm leading-snug">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4 mt-0.5">{p.weeks}</p>
                  <Progress value={pct} className="h-1" />
                  <p className="text-[11px] mt-2 tabular-nums text-muted-foreground">{doneP}/{allP.length} tasks · {pct}%</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Activity */}
      {xpLog.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Recent activity</h2>
            <p className="text-sm text-muted-foreground">{xpLog.length} entries</p>
          </div>
          <Card>
            <CardContent className="p-0 max-h-80 overflow-y-auto">
              {xpLog.slice(0, 12).map((entry, i) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between gap-3 px-5 py-3 text-sm ${
                    i !== Math.min(xpLog.length, 12) - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground truncate">{entry.context}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(entry.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium tabular-nums shrink-0 px-2 py-0.5 rounded-md bg-muted">
                    +{entry.amount} XP
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value, pct }: { label: string; value: string; pct?: number }) {
  return (
    <div className="bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-semibold tabular-nums tracking-tight">{value}</span>
        {pct !== undefined && (
          <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
        )}
      </div>
      {pct !== undefined && (
        <Progress value={pct} className="h-1 mt-3" />
      )}
    </div>
  );
}

function Track({
  href, Icon, title, desc, pct, dot,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  pct: number;
  dot: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="p-5 rounded-xl border border-border bg-card hover:bg-accent/40 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
            <Icon className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm">{title}</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-6">{desc}</p>
        <div className="mt-4 flex items-center gap-3">
          <Progress value={pct} className="h-1 flex-1" />
          <span className="text-xs tabular-nums text-muted-foreground shrink-0">{pct}%</span>
        </div>
      </div>
    </Link>
  );
}
