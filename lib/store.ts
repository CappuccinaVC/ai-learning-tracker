// Zustand store with localStorage persistence + optional Supabase sync
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { XP_VALUES, type XpReason, levelFromXp } from "./xp-engine";
import { todayKey, daysBetween } from "./utils";
import { getSupabase, isSupabaseEnabled } from "./supabase";

export type TaskStatus = "not_started" | "in_progress" | "done" | "mastered";

interface TaskState {
  status: TaskStatus;
  notes?: string;
  completedAt?: string;
  confidence?: number; // 0-100
}

interface XpLogEntry {
  id: string;
  reason: XpReason;
  amount: number;
  context: string;
  at: string;
}

export interface WeeklyReview {
  id: string;
  weekKey: string; // ISO week key like "2026-W19"
  at: string;
  wins: string;
  gaps: string;
  nextWeek: string;
  energy: number; // 1-5
  rating: number; // 1-5 self-rated week quality
}

interface AppState {
  // Identity
  userId: string | null;
  email: string | null;

  // Progress
  xp: number;
  tasks: Record<string, TaskState>;
  badges: string[]; // earned badge IDs
  lastActiveDate: string | null;
  streakDays: number;
  longestStreak: number;
  xpLog: XpLogEntry[];

  // Goals
  weeklyGoalHours: number;
  weeklyReviews: WeeklyReview[];

  // UI
  hydrated: boolean;

  // Actions
  setUser: (userId: string | null, email: string | null) => void;
  setTaskStatus: (taskId: string, status: TaskStatus, xpReason?: XpReason, context?: string) => void;
  setTaskNotes: (taskId: string, notes: string) => void;
  setTaskConfidence: (taskId: string, confidence: number) => void;
  addXp: (reason: XpReason, context: string, amountOverride?: number) => void;
  earnBadge: (badgeId: string) => void;
  checkIn: () => void; // daily check-in
  setWeeklyGoal: (hours: number) => void;
  saveWeeklyReview: (review: Omit<WeeklyReview, "id" | "at">) => void;
  resetAll: () => void;
  exportJson: () => string;
  importJson: (raw: string) => boolean;
}

const initialState = {
  userId: null,
  email: null,
  xp: 0,
  tasks: {},
  badges: [],
  lastActiveDate: null,
  streakDays: 0,
  longestStreak: 0,
  xpLog: [],
  weeklyGoalHours: 10,
  weeklyReviews: [] as WeeklyReview[],
  hydrated: false,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (userId, email) => set({ userId, email }),

      setTaskStatus: (taskId, status, xpReason, context) => {
        const prev = get().tasks[taskId];
        const newTask: TaskState = {
          ...prev,
          status,
          completedAt: status === "done" || status === "mastered" ? new Date().toISOString() : prev?.completedAt,
        };
        set((s) => ({ tasks: { ...s.tasks, [taskId]: newTask } }));

        // Award XP only on first transition to done/mastered
        if ((status === "done" || status === "mastered") && prev?.status !== "done" && prev?.status !== "mastered") {
          if (xpReason) get().addXp(xpReason, context ?? taskId);
        }
        // Trigger daily check-in
        get().checkIn();
      },

      setTaskNotes: (taskId, notes) => {
        set((s) => ({ tasks: { ...s.tasks, [taskId]: { ...(s.tasks[taskId] ?? { status: "not_started" as TaskStatus }), notes } } }));
      },

      setTaskConfidence: (taskId, confidence) => {
        set((s) => ({ tasks: { ...s.tasks, [taskId]: { ...(s.tasks[taskId] ?? { status: "not_started" as TaskStatus }), confidence } } }));
      },

      addXp: (reason, context, amountOverride) => {
        const amount = amountOverride ?? XP_VALUES[reason];
        const entry: XpLogEntry = {
          id: crypto.randomUUID(),
          reason,
          amount,
          context,
          at: new Date().toISOString(),
        };
        set((s) => ({ xp: s.xp + amount, xpLog: [entry, ...s.xpLog].slice(0, 500) }));
      },

      earnBadge: (badgeId) => {
        set((s) => (s.badges.includes(badgeId) ? s : { badges: [...s.badges, badgeId] }));
      },

      checkIn: () => {
        const today = todayKey();
        const last = get().lastActiveDate;
        if (last === today) return; // already checked in
        let newStreak = 1;
        if (last) {
          const gap = daysBetween(last, today);
          if (gap === 1) newStreak = get().streakDays + 1;
          else if (gap === 0) newStreak = get().streakDays;
          else newStreak = 1;
        }
        const longest = Math.max(get().longestStreak, newStreak);
        set({ lastActiveDate: today, streakDays: newStreak, longestStreak: longest });
        // award small XP for daily check-in
        if (last !== today) {
          get().addXp("daily_checkin", "Daily check-in");
        }
      },

      setWeeklyGoal: (hours) => set({ weeklyGoalHours: Math.max(1, Math.min(60, Math.round(hours))) }),

      saveWeeklyReview: (review) => {
        const entry: WeeklyReview = {
          ...review,
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
        };
        set((s) => ({ weeklyReviews: [entry, ...s.weeklyReviews].slice(0, 200) }));
        // Award XP for reflection
        get().addXp("weekly_capstone", `Weekly review · ${review.weekKey}`);
      },

      resetAll: () => set({ ...initialState, hydrated: true }),

      exportJson: () => {
        const { xp, tasks, badges, lastActiveDate, streakDays, longestStreak, xpLog, weeklyGoalHours, weeklyReviews } = get();
        return JSON.stringify(
          { version: 2, exportedAt: new Date().toISOString(), xp, tasks, badges, lastActiveDate, streakDays, longestStreak, xpLog, weeklyGoalHours, weeklyReviews },
          null,
          2
        );
      },

      importJson: (raw) => {
        try {
          const data = JSON.parse(raw);
          set({
            xp: data.xp ?? 0,
            tasks: data.tasks ?? {},
            badges: data.badges ?? [],
            lastActiveDate: data.lastActiveDate ?? null,
            streakDays: data.streakDays ?? 0,
            longestStreak: data.longestStreak ?? 0,
            xpLog: data.xpLog ?? [],
            weeklyGoalHours: data.weeklyGoalHours ?? 10,
            weeklyReviews: data.weeklyReviews ?? [],
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "ai-learning-tracker-v1",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);

// Derived selectors.
// IMPORTANT: do NOT export selectors that return fresh objects every call
// (e.g. { current, next, progress }) — Zustand's default Object.is comparison
// will trigger an infinite re-render loop. Subscribe to the primitive `xp`
// and derive via `levelFromXp(xp)` in the component instead.
export const selectCompletedTaskCount = (s: AppState) =>
  Object.values(s.tasks).filter((t) => t.status === "done" || t.status === "mastered").length;

// --- Optional Supabase sync (runs only if env vars set) ---
export async function syncToSupabase() {
  if (!isSupabaseEnabled) return;
  const sb = getSupabase();
  if (!sb) return;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  const state = useStore.getState();
  await sb.from("user_progress").upsert({
    user_id: user.id,
    data: {
      xp: state.xp,
      tasks: state.tasks,
      badges: state.badges,
      lastActiveDate: state.lastActiveDate,
      streakDays: state.streakDays,
      longestStreak: state.longestStreak,
      xpLog: state.xpLog.slice(0, 200),
    },
    updated_at: new Date().toISOString(),
  });
}

export async function loadFromSupabase() {
  if (!isSupabaseEnabled) return;
  const sb = getSupabase();
  if (!sb) return;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;
  const { data } = await sb.from("user_progress").select("data").eq("user_id", user.id).maybeSingle();
  if (data?.data) {
    useStore.getState().importJson(JSON.stringify(data.data));
  }
}
