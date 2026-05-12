export type Track = "main" | "image" | "video" | "audio";
export type Priority = "essential" | "recommended" | "optional";
export type CostType = "free" | "freemium" | "paid" | "open_source";

export interface Tool {
  id: string;
  name: string;
  category: string;
  track: Track[];
  cost: CostType;
  priceNote?: string;
  url: string;
  install?: string; // command line or instructions
  description: string;
  priority: Priority;
  whenPhase: number; // earliest phase to install
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  url: string;
  cost: CostType;
  priceNote?: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Beginner-Intermediate" | "Intermediate-Advanced";
  track: Track[];
  whenPhase: number;
  why: string;
  xp: number;
}

export interface TaskResource {
  title: string;
  url: string;
  type?: "course" | "video" | "article" | "docs" | "tool" | "playlist" | "github" | "paper";
  note?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  xpReason: keyof typeof import("../xp-engine").XP_VALUES;
  link?: string;
  /** One-line outcome of finishing this task */
  goal?: string;
  /** Concrete actions, in order */
  details?: string[];
  /** How you know you've actually completed it */
  successCriteria?: string[];
  /** Multiple links: courses, videos, docs */
  resources?: TaskResource[];
  /** Estimated minutes (for the Today widget) */
  estMin?: number;
  /** Optional Cookbook section id (matches CookbookSection.id) — renders the section inline in the task */
  cookbookSection?: string;
}

export interface WeekPlan {
  weekNumber: number; // 1..40
  phase: number;
  title: string;
  goal: string;
  estimatedHours: number;
  tasks: Task[];
}

export interface PhaseData {
  phase: number;
  title: string;
  weeks: string; // "Weeks 2-5"
  goal: string;
  color: string;
  icon: string;
}

export interface SetupItem {
  id: string;
  category: string;
  title: string;
  description: string;
  url?: string;
  command?: string;
  estimatedMinutes: number;
  /** One-line outcome of finishing this step. */
  goal?: string;
  /** Long-form why this matters / what to do / how to think about it. Markdown-light. */
  note?: string;
  /** Concrete steps in order. */
  steps?: string[];
  /** Self-check questions. */
  successCriteria?: string[];
  /** Copy-pastable template (e.g. an Obsidian daily-note template). */
  template?: string;
  templateLanguage?: "markdown" | "text" | "shell" | "json";
  /** Extra resources. */
  resources?: TaskResource[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  rarity: "common" | "rare" | "epic" | "legendary";
  criteria: string; // human readable
  // unlockCheck logic in code
}
