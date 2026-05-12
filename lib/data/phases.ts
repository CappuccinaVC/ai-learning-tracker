import type { PhaseData } from "./types";

export const PHASES: PhaseData[] = [
  {
    phase: 0,
    title: "Setup & Foundation",
    weeks: "Week 1",
    goal: "Mental model + working environment + daily learning ritual",
    color: "#94a3b8",
    icon: "Rocket",
  },
  {
    phase: 1,
    title: "AI Literacy & Fundamentals",
    weeks: "Weeks 2-5",
    goal: "Understand what AI/ML/LLMs actually are — without coding",
    color: "#60a5fa",
    icon: "BookOpen",
  },
  {
    phase: 2,
    title: "Prompt Engineering Mastery",
    weeks: "Weeks 6-9",
    goal: "Become elite at extracting value from any frontier model",
    color: "#22d3ee",
    icon: "Sparkles",
  },
  {
    phase: 3,
    title: "AI Tools Mastery",
    weeks: "Weeks 10-14",
    goal: "Power-user level on every category of AI tool",
    color: "#34d399",
    icon: "Wrench",
  },
  {
    phase: 4,
    title: "Technical Foundations",
    weeks: "Weeks 15-20",
    goal: "Python + APIs + notebooks; ship your first AI app",
    color: "#fbbf24",
    icon: "Code",
  },
  {
    phase: 5,
    title: "Applied AI & Building",
    weeks: "Weeks 21-28",
    goal: "RAG, agents, fine-tuning, evaluation, portfolio sprint",
    color: "#fb923c",
    icon: "Hammer",
  },
  {
    phase: 6,
    title: "Advanced & Expert Level",
    weeks: "Weeks 29-40",
    goal: "Transformers from scratch, multimodal, MLOps, open source",
    color: "#f87171",
    icon: "Crown",
  },
];

export const TRACKS = {
  main: { id: "main", name: "Main Roadmap", color: "#fb923c", icon: "Map" },
  image: { id: "image", name: "Image Generation", color: "#c084fc", icon: "Image" },
  video: { id: "video", name: "Video Generation", color: "#60a5fa", icon: "Film" },
  audio: { id: "audio", name: "Audio Generation", color: "#34d399", icon: "Music" },
} as const;
