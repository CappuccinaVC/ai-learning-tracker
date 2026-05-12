"use client";
import { SETUP_ITEMS, SETUP_CATEGORIES } from "@/lib/data/setup";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SetupItem, TaskResource } from "@/lib/data/types";
import {
  Check, Circle, ChevronDown, ExternalLink, Rocket, Copy, CheckCircle,
  Target, ClipboardList, ListChecks, BookOpen, FileCode, Video, Wrench,
  Library, FileText, Github,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { MarkdownLite } from "@/components/markdown-lite";

const resourceIcon: Record<NonNullable<TaskResource["type"]>, React.ComponentType<{ className?: string }>> = {
  course: BookOpen,
  video: Video,
  article: FileText,
  docs: Library,
  tool: Wrench,
  playlist: Video,
  github: Github,
  paper: FileCode,
};

export default function SetupPage() {
  const tasks = useStore((s) => s.tasks);
  const setStatus = useStore((s) => s.setTaskStatus);
  const earnBadge = useStore((s) => s.earnBadge);
  const badges = useStore((s) => s.badges);
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const isDone = (id: string) => tasks[id]?.status === "done" || tasks[id]?.status === "mastered";

  const total = SETUP_ITEMS.length;
  const done = SETUP_ITEMS.filter((i) => isDone(i.id)).length;
  const pct = Math.round((done / total) * 100);

  const hasPreflight = badges.includes("preflight");
  useEffect(() => {
    if (pct === 100 && !hasPreflight) {
      earnBadge("preflight");
      toast.success("Pre-Flight Complete — badge earned!", { description: "+100 XP bonus" });
    }
  }, [pct, hasPreflight, earnBadge]);

  const toggleItem = (id: string, title: string) => {
    if (isDone(id)) setStatus(id, "not_started");
    else setStatus(id, "done", "setup_item", title);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-10">
      {/* Heading */}
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pre-Flight</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-3">
          <Rocket className="w-7 h-7 text-muted-foreground" /> Setup checklist
        </h1>
        <p className="text-base text-muted-foreground">
          Complete this once. Day 1 of your roadmap should feel like a runway, not an obstacle course.
        </p>
      </div>

      {/* Progress band */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Progress</p>
              <p className="text-2xl font-semibold tabular-nums mt-1">{done} <span className="text-muted-foreground">/ {total}</span></p>
            </div>
            <p className="text-2xl font-semibold tabular-nums">{pct}%</p>
          </div>
          <Progress value={pct} className="h-1.5 mt-3" />
        </CardContent>
      </Card>

      {/* Categories */}
      {SETUP_CATEGORIES.map((category) => {
        const items = SETUP_ITEMS.filter((i) => i.category === category);
        const catDone = items.filter((i) => isDone(i.id)).length;
        return (
          <section key={category} className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold tracking-tight">{category}</h2>
              <p className="text-xs text-muted-foreground tabular-nums">{catDone} / {items.length}</p>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <SetupItemRow
                  key={item.id}
                  item={item}
                  done={isDone(item.id)}
                  expanded={expanded.has(item.id)}
                  onToggleStatus={() => toggleItem(item.id, item.title)}
                  onToggleExpand={() => toggleExpand(item.id)}
                  copied={copied}
                  onCopy={copyText}
                />
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-center text-xs text-muted-foreground py-4">
        Tip: see <code className="bg-muted px-1.5 py-0.5 rounded">Setup_Checklist.md</code> in your project root for the canonical reference.
      </p>
    </div>
  );
}

function SetupItemRow({
  item, done, expanded, onToggleStatus, onToggleExpand, copied, onCopy,
}: {
  item: SetupItem;
  done: boolean;
  expanded: boolean;
  onToggleStatus: () => void;
  onToggleExpand: () => void;
  copied: string | null;
  onCopy: (key: string, text: string) => void;
}) {
  const hasRichDetail = !!(
    item.goal || item.note || (item.steps && item.steps.length) ||
    (item.successCriteria && item.successCriteria.length) || item.template ||
    (item.resources && item.resources.length)
  );

  return (
    <div
      className={cn(
        "rounded-lg border transition-colors overflow-hidden",
        done ? "border-emerald-500/40 bg-emerald-500/[0.04]" : "border-border bg-card"
      )}
    >
      <div className="flex items-start gap-3 p-3">
        <button
          onClick={onToggleStatus}
          className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110 active:scale-95 focus-ring rounded-full"
          aria-label={done ? "Mark as not done" : "Mark as done"}
        >
          {done ? (
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground/50" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium leading-snug", done && "line-through text-muted-foreground")}>{item.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs">
            <span className="text-muted-foreground tabular-nums">~{item.estimatedMinutes}m · +10 XP</span>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> Open
              </a>
            )}
            {item.command && (
              <button
                onClick={() => onCopy(item.id + "-cmd", item.command!)}
                className="inline-flex items-center gap-1 font-mono text-muted-foreground hover:text-foreground bg-muted px-2 py-0.5 rounded"
              >
                {copied === item.id + "-cmd" ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <code>{item.command}</code>
              </button>
            )}
            {hasRichDetail && (
              <button
                onClick={onToggleExpand}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors ml-auto"
              >
                <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
                {expanded ? "Hide details" : "Details"}
              </button>
            )}
          </div>
        </div>
      </div>

      {expanded && hasRichDetail && (
        <div className="border-t border-border bg-muted/30 px-4 py-4 space-y-5">
          {item.goal && (
            <Section icon={Target} label="Goal">
              <p className="text-sm leading-relaxed">{item.goal}</p>
            </Section>
          )}

          {item.note && (
            <Section icon={FileText} label="Why & how to think about this">
              <MarkdownLite text={item.note} />
            </Section>
          )}

          {item.steps && item.steps.length > 0 && (
            <Section icon={ClipboardList} label="Steps">
              <ol className="space-y-1.5 text-sm leading-relaxed list-none">
                {item.steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-md bg-foreground text-background text-[10px] font-medium tabular-nums">
                      {i + 1}
                    </span>
                    <span><MarkdownLite text={step} /></span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {item.successCriteria && item.successCriteria.length > 0 && (
            <Section icon={ListChecks} label="Done when">
              <ul className="space-y-1 text-sm leading-relaxed">
                {item.successCriteria.map((c, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {item.template && (
            <Section icon={FileCode} label="Template (copy/paste)">
              <div className="relative">
                <pre className="text-[11px] leading-snug bg-background border border-border rounded-md p-3 overflow-x-auto whitespace-pre font-mono max-h-[400px] overflow-y-auto">
                  {item.template}
                </pre>
                <button
                  onClick={() => onCopy(item.id + "-tpl", item.template!)}
                  className="absolute top-2 right-2 inline-flex items-center gap-1 h-7 px-2 rounded-md text-xs font-medium border border-border bg-background hover:bg-accent transition-colors"
                >
                  {copied === item.id + "-tpl" ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
            </Section>
          )}

          {item.resources && item.resources.length > 0 && (
            <Section icon={BookOpen} label="Resources">
              <ul className="space-y-1.5">
                {item.resources.map((r, i) => {
                  const Icon = resourceIcon[r.type ?? "docs"];
                  return (
                    <li key={i}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/r inline-flex items-start gap-2 text-sm text-foreground hover:text-foreground/70 transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                        <span>
                          <span className="underline-offset-2 group-hover/r:underline">{r.title}</span>
                          {r.note && <span className="block text-xs text-muted-foreground mt-0.5">{r.note}</span>}
                        </span>
                        <ExternalLink className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  icon: Icon, label, children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="pl-0.5">{children}</div>
    </div>
  );
}
