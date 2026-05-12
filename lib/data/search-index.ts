import { PLAN, IMAGE_PLAN, VIDEO_PLAN, AUDIO_PLAN } from "./plan";
import { COURSES } from "./courses";
import { TOOLS } from "./tools";
import { TIPS } from "./tips";
import { BADGES } from "./badges";
import { SETUP_ITEMS } from "./setup";

export type SearchKind =
  | "page"
  | "task"
  | "course"
  | "tool"
  | "tip"
  | "badge"
  | "setup";

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  href?: string; // internal route
  url?: string; // external link
  keywords?: string;
}

const PAGES: SearchItem[] = [
  { id: "p-dashboard", kind: "page", title: "Dashboard", href: "/", keywords: "home overview" },
  { id: "p-setup", kind: "page", title: "Pre-Flight Setup", href: "/setup", keywords: "install start onboarding" },
  { id: "p-roadmap", kind: "page", title: "Main Roadmap", href: "/roadmap", keywords: "weekly plan main" },
  { id: "p-image", kind: "page", title: "Image Track", href: "/image", keywords: "midjourney flux comfyui" },
  { id: "p-video", kind: "page", title: "Video Track", href: "/video", keywords: "veo runway kling" },
  { id: "p-audio", kind: "page", title: "Audio Track", href: "/audio", keywords: "suno elevenlabs music" },
  { id: "p-rankings", kind: "page", title: "Model Rankings", href: "/rankings", keywords: "leaderboard benchmark llm image video audio" },
  { id: "p-tips", kind: "page", title: "Tips & Templates", href: "/tips", keywords: "prompts json templates" },
  { id: "p-tools", kind: "page", title: "Tools Inventory", href: "/tools", keywords: "stack inventory" },
  { id: "p-courses", kind: "page", title: "Courses Library", href: "/courses", keywords: "learn study" },
  { id: "p-achievements", kind: "page", title: "Achievements", href: "/achievements", keywords: "badges level xp" },
  { id: "p-settings", kind: "page", title: "Settings", href: "/settings", keywords: "export import reset" },
];

function tasksFromPlan(planArr: typeof PLAN, href: string, label: string): SearchItem[] {
  return planArr.flatMap((week) =>
    week.tasks.map((t) => ({
      id: t.id,
      kind: "task" as const,
      title: t.title,
      subtitle: `${label} · Week ${week.weekNumber} · ${week.title}`,
      href,
      url: t.link,
    }))
  );
}

const TASKS: SearchItem[] = [
  ...tasksFromPlan(PLAN, "/roadmap", "Roadmap"),
  ...tasksFromPlan(IMAGE_PLAN, "/image", "Image"),
  ...tasksFromPlan(VIDEO_PLAN, "/video", "Video"),
  ...tasksFromPlan(AUDIO_PLAN, "/audio", "Audio"),
];

const COURSE_ITEMS: SearchItem[] = COURSES.map((c) => ({
  id: `course-${c.id}`,
  kind: "course",
  title: c.title,
  subtitle: `${c.provider} · ${c.duration} · ${c.level}`,
  url: c.url,
  keywords: c.why,
}));

const TOOL_ITEMS: SearchItem[] = TOOLS.map((t) => ({
  id: `tool-${t.id}`,
  kind: "tool",
  title: t.name,
  subtitle: `${t.category} · ${t.cost}${t.priceNote ? ` · ${t.priceNote}` : ""}`,
  url: t.url,
  keywords: t.description,
}));

const TIP_ITEMS: SearchItem[] = TIPS.map((t) => ({
  id: `tip-${t.id}`,
  kind: "tip",
  title: t.title,
  subtitle: `${t.track}${t.source ? ` · ${t.source}` : ""}`,
  href: "/tips",
  keywords: `${t.insight} ${(t.body ?? "").slice(0, 200)} ${t.tags.join(" ")}`,
}));

const BADGE_ITEMS: SearchItem[] = BADGES.map((b) => ({
  id: `badge-${b.id}`,
  kind: "badge",
  title: b.name,
  subtitle: `${b.rarity} · ${b.criteria}`,
  href: "/achievements",
  keywords: b.description,
}));

const SETUP_SEARCH: SearchItem[] = SETUP_ITEMS.map((s) => ({
  id: `setup-${s.id}`,
  kind: "setup",
  title: s.title,
  subtitle: `${s.category} · ${s.estimatedMinutes}m`,
  href: "/setup",
  url: s.url,
  keywords: s.description,
}));

export const SEARCH_INDEX: SearchItem[] = [
  ...PAGES,
  ...TASKS,
  ...COURSE_ITEMS,
  ...TOOL_ITEMS,
  ...TIP_ITEMS,
  ...BADGE_ITEMS,
  ...SETUP_SEARCH,
];

/** Simple subsequence-fuzzy match scorer. Higher = better. */
export function scoreMatch(query: string, text: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) {
    // direct match: prefix > word-start > substring
    if (t.startsWith(q)) return 1000;
    if (t.includes(" " + q)) return 900;
    return 500;
  }
  // subsequence match
  let score = 0;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      score += 10 - Math.min(9, i - qi);
      qi++;
    }
  }
  return qi === q.length ? Math.max(1, score) : 0;
}

export function searchIndex(query: string, limit = 30): SearchItem[] {
  if (!query.trim()) {
    // Default ordering: pages first
    return SEARCH_INDEX.filter((i) => i.kind === "page").slice(0, limit);
  }
  const scored = SEARCH_INDEX.map((item) => {
    const titleScore = scoreMatch(query, item.title) * 3;
    const subtitleScore = item.subtitle ? scoreMatch(query, item.subtitle) : 0;
    const keywordScore = item.keywords ? scoreMatch(query, item.keywords) * 0.5 : 0;
    return { item, score: titleScore + subtitleScore + keywordScore };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored.map((r) => r.item);
}
