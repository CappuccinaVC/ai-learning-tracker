"use client";
import { VIDEO_PLAN } from "@/lib/data/plan";
import { TrackPage } from "../track-page";

export default function VideoPage() {
  return (
    <TrackPage
      title="Video Generation Track"
      subtitle="12-week parallel specialization · Guided by Cookbook sections"
      gradient="from-blue-500 via-cyan-500 to-teal-500"
      accent="text-blue-400"
      source="Cookbook §3.3"
      sourceHref="/cookbook#cookbook-vid-3-3-json-schema"
      plan={VIDEO_PLAN}
      promptingTip="JSON prompts are the de facto standard for Veo 3.1. Multi-shot continuity locks character/lighting; screenshot→JSON→next-shot is the chain trick."
    />
  );
}
