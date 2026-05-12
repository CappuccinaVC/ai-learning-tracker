"use client";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ExternalLink, PlayCircle } from "lucide-react";
import Link from "next/link";
import { PLAN, IMAGE_PLAN, VIDEO_PLAN, AUDIO_PLAN } from "@/lib/data/plan";
import { SETUP_ITEMS } from "@/lib/data/setup";
import type { Task } from "@/lib/data/types";

type Resolved = {
  task: Task;
  href: string;
  context: string;
};

export function ResumeCard() {
  const tasks = useStore((s) => s.tasks);

  // Find the most recently touched in_progress task
  const inProgress = Object.entries(tasks)
    .filter(([, t]) => t.status === "in_progress")
    .sort(([, a], [, b]) => {
      const aa = a.completedAt ?? "";
      const bb = b.completedAt ?? "";
      return bb.localeCompare(aa);
    });

  const resolveTask = (id: string): Resolved | null => {
    // Search setup
    const setup = SETUP_ITEMS.find((i) => i.id === id);
    if (setup) {
      return {
        task: { id: setup.id, title: setup.title, description: setup.description, xpReason: "setup_item", link: setup.url, estMin: setup.estimatedMinutes },
        href: "/setup",
        context: "Pre-Flight Setup",
      };
    }
    const search = (planArr: typeof PLAN, href: string, label: string): Resolved | null => {
      for (const w of planArr) {
        for (const t of w.tasks) {
          if (t.id === id) return { task: t, href, context: `${label} · Week ${w.weekNumber}` };
        }
      }
      return null;
    };
    return (
      search(PLAN, "/roadmap", "Main Roadmap") ||
      search(IMAGE_PLAN, "/image", "Image Track") ||
      search(VIDEO_PLAN, "/video", "Video Track") ||
      search(AUDIO_PLAN, "/audio", "Audio Track")
    );
  };

  let resolved: Resolved | null = null;
  for (const [id] of inProgress) {
    resolved = resolveTask(id);
    if (resolved) break;
  }

  if (!resolved) return null;

  const { task, href, context } = resolved;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <PlayCircle className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Pick up where you left off
          </span>
        </div>
        <p className="text-base font-medium leading-snug">{task.title}</p>
        <p className="text-xs text-muted-foreground mt-1">{context}</p>

        <div className="mt-4 flex items-center gap-2">
          {task.link && (
            <a
              href={task.link}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-md text-xs font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors inline-flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" /> Open resource
            </a>
          )}
          <Link
            href={href}
            className="h-8 px-3 rounded-md text-xs font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors inline-flex items-center gap-1"
          >
            Continue <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
