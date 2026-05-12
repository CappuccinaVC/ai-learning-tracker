"use client";
import { COOKBOOK, COOKBOOK_TRACKS } from "@/lib/data/cookbook";
import type { Track } from "@/lib/data/types";
import { CookbookSectionView } from "@/components/cookbook-section";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpenText, Search, Image as ImageIcon, Film, Music, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

const TRACK_META: Record<Track, { label: string; Icon: React.ComponentType<{ className?: string }>; dot: string; tone: string }> = {
  main: { label: "Main", Icon: Target, dot: "bg-orange-500", tone: "text-orange-500" },
  image: { label: "Image", Icon: ImageIcon, dot: "bg-purple-500", tone: "text-purple-500" },
  video: { label: "Video", Icon: Film, dot: "bg-blue-500", tone: "text-blue-500" },
  audio: { label: "Audio", Icon: Music, dot: "bg-emerald-500", tone: "text-emerald-500" },
};

type TrackFilter = Track | "all";

export default function CookbookPage() {
  const [trackFilter, setTrackFilter] = useState<TrackFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COOKBOOK.filter((s) => {
      if (trackFilter !== "all" && s.track !== trackFilter) return false;
      if (!q) return true;
      const hay = `${s.title} ${s.summary} ${(s.tags ?? []).join(" ")} §${s.number}`.toLowerCase();
      return hay.includes(q);
    });
  }, [trackFilter, search]);

  // Group filtered sections by track
  const grouped = useMemo(() => {
    const map = new Map<Track, typeof COOKBOOK>();
    for (const s of filtered) {
      const arr = map.get(s.track) ?? [];
      arr.push(s);
      map.set(s.track, arr);
    }
    return map;
  }, [filtered]);

  const trackCount = (t: Track) => COOKBOOK.filter((s) => s.track === t).length;

  return (
    <div className="space-y-10">
      {/* Heading */}
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Library</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-3">
          <BookOpenText className="w-7 h-7 text-muted-foreground" />
          Cookbook
        </h1>
        <p className="text-base text-muted-foreground max-w-3xl">
          The actionable bits from the four mastery files — JSON schemas, prompt anatomies,
          screenshot-to-JSON workflows, genre recipes — distilled into copy-pastable references
          you never have to leave the app for.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sections, tags, schema names..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill
              active={trackFilter === "all"}
              onClick={() => setTrackFilter("all")}
              label="All"
              count={COOKBOOK.length}
            />
            {COOKBOOK_TRACKS.map((t) => {
              const meta = TRACK_META[t];
              return (
                <FilterPill
                  key={t}
                  active={trackFilter === t}
                  onClick={() => setTrackFilter(t)}
                  label={meta.label}
                  count={trackCount(t)}
                  dotClass={meta.dot}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Grouped sections */}
      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            No sections match your search.
          </CardContent>
        </Card>
      )}

      {COOKBOOK_TRACKS.map((track) => {
        const sections = grouped.get(track);
        if (!sections || sections.length === 0) return null;
        const meta = TRACK_META[track];
        const Icon = meta.Icon;

        return (
          <section key={track} className="space-y-4">
            <div className="flex items-center justify-between gap-3 sticky top-16 z-10 bg-background/85 backdrop-blur py-2 -mx-4 px-4 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <Icon className={cn("w-4 h-4", meta.tone)} />
                <h2 className="text-lg font-semibold tracking-tight">{meta.label} track</h2>
                <span className="text-xs text-muted-foreground">
                  {sections.length} section{sections.length !== 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Click any code block to copy
              </p>
            </div>

            {/* Section nav (anchors) */}
            <div className="flex flex-wrap gap-1.5">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#cookbook-${s.id}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-border bg-card hover:bg-accent transition-colors"
                >
                  <span className="text-muted-foreground tabular-nums">§{s.number}</span>
                  <span className="truncate max-w-[200px]">{s.title}</span>
                </a>
              ))}
            </div>

            <div className="space-y-4">
              {sections.map((s) => (
                <CookbookSectionView key={s.id} section={s} />
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-center text-xs text-muted-foreground pt-4">
        Sources distilled from{" "}
        <code className="bg-muted px-1.5 py-0.5 rounded">AI_Mastery_Roadmap.md</code>,{" "}
        <code className="bg-muted px-1.5 py-0.5 rounded">AI_Image_Generation_Mastery.md</code>,{" "}
        <code className="bg-muted px-1.5 py-0.5 rounded">AI_Video_Generation_Mastery.md</code>,{" "}
        <code className="bg-muted px-1.5 py-0.5 rounded">AI_Audio_Generation_Mastery.md</code>.
      </p>
    </div>
  );
}

function FilterPill({
  active, onClick, label, count, dotClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dotClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium border transition-colors",
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-background text-muted-foreground border-border hover:text-foreground"
      )}
    >
      {dotClass && <span className={cn("inline-block w-1.5 h-1.5 rounded-full", dotClass)} />}
      <span>{label}</span>
      <span className={cn("tabular-nums", active ? "opacity-70" : "opacity-60")}>{count}</span>
    </button>
  );
}
