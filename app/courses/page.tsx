"use client";
import { COURSES } from "@/lib/data/courses";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Circle, Clock, ExternalLink, GraduationCap, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function CoursesPage() {
  const tasks = useStore((s) => s.tasks);
  const setStatus = useStore((s) => s.setTaskStatus);
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const [phaseFilter, setPhaseFilter] = useState<number | "all">("all");

  const isDone = (id: string) => tasks[`course-${id}`]?.status === "done" || tasks[`course-${id}`]?.status === "mastered";
  const toggle = (id: string, title: string, xp: number) => {
    const key = `course-${id}`;
    if (isDone(id)) setStatus(key, "not_started");
    else setStatus(key, "done", xp >= 200 ? "course_major" : "course_short", title);
  };

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.provider.toLowerCase().includes(search.toLowerCase())) return false;
      if (trackFilter !== "all" && !c.track.includes(trackFilter as any)) return false;
      if (phaseFilter !== "all" && c.whenPhase !== phaseFilter) return false;
      return true;
    });
  }, [search, trackFilter, phaseFilter]);

  const doneCount = COURSES.filter((c) => isDone(c.id)).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text flex items-center gap-2"><GraduationCap className="w-7 h-7" /> Courses Library</h1>
        <p className="text-muted-foreground mt-1">{doneCount}/{COURSES.length} completed · Curated from your mastery files</p>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "main", "image", "video", "audio"] as const).map((tr) => (
              <button
                key={tr}
                onClick={() => setTrackFilter(tr)}
                className={cn("px-3 py-1 rounded-full text-xs font-medium border transition",
                  trackFilter === tr ? "bg-primary/20 border-primary/40" : "border-white/10 text-muted-foreground hover:text-foreground"
                )}
              >
                {tr === "all" ? "All Tracks" : tr.charAt(0).toUpperCase() + tr.slice(1)}
              </button>
            ))}
            <span className="w-px bg-white/10 mx-1" />
            {(["all", 1, 2, 3, 4, 5, 6] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={cn("px-3 py-1 rounded-full text-xs font-medium border transition",
                  phaseFilter === p ? "bg-primary/20 border-primary/40" : "border-white/10 text-muted-foreground hover:text-foreground"
                )}
              >
                {p === "all" ? "All Phases" : `Phase ${p}`}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((c) => {
          const done = isDone(c.id);
          return (
            <Card key={c.id} className={cn("border-white/10 transition-all", done && "border-emerald-500/30 bg-emerald-500/5")}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <button onClick={() => toggle(c.id, c.title, c.xp)} className="mt-0.5 flex-shrink-0">
                    {done ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : <Circle className="w-5 h-5 text-muted-foreground/60" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold leading-tight">{c.title}</h3>
                      <Badge variant={c.cost === "free" ? "success" : c.cost === "paid" ? "destructive" : "warning"} className="text-[10px] flex-shrink-0">{c.cost}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.provider}</p>
                    <p className="text-xs text-muted-foreground mt-2">{c.why}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /> {c.duration}</span>
                      <span className="text-muted-foreground">{c.level}</span>
                      <span className="flex items-center gap-1 text-purple-400"><Sparkles className="w-3 h-3" /> +{c.xp} XP</span>
                      <span className="text-muted-foreground">Phase {c.whenPhase}</span>
                      {c.priceNote && <span className="text-muted-foreground">{c.priceNote}</span>}
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Open
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
