// XP & level engine - shared logic for gamification

export interface Level {
  level: number;
  title: string;
  minXp: number;
  color: string;
}

export const LEVELS: Level[] = [
  { level: 1, title: "Curious Beginner", minXp: 0, color: "#94a3b8" },
  { level: 2, title: "Apprentice Operator", minXp: 100, color: "#60a5fa" },
  { level: 3, title: "Prompt Engineer", minXp: 300, color: "#22d3ee" },
  { level: 4, title: "Tool Wielder", minXp: 600, color: "#34d399" },
  { level: 5, title: "AI Coder", minXp: 1000, color: "#fbbf24" },
  { level: 6, title: "AI Builder", minXp: 1500, color: "#fb923c" },
  { level: 7, title: "AI Operator", minXp: 2200, color: "#f87171" },
  { level: 8, title: "Modality Specialist", minXp: 3000, color: "#c084fc" },
  { level: 9, title: "Multi-Modal Operator", minXp: 4000, color: "#e879f9" },
  { level: 10, title: "Elite AI Operator", minXp: 5500, color: "#fde047" },
];

export function levelFromXp(xp: number): { current: Level; next: Level | null; progress: number } {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.minXp) current = l;
  const nextIdx = LEVELS.findIndex((l) => l.level === current.level) + 1;
  const next = nextIdx < LEVELS.length ? LEVELS[nextIdx] : null;
  const progress = next
    ? Math.min(100, Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100))
    : 100;
  return { current, next, progress };
}

// XP per task category
export const XP_VALUES = {
  setup_item: 10,
  read_article: 10,
  watch_video_short: 15,
  watch_video_long: 30,
  course_short: 50,
  course_major: 200,
  mini_project: 100,
  weekly_capstone: 250,
  phase_capstone: 500,
  flagship_project: 1000,
  prompt_logged: 5,
  community_post: 20,
  daily_checkin: 15,
} as const;

export type XpReason = keyof typeof XP_VALUES;
