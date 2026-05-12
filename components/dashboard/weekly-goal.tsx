"use client";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Edit2, BookOpenCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { weekKey, startOfWeek } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Estimate hours from completed tasks this week
// We approximate using xpLog timestamps (each entry roughly = work done).
// Hours = sum(estMin) when known, otherwise 5 min per XP earned that week as fallback.
function useThisWeekHours() {
  const xpLog = useStore((s) => s.xpLog);
  return useMemo(() => {
    const start = startOfWeek().getTime();
    const xpThisWeek = xpLog
      .filter((e) => new Date(e.at).getTime() >= start)
      .reduce((sum, e) => sum + e.amount, 0);
    // Heuristic: 1 XP ≈ 1 minute of focused effort.
    return Math.round((xpThisWeek / 60) * 10) / 10; // hours, 1 decimal
  }, [xpLog]);
}

export function WeeklyGoalCard() {
  const goal = useStore((s) => s.weeklyGoalHours);
  const setGoal = useStore((s) => s.setWeeklyGoal);
  const saveReview = useStore((s) => s.saveWeeklyReview);
  const reviews = useStore((s) => s.weeklyReviews);

  const hoursLogged = useThisWeekHours();
  const pct = Math.min(100, Math.round((hoursLogged / goal) * 100));

  const [editing, setEditing] = useState(false);
  const [draftGoal, setDraftGoal] = useState(goal.toString());

  const [reviewOpen, setReviewOpen] = useState(false);
  const [wins, setWins] = useState("");
  const [gaps, setGaps] = useState("");
  const [nextWeek, setNextWeek] = useState("");
  const [energy, setEnergy] = useState(3);
  const [rating, setRating] = useState(3);

  const wk = weekKey();
  const alreadyDone = reviews.some((r) => r.weekKey === wk);

  const submitReview = () => {
    saveReview({ weekKey: wk, wins, gaps, nextWeek, energy, rating });
    setWins(""); setGaps(""); setNextWeek("");
    setEnergy(3); setRating(3);
    setReviewOpen(false);
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              This week ({wk})
            </span>
          </div>
          <button
            onClick={() => { setDraftGoal(goal.toString()); setEditing(!editing); }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Edit weekly goal"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        </div>

        {editing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={60}
              value={draftGoal}
              onChange={(e) => setDraftGoal(e.target.value)}
              className="h-8 text-sm w-24"
            />
            <span className="text-xs text-muted-foreground">hrs/week</span>
            <Button
              size="sm"
              variant="default"
              onClick={() => { setGoal(parseInt(draftGoal, 10) || 10); setEditing(false); }}
            >
              Save
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums tracking-tight">
                {hoursLogged}h
              </span>
              <span className="text-sm text-muted-foreground">/ {goal}h target</span>
            </div>
            <Progress value={pct} className="h-1.5 mt-3" />
            <p className="text-xs text-muted-foreground mt-1.5 tabular-nums">{pct}% of weekly goal</p>
          </>
        )}

        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={() => setReviewOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium border border-border bg-background hover:bg-accent transition-colors"
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            {alreadyDone ? "Edit weekly review" : "Run weekly review"}
          </button>
        </div>
      </CardContent>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Weekly review · {wk}</DialogTitle>
            <DialogDescription>
              Five questions. Three minutes. Builds compounding clarity.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <Field label="3 wins this week" hint="What clicked? What did you ship?">
              <Textarea
                rows={3}
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                placeholder="1. ...&#10;2. ...&#10;3. ..."
              />
            </Field>
            <Field label="3 gaps" hint="What was confusing or didn't get done?">
              <Textarea
                rows={3}
                value={gaps}
                onChange={(e) => setGaps(e.target.value)}
                placeholder="1. ...&#10;2. ...&#10;3. ..."
              />
            </Field>
            <Field label="3 next-week priorities" hint="The most important things for next 7 days.">
              <Textarea
                rows={3}
                value={nextWeek}
                onChange={(e) => setNextWeek(e.target.value)}
                placeholder="1. ...&#10;2. ...&#10;3. ..."
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <RatingRow label="Energy" value={energy} onChange={setEnergy} />
              <RatingRow label="Week rating" value={rating} onChange={setRating} />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button onClick={submitReview} disabled={!wins.trim() && !gaps.trim() && !nextWeek.trim()}>
              Save review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function RatingRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1.5">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "flex-1 h-8 rounded-md border text-xs font-medium transition-colors",
              value === n
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:text-foreground"
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
