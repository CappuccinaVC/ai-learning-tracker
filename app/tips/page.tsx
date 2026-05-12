"use client";
import { TIPS } from "@/lib/data/tips";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink, Lightbulb, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

const TRACK_COLOR: Record<string, string> = {
  main: "text-orange-400 border-orange-500/30 bg-orange-500/5",
  image: "text-purple-400 border-purple-500/30 bg-purple-500/5",
  video: "text-blue-400 border-blue-500/30 bg-blue-500/5",
  audio: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
};

export default function TipsPage() {
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return TIPS.filter((t) => {
      if (trackFilter !== "all" && t.track !== trackFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${t.title} ${t.insight} ${t.body ?? ""} ${t.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [search, trackFilter]);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-amber-400" /> Tips, Tricks & Prompt Templates
        </h1>
        <p className="text-muted-foreground mt-1">
          Copy-pastable JSON schemas, screenshot-to-prompt workflows and high-leverage insights distilled from your 4 mastery files.
        </p>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tips, e.g. 'json', 'veo', 'suno', 'continuity'..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { v: "all", label: "All Tracks", color: "" },
              { v: "main", label: "Main", color: "text-orange-400" },
              { v: "image", label: "Image", color: "text-purple-400" },
              { v: "video", label: "Video", color: "text-blue-400" },
              { v: "audio", label: "Audio", color: "text-emerald-400" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setTrackFilter(opt.v)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition",
                  trackFilter === opt.v
                    ? "bg-primary/20 border-primary/40 text-foreground"
                    : "border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20",
                  trackFilter === opt.v && opt.color
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((tip) => (
          <Card key={tip.id} className={cn("border", TRACK_COLOR[tip.track])}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className={cn("text-[10px] uppercase", TRACK_COLOR[tip.track])}>
                      {tip.track}
                    </Badge>
                    {tip.tags.map((t) => (
                      <span key={t} className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-lg font-bold flex items-start gap-2">
                    <Sparkles className="w-4 h-4 mt-1 flex-shrink-0 text-amber-400" />
                    <span>{tip.title}</span>
                  </h2>
                  <p className="text-sm text-foreground/80 mt-1">{tip.insight}</p>
                </div>
              </div>

              {tip.body && (
                <p className="text-sm text-muted-foreground whitespace-pre-line">{tip.body}</p>
              )}

              {tip.template && (
                <div className="relative group">
                  <pre className="text-xs bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto font-mono leading-relaxed">
                    <code>{tip.template}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copy(tip.template!, tip.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                  >
                    {copiedId === tip.id ? (
                      <><Check className="w-3.5 h-3.5 mr-1" /> Copied</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5 mr-1" /> Copy</>
                    )}
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-muted-foreground">
                  Source:{" "}
                  <Link
                    href={tip.cookbookSection ? `/cookbook#cookbook-${tip.cookbookSection}` : "/cookbook"}
                    className="hover:underline underline-offset-2"
                  >
                    <code className="bg-white/5 px-1.5 py-0.5 rounded">{tip.source}</code>
                  </Link>
                </span>
                {tip.links && tip.links.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tip.links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
                      >
                        <ExternalLink className="w-3 h-3" /> {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-10 text-sm">
          No tips match your filters.
        </div>
      )}
    </div>
  );
}
