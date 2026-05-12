"use client";
import { useStore } from "@/lib/store";
import type { Task, TaskResource } from "@/lib/data/types";
import {
  Check, Circle, CircleDashed, Crown, ExternalLink, Sparkles,
  ChevronDown, Target, ListChecks, BookOpen, Video, FileText,
  Wrench, Github, FileCode, Library, ClipboardList, Clock, NotebookPen,
  BookOpenText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { XP_VALUES } from "@/lib/xp-engine";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { getCookbookSection } from "@/lib/data/cookbook";
import { CookbookSectionView } from "./cookbook-section";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface Props {
  task: Task;
  showXp?: boolean;
}

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

const DEFAULT_COOKBOOK_SECTION_BY_TRACK = {
  main: "main-prompt-anatomy",
  image: "img-3-1-anatomy",
  video: "vid-3-1-anatomy",
  audio: "aud-3-1-anatomy",
} as const;

function inferTrackFromTaskId(taskId: string): keyof typeof DEFAULT_COOKBOOK_SECTION_BY_TRACK {
  if (taskId.startsWith("img-")) return "image";
  if (taskId.startsWith("vid-")) return "video";
  if (taskId.startsWith("aud-")) return "audio";
  return "main";
}

function inferCookbookSectionFromTaskId(taskId: string): string {
  const id = taskId.toLowerCase();

  if (id.startsWith("img-")) {
    if (id.includes("json")) return "img-3-5-json-prompting";
    if (id.includes("screenshot")) return "img-3-6-screenshot-to-json";
    if (id.includes("anatomy")) return "img-3-1-anatomy";
    if (id.includes("mj") || id.includes("styles")) return "img-3-4-model-tips";
    return DEFAULT_COOKBOOK_SECTION_BY_TRACK.image;
  }

  if (id.startsWith("vid-")) {
    if (id.includes("veo")) return "vid-3-7-veo-specifics";
    if (id.includes("kling")) return "vid-3-8-kling-specifics";
    if (id.includes("runway")) return "vid-3-9-runway-specifics";
    if (id.includes("json")) return "vid-3-3-json-schema";
    if (id.includes("screenshot")) return "vid-3-5-screenshot-to-json";
    if (id.includes("character")) return "vid-3-4-multishot-continuity";
    return DEFAULT_COOKBOOK_SECTION_BY_TRACK.video;
  }

  if (id.startsWith("aud-")) {
    if (id.includes("recipe")) return "aud-3-1-recipes";
    if (id.includes("structure")) return "aud-3-1-structure-tags";
    if (id.includes("screenshot")) return "aud-3-3-screenshot-to-song";
    if (
      id.includes("tts") ||
      id.includes("eleven") ||
      id.includes("kokoro") ||
      id.includes("rvc") ||
      id.includes("podcast") ||
      id.includes("vapi")
    ) {
      return "aud-3-2-tts";
    }
    return DEFAULT_COOKBOOK_SECTION_BY_TRACK.audio;
  }

  return DEFAULT_COOKBOOK_SECTION_BY_TRACK.main;
}

export function TaskItem({ task, showXp = true }: Props) {
  const taskState = useStore((s) => s.tasks[task.id]);
  const setStatus = useStore((s) => s.setTaskStatus);
  const setNotes = useStore((s) => s.setTaskNotes);
  const [expanded, setExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showCookbookPanel, setShowCookbookPanel] = useState(false);

  const status = taskState?.status ?? "not_started";
  const xpValue = XP_VALUES[task.xpReason];

  const explicitCookbookSection = task.cookbookSection ? getCookbookSection(task.cookbookSection) : undefined;
  const inferredCookbookSection = explicitCookbookSection
    ? undefined
    : getCookbookSection(inferCookbookSectionFromTaskId(task.id));
  const fallbackCookbookSection = explicitCookbookSection
    ? undefined
    : inferredCookbookSection ?? getCookbookSection(DEFAULT_COOKBOOK_SECTION_BY_TRACK[inferTrackFromTaskId(task.id)]);
  const cookbookLinkSection = explicitCookbookSection ?? fallbackCookbookSection;

  const hasRichDetail = !!(task.goal || (task.details && task.details.length) || (task.successCriteria && task.successCriteria.length) || (task.resources && task.resources.length) || explicitCookbookSection);

  // Single primary link (collapsed quick-open)
  const primaryLink = task.link ?? (task.resources && task.resources[0]?.url);

  const cycleStatus = () => {
    const next: Record<string, "in_progress" | "done" | "mastered" | "not_started"> = {
      not_started: "in_progress",
      in_progress: "done",
      done: "mastered",
      mastered: "not_started",
    };
    setStatus(task.id, next[status], task.xpReason, task.title);
  };

  return (
    <div
      className={cn(
        "group rounded-lg border transition-colors overflow-hidden",
        status === "not_started" && "border-border bg-card",
        status === "in_progress" && "border-blue-500/40 bg-blue-500/[0.04]",
        status === "done" && "border-emerald-500/40 bg-emerald-500/[0.04]",
        status === "mastered" && "border-amber-500/50 bg-amber-500/[0.05]"
      )}
    >
      <div className="flex items-start gap-3 p-3">
        {/* Status circle */}
        <button
          onClick={cycleStatus}
          className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110 active:scale-95 focus-ring rounded-full"
          aria-label="Toggle task status"
        >
          {status === "not_started" && <Circle className="w-5 h-5 text-muted-foreground/50" />}
          {status === "in_progress" && <CircleDashed className="w-5 h-5 text-blue-500 animate-spin [animation-duration:3s]" />}
          {status === "done" && (
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          {status === "mastered" && (
            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          )}
        </button>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-[15px] font-semibold leading-snug tracking-tight",
              status === "done" && "text-muted-foreground line-through",
              status === "mastered" && "text-foreground font-medium"
            )}
          >
            {task.title}
          </p>
          {task.description && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{task.description}</p>}

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs">
            {showXp && (
              <span className="inline-flex items-center gap-1 text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                <Sparkles className="w-3 h-3" /> <span className="tabular-nums">+{xpValue} XP</span>
              </span>
            )}
            {task.estMin !== undefined && (
              <span className="inline-flex items-center gap-1 text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                <Clock className="w-3 h-3" /> <span className="tabular-nums">{task.estMin}m</span>
              </span>
            )}
            {primaryLink && (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" /> Open
              </a>
            )}
            {cookbookLinkSection && (
              <button
                onClick={() => setShowCookbookPanel(true)}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <BookOpenText className="w-3 h-3" /> Cookbook §{cookbookLinkSection.number}
              </button>
            )}
            {hasRichDetail && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
                {expanded ? "Hide details" : "Details"}
              </button>
            )}
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              <NotebookPen className="w-3 h-3" /> {showNotes ? "Hide notes" : "Notes"}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded rich detail */}
      {expanded && hasRichDetail && (
        <div className="border-t border-border bg-muted/30 px-4 py-4 space-y-4">
          {task.goal && (
            <Section icon={Target} label="Goal">
              <p className="text-sm leading-relaxed">{task.goal}</p>
            </Section>
          )}

          {explicitCookbookSection && (
            <Section icon={BookOpenText} label={`Cookbook · §${explicitCookbookSection.number}`}>
              <div className="rounded-lg border border-border bg-background overflow-hidden">
                <div className="p-4 sm:p-5">
                  <CookbookSectionView section={explicitCookbookSection} anchor={false} compact />
                </div>
                <div className="px-4 py-2 border-t border-border bg-muted/40 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-muted-foreground">
                    From <code className="bg-background px-1 py-0.5 rounded">{explicitCookbookSection.source}</code>
                  </p>
                  <Link
                    href={`/cookbook#cookbook-${explicitCookbookSection.id}`}
                    className="text-[11px] font-medium text-foreground hover:text-foreground/70 inline-flex items-center gap-1"
                  >
                    Open in Cookbook <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </Section>
          )}

          {task.details && task.details.length > 0 && (
            <Section icon={ClipboardList} label="What to do">
              <ol className="space-y-1.5 text-sm leading-relaxed list-none">
                {task.details.map((step, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-md bg-foreground text-background text-[10px] font-medium tabular-nums">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {task.successCriteria && task.successCriteria.length > 0 && (
            <Section icon={ListChecks} label="Done when">
              <ul className="space-y-1 text-sm leading-relaxed">
                {task.successCriteria.map((c, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {task.resources && task.resources.length > 0 && (
            <Section icon={BookOpen} label="Resources">
              <ul className="space-y-1.5">
                {task.resources.map((r, i) => {
                  const Icon = resourceIcon[r.type ?? "docs"];
                  const isInternal = r.url.startsWith("/");
                  return (
                    <li key={i}>
                      <a
                        href={r.url}
                        target={isInternal ? undefined : "_blank"}
                        rel={isInternal ? undefined : "noopener noreferrer"}
                        className="group/r inline-flex items-start gap-2 text-sm text-foreground hover:text-foreground/70 transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                        <span>
                          <span className="underline-offset-2 group-hover/r:underline">{r.title}</span>
                          {r.note && (
                            <span className="block text-xs text-muted-foreground mt-0.5">{r.note}</span>
                          )}
                        </span>
                        {!isInternal && <ExternalLink className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}
        </div>
      )}

      {/* Notes */}
      {showNotes && (
        <div className="border-t border-border px-4 py-3">
          <Textarea
            value={taskState?.notes ?? ""}
            onChange={(e) => setNotes(task.id, e.target.value)}
            placeholder="Your notes, reflections, what you learned…"
            className="text-xs"
            rows={3}
          />
        </div>
      )}

      {cookbookLinkSection && (
        <Dialog open={showCookbookPanel} onOpenChange={setShowCookbookPanel}>
          <DialogContent className="left-auto right-0 top-0 translate-x-0 translate-y-0 h-dvh w-full max-w-2xl sm:max-w-2xl rounded-none sm:rounded-none p-0 gap-0 overflow-hidden border-l border-border">
            <DialogHeader className="p-4 border-b border-border">
              <DialogTitle className="text-base">Cookbook §{cookbookLinkSection.number} · {cookbookLinkSection.title}</DialogTitle>
              <DialogDescription>
                In-context guidance for this task.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto p-4 sm:p-5">
              <CookbookSectionView section={cookbookLinkSection} anchor={false} compact />
            </div>
            <div className="border-t border-border p-3 flex items-center justify-between gap-3 bg-muted/30">
              <p className="text-[11px] text-muted-foreground truncate">Source: {cookbookLinkSection.source}</p>
              <Link
                href={`/cookbook#cookbook-${cookbookLinkSection.id}`}
                className="text-xs font-medium text-foreground hover:text-foreground/70 whitespace-nowrap"
              >
                Open full Cookbook
              </Link>
            </div>
          </DialogContent>
        </Dialog>
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
