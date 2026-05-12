"use client";
import { PLAN } from "@/lib/data/plan";
import { PHASES } from "@/lib/data/phases";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TaskItem } from "@/components/task-item";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, Target } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function RoadmapPage() {
  const tasks = useStore((s) => s.tasks);
  const [openWeeks, setOpenWeeks] = useState<Set<number>>(new Set([1]));

  const isDone = (id: string) => tasks[id]?.status === "done" || tasks[id]?.status === "mastered";
  const toggleWeek = (n: number) => {
    setOpenWeeks((prev) => {
      const s = new Set(prev);
      s.has(n) ? s.delete(n) : s.add(n);
      return s;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Main Roadmap</h1>
        <p className="text-muted-foreground mt-1">40 weeks · 6 phases · From beginner to AI builder. Use Cookbook sections inline inside tasks for key references.</p>
      </div>

      {PHASES.map((phase) => {
        const weeks = PLAN.filter((w) => w.phase === phase.phase);
        if (weeks.length === 0) return null;
        const allTasks = weeks.flatMap((w) => w.tasks);
        const doneCount = allTasks.filter((t) => isDone(t.id)).length;
        const pct = Math.round((doneCount / allTasks.length) * 100);

        return (
          <div key={phase.phase} className="space-y-3">
            <div className="flex items-center gap-3 sticky top-16 z-10 bg-background/80 backdrop-blur-xl py-3 -mx-4 px-4 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: `${phase.color}20`, color: phase.color }}>
                {phase.phase}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold">{phase.title}</h2>
                  <Badge variant="secondary" className="text-xs">{phase.weeks}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{phase.goal}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold tabular-nums">{pct}%</div>
                <div className="text-xs text-muted-foreground">{doneCount}/{allTasks.length}</div>
              </div>
            </div>

            {weeks.map((week) => {
              const isOpen = openWeeks.has(week.weekNumber);
              const wDone = week.tasks.filter((t) => isDone(t.id)).length;
              const wPct = Math.round((wDone / week.tasks.length) * 100);
              const fullyDone = wDone === week.tasks.length;

              return (
                <Card key={week.weekNumber} className={cn("border-white/10 transition-all", fullyDone && "bg-emerald-500/5 border-emerald-500/30")}>
                  <button
                    onClick={() => toggleWeek(week.weekNumber)}
                    className="w-full text-left p-5 flex items-start gap-4 hover:bg-white/5 transition rounded-t-xl"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      W{week.weekNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{week.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{week.goal}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~{week.estimatedHours}h</span>
                        <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {week.tasks.length} tasks</span>
                      </div>
                      <Progress value={wPct} className="h-1.5 mt-2" />
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Badge variant={fullyDone ? "success" : "outline"}>{wDone}/{week.tasks.length}</Badge>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-0 pb-5 px-5 space-y-2">
                          {week.tasks.map((t) => <TaskItem key={t.id} task={t} />)}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
