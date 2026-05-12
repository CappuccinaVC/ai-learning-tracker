"use client";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { isSupabaseEnabled } from "@/lib/supabase";
import { Download, Upload, Trash2, Database, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";

export default function SettingsPage() {
  const exportJson = useStore((s) => s.exportJson);
  const importJson = useStore((s) => s.importJson);
  const resetAll = useStore((s) => s.resetAll);
  const xp = useStore((s) => s.xp);
  const taskCount = useStore((s) => Object.keys(s.tasks).length);
  const badges = useStore((s) => s.badges);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importText, setImportText] = useState("");

  const handleExport = () => {
    const data = exportJson();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-tracker-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Progress exported");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (importJson(reader.result as string)) toast.success("Progress imported");
      else toast.error("Invalid JSON file");
    };
    reader.readAsText(file);
  };

  const handleImportText = () => {
    if (importJson(importText)) {
      toast.success("Progress imported");
      setImportText("");
    } else toast.error("Invalid JSON");
  };

  const handleReset = () => {
    if (confirm("Are you sure? This will reset ALL progress, XP, badges, and notes. Cannot be undone.")) {
      resetAll();
      toast.success("All progress reset");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text flex items-center gap-2"><SettingsIcon className="w-7 h-7" /> Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your data, sync, and tracker preferences</p>
      </div>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" /> Data & Sync</CardTitle>
          <CardDescription>
            {isSupabaseEnabled ? "Supabase sync is enabled" : "Currently in localStorage-only mode. Add Supabase env vars to enable cross-device sync (see README)."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Stat label="XP" value={xp.toString()} />
            <Stat label="Tasks Touched" value={taskCount.toString()} />
            <Stat label="Badges" value={badges.length.toString()} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExport} variant="outline"><Download className="w-4 h-4 mr-1" /> Export JSON</Button>
            <Button onClick={() => fileRef.current?.click()} variant="outline"><Upload className="w-4 h-4 mr-1" /> Import File</Button>
            <input ref={fileRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
          </div>
          <details className="mt-3">
            <summary className="text-sm cursor-pointer text-muted-foreground hover:text-foreground">Paste JSON</summary>
            <div className="mt-2 space-y-2">
              <Textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Paste your exported JSON here" rows={6} className="font-mono text-xs" />
              <Button onClick={handleImportText} disabled={!importText.trim()} variant="secondary" size="sm">Import from text</Button>
            </div>
          </details>
        </CardContent>
      </Card>

      <Card className="border-rose-500/20 bg-rose-500/5">
        <CardHeader>
          <CardTitle className="text-rose-300 flex items-center gap-2"><Trash2 className="w-5 h-5" /> Danger Zone</CardTitle>
          <CardDescription className="text-rose-300/70">Permanent actions. Export your data first.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleReset} variant="destructive"><Trash2 className="w-4 h-4 mr-1" /> Reset All Progress</Button>
        </CardContent>
      </Card>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>AI Learning Tracker v1.0 · Mastery content is available inline via the Cookbook.</p>
          <p>Cookbook source files (preserved unchanged):</p>
          <ul className="list-disc list-inside ml-2 text-xs">
            <li><code>AI_Mastery_Roadmap.md</code> — main 40-week roadmap</li>
            <li><code>AI_Image_Generation_Mastery.md</code></li>
            <li><code>AI_Video_Generation_Mastery.md</code></li>
            <li><code>AI_Audio_Generation_Mastery.md</code></li>
            <li><code>Setup_Checklist.md</code> — generated</li>
            <li><code>AI_Learning_Master_Index.md</code> — generated</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg border border-white/10 bg-card/40">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-xl font-bold tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
