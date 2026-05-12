"use client";
import { IMAGE_PLAN } from "@/lib/data/plan";
import { TrackPage } from "../track-page";

export default function ImagePage() {
  return (
    <TrackPage
      title="Image Generation Track"
      subtitle="12-week parallel specialization · Guided by Cookbook sections"
      gradient="from-purple-500 via-pink-500 to-rose-500"
      accent="text-purple-400"
      source="Cookbook §3.5"
      sourceHref="/cookbook#cookbook-img-3-5-json-prompting"
      plan={IMAGE_PLAN}
      promptingTip="JSON prompting + screenshot-to-JSON are elite operator moves. Start with Cookbook §3.5 for the universal image JSON schema."
    />
  );
}
