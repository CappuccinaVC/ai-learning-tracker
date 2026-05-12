"use client";

import { useState, useTransition } from "react";
import type { RankingsPayload, RankingCategoryId, RankingSourceId } from "@/lib/data/rankings";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioLines, Bot, BrainCircuit, Film, Image as ImageIcon, Link2, RefreshCw, Sparkles } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ORDER: RankingCategoryId[] = ["chat", "local", "image", "video", "audio"];

const ICONS: Record<RankingCategoryId, React.ComponentType<{ className?: string }>> = {
  chat: Bot,
  local: BrainCircuit,
  image: ImageIcon,
  video: Film,
  audio: AudioLines,
};

function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SOURCE_LABELS: Record<RankingSourceId, string> = {
  arena: "Arena",
  huggingface: "Hugging Face",
  hybrid: "Hybrid",
};

function buildSourceQuery(selection: Record<RankingCategoryId, RankingSourceId>): string {
  const params = new URLSearchParams();
  params.set("src_chat", selection.chat);
  params.set("src_local", selection.local);
  params.set("src_image", selection.image);
  params.set("src_video", selection.video);
  params.set("src_audio", selection.audio);
  return params.toString();
}

export function RankingsTabs({ payload }: { payload: RankingsPayload }) {
  const [data, setData] = useState(payload);
  const [selection, setSelection] = useState(payload.sourceSelection);
  const [isPending, startTransition] = useTransition();
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const generatedAt = formatTimestamp(data.generatedAt);

  const fetchRankings = (nextSelection: Record<RankingCategoryId, RankingSourceId>, forceFresh: boolean) => {
    setRefreshError(null);
    startTransition(async () => {
      try {
        const sourceQuery = buildSourceQuery(nextSelection);
        const refreshQuery = forceFresh ? "&refresh=1" : "";
        const res = await fetch(`/api/rankings?${sourceQuery}${refreshQuery}`, { cache: forceFresh ? "no-store" : "default" });
        if (!res.ok) throw new Error(`Refresh failed (${res.status})`);
        const nextPayload = (await res.json()) as RankingsPayload;
        setData(nextPayload);
        setSelection(nextPayload.sourceSelection);
      } catch (error) {
        setRefreshError(error instanceof Error ? error.message : "Refresh failed");
      }
    });
  };

  const refreshNow = () => fetchRankings(selection, true);

  const setSourceForCategory = (category: RankingCategoryId, source: RankingSourceId) => {
    const allowed = data.sourceOptions[category] ?? [];
    if (!allowed.includes(source)) return;
    const nextSelection = { ...selection, [category]: source };
    setSelection(nextSelection);
    fetchRankings(nextSelection, false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-gradient-to-r from-card to-accent/20">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Live model rankings</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">AI Model Rankings</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                Hybrid ranking feed: live API data where available plus direct links to authoritative leaderboards.
                Cache refreshes every 24 hours.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground inline-flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" />
                Updated {generatedAt}
              </div>
              <Button variant="outline" size="sm" onClick={refreshNow} disabled={isPending}>
                <RefreshCw className={isPending ? "animate-spin" : undefined} />
                {isPending ? "Refreshing..." : "Refresh now"}
              </Button>
            </div>
          </div>
          {refreshError ? <p className="text-xs text-red-500 mt-3">{refreshError}</p> : null}
        </CardContent>
      </Card>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1 bg-muted/70 p-1.5">
          {ORDER.map((id) => {
            const category = data.categories[id];
            const Icon = ICONS[id];
            return (
              <TabsTrigger key={id} value={id} className="gap-1.5 px-3 py-2 text-xs sm:text-sm">
                <Icon className="w-3.5 h-3.5" /> {category.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {ORDER.map((id) => {
          const category = data.categories[id];
          return (
            <TabsContent key={id} value={id} className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">{category.label}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                        {(data.sourceOptions[id] ?? []).map((sourceId) => {
                          const active = selection[id] === sourceId;
                          return (
                            <Button
                              key={`${id}-${sourceId}`}
                              size="sm"
                              variant={active ? "default" : "outline"}
                              disabled={isPending}
                              onClick={() => setSourceForCategory(id, sourceId)}
                            >
                              {SOURCE_LABELS[sourceId]}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Metric: <span className="text-foreground">{category.metric}</span></p>
                      <p>
                        Source: <a className="underline hover:no-underline" href={category.sourceUrl} target="_blank" rel="noopener noreferrer">{category.sourceName}</a>
                      </p>
                      <p>Category updated: {formatTimestamp(category.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {category.entries.map((entry) => (
                  <Card key={`${id}-${entry.rank}-${entry.name}`} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center justify-between gap-2">
                        <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Rank #{entry.rank}</p>
                        <span className="text-[10px] px-2 py-1 rounded-md border border-border bg-background text-muted-foreground">
                          {entry.provider}
                        </span>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="font-medium text-sm leading-snug break-all">{entry.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {entry.score !== null ? `${formatNumber(entry.score)} ${entry.scoreLabel}` : entry.scoreLabel}
                            {entry.likes !== null ? ` · ${formatNumber(entry.likes)} likes` : ""}
                          </p>
                          {entry.metrics?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {entry.metrics.map((metric) => (
                                <span key={`${entry.name}-${metric.label}`} className="text-[10px] rounded-md border border-border bg-muted/30 px-2 py-0.5 text-muted-foreground">
                                  {metric.label}: <span className="text-foreground">{metric.value}</span>
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-muted-foreground">License: <span className="text-foreground">{entry.license ?? "n/a"}</span></span>
                          <a
                            href={entry.modelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-foreground hover:text-foreground/70"
                          >
                            Open <Link2 className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">External live leaderboards</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {category.externalLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border bg-background hover:bg-accent/40 transition-colors px-3 py-2 text-sm inline-flex items-center justify-between gap-2"
                      >
                        <span>{link.title}</span>
                        <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      <Card>
        <CardContent className="p-4 text-xs text-muted-foreground flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 mt-0.5" />
          <p>
            There is no single universal "true rank" across all use-cases. This page shows transparent source + metric
            so you can choose by your real goal (quality, speed, cost, or local deployment fit).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
