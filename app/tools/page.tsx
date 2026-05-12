"use client";
import { TOOLS } from "@/lib/data/tools";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Circle, ExternalLink, Search, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function ToolsPage() {
  const tasks = useStore((s) => s.tasks);
  const setStatus = useStore((s) => s.setTaskStatus);

  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const [costFilter, setCostFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const isInstalled = (id: string) => tasks[`tool-${id}`]?.status === "done" || tasks[`tool-${id}`]?.status === "mastered";

  const toggle = (id: string, name: string) => {
    const key = `tool-${id}`;
    if (isInstalled(id)) setStatus(key, "not_started");
    else setStatus(key, "done", "setup_item", `Installed ${name}`);
  };

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (trackFilter !== "all" && !t.track.includes(trackFilter as any)) return false;
      if (costFilter !== "all" && t.cost !== costFilter) return false;
      if (statusFilter === "installed" && !isInstalled(t.id)) return false;
      if (statusFilter === "not_installed" && isInstalled(t.id)) return false;
      return true;
    });
  }, [search, trackFilter, costFilter, statusFilter, tasks]);

  const installedCount = TOOLS.filter((t) => isInstalled(t.id)).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-2"><Wrench className="w-7 h-7" /> Tools Inventory</h1>
          <p className="text-muted-foreground mt-1">{installedCount}/{TOOLS.length} installed · Track which tools you have ready</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-white/10">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tools..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={trackFilter === "all"} onClick={() => setTrackFilter("all")}>All Tracks</FilterChip>
            <FilterChip active={trackFilter === "main"} onClick={() => setTrackFilter("main")}>Main</FilterChip>
            <FilterChip active={trackFilter === "image"} onClick={() => setTrackFilter("image")} color="text-purple-400">Image</FilterChip>
            <FilterChip active={trackFilter === "video"} onClick={() => setTrackFilter("video")} color="text-blue-400">Video</FilterChip>
            <FilterChip active={trackFilter === "audio"} onClick={() => setTrackFilter("audio")} color="text-emerald-400">Audio</FilterChip>
            <span className="w-px bg-white/10 mx-1" />
            <FilterChip active={costFilter === "all"} onClick={() => setCostFilter("all")}>All Costs</FilterChip>
            <FilterChip active={costFilter === "free"} onClick={() => setCostFilter("free")} color="text-emerald-400">Free</FilterChip>
            <FilterChip active={costFilter === "open_source"} onClick={() => setCostFilter("open_source")} color="text-cyan-400">OSS</FilterChip>
            <FilterChip active={costFilter === "freemium"} onClick={() => setCostFilter("freemium")} color="text-amber-400">Freemium</FilterChip>
            <FilterChip active={costFilter === "paid"} onClick={() => setCostFilter("paid")} color="text-rose-400">Paid</FilterChip>
            <span className="w-px bg-white/10 mx-1" />
            <FilterChip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>All Status</FilterChip>
            <FilterChip active={statusFilter === "not_installed"} onClick={() => setStatusFilter("not_installed")}>To Install</FilterChip>
            <FilterChip active={statusFilter === "installed"} onClick={() => setStatusFilter("installed")} color="text-emerald-400">Installed</FilterChip>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((tool) => {
          const installed = isInstalled(tool.id);
          return (
            <Card key={tool.id} className={cn("border-white/10 transition-all", installed && "border-emerald-500/30 bg-emerald-500/5")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <button onClick={() => toggle(tool.id, tool.name)} className="flex-shrink-0">
                      {installed ? (
                        <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      ) : <Circle className="w-5 h-5 text-muted-foreground/60" />}
                    </button>
                    <h3 className="font-semibold truncate">{tool.name}</h3>
                  </div>
                  <Badge variant={tool.cost === "free" || tool.cost === "open_source" ? "success" : tool.cost === "paid" ? "destructive" : "warning"} className="flex-shrink-0 text-[10px]">
                    {tool.cost === "open_source" ? "OSS" : tool.cost}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{tool.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{tool.category}{tool.priceNote && ` · ${tool.priceNote}`}</span>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-10 text-sm">No tools match your filters.</div>
      )}
    </div>
  );
}

function FilterChip({ children, active, onClick, color }: { children: React.ReactNode; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium border transition",
        active ? "bg-primary/20 border-primary/40 text-foreground" : "border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20",
        color && active && color
      )}
    >
      {children}
    </button>
  );
}
