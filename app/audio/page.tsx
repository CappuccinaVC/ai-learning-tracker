"use client";
import { AUDIO_PLAN } from "@/lib/data/plan";
import { TrackPage } from "../track-page";

export default function AudioPage() {
  return (
    <TrackPage
      title="Audio Generation Track"
      subtitle="12-week parallel specialization · Guided by Cookbook sections"
      gradient="from-emerald-500 via-teal-500 to-cyan-500"
      accent="text-emerald-400"
      source="Cookbook §3.1b"
      sourceHref="/cookbook#cookbook-aud-3-1-structure-tags"
      plan={AUDIO_PLAN}
      promptingTip="Music = structure tags [Verse]/[Chorus]/[Bridge] + style box. Voice = ElevenLabs v3 audio tags + SSML for prosody. Screenshot→song JSON for inspiration."
    />
  );
}
