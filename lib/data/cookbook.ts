/**
 * COOKBOOK — In-app reference distilled from the four mastery files:
 *   AI_Mastery_Roadmap.md
 *   AI_Image_Generation_Mastery.md
 *   AI_Video_Generation_Mastery.md
 *   AI_Audio_Generation_Mastery.md
 *
 * Each section is a self-contained reference card you can read inside the app.
 * Tasks may link to a section via Task.cookbookSection (matches CookbookSection.id).
 */

import type { Track } from "./types";

export type CookbookBlock =
  | { kind: "para"; text: string }
  | { kind: "list"; ordered?: boolean; items: string[] }
  | { kind: "code"; language: "json" | "text" | "shell" | "xml"; code: string; title?: string }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "callout"; tone: "tip" | "info" | "warn"; title?: string; text: string }
  | { kind: "subheading"; text: string };

export interface CookbookSection {
  id: string;
  track: Track;
  number: string;          // "3.1"
  title: string;
  summary: string;
  blocks: CookbookBlock[];
  source: string;          // "AI_Image_Generation_Mastery.md"
  tags?: string[];
}

// Re-usable JSON snippets ------------------------------------------------------------------

const IMAGE_JSON_SCHEMA = `{
  "subject": {
    "primary": "a 35-year-old woman with auburn hair in a forest-green wool coat",
    "expression": "calm, looking slightly off-camera",
    "pose": "standing, hands in pockets, weight on left leg"
  },
  "setting": {
    "location": "rain-soaked Tokyo backstreet at dusk",
    "details": ["wet asphalt reflecting neon", "sparse foot traffic", "vending machine to her left"]
  },
  "style": {
    "medium": "35mm color photograph",
    "film_stock": "Kodak Portra 400",
    "rendering": "shallow depth of field, slight grain, color-graded teal-and-orange"
  },
  "camera": {
    "framing": "medium shot, three-quarter body",
    "lens_mm": 50,
    "aperture": "f/1.8",
    "angle": "eye-level",
    "focus_point": "her eyes"
  },
  "lighting": {
    "key": "warm sodium streetlight from camera-right",
    "fill": "cool blue ambient from neon signage",
    "ratio": "3:1",
    "mood": "melancholy, contemplative"
  },
  "color_palette": ["deep teal", "burnt orange", "moss green", "wet black"],
  "negatives": ["cartoonish", "low-detail", "extra fingers", "watermark", "text artifacts"],
  "aspect_ratio": "3:2",
  "model_hint": "flux-1.1-pro"
}`;

const VIDEO_JSON_SCHEMA = `{
  "scene": "A 35-year-old woman in a forest-green wool coat walking through a rain-soaked Tokyo backstreet at dusk",
  "subject":  { "primary": "35yo woman, auburn hair tied back, forest-green wool coat, leather boots", "expression": "calm, contemplative", "action": "walks slowly toward camera, hands in pockets, light steam from breath" },
  "setting":  { "location": "narrow Tokyo backstreet at dusk, light rain", "details": ["wet asphalt reflecting neon signage", "vending machine glow", "puddles", "soft fog", "single overhead streetlight"] },
  "style":    { "look": "35mm cinematic film", "stock_or_render": "Kodak Vision3 500T", "grade": "teal-and-orange, slight grain, film halation in highlights" },
  "camera":   { "framing": "medium shot, three-quarter body, slowly pushing in", "lens_mm": 35, "aperture": "f/2.0", "angle": "eye-level, slight low angle", "movement": "slow dolly-in, 3 seconds", "focus": "rack focus from streetlight to her eyes at second 2" },
  "lighting": { "key": "warm sodium streetlight from camera-right", "fill": "cool blue ambient from neon signage", "ratio": "3:1", "atmosphere": "light rain, faint haze, volumetric streetlight", "mood": "melancholy, contemplative" },
  "color_palette": ["deep teal", "burnt orange", "moss green", "wet black"],
  "audio":    { "dialogue": null, "ambient": "light rain on pavement, distant traffic", "sfx": ["soft footsteps on wet asphalt", "occasional vending machine hum"], "music": "sparse minor-key piano, building slowly", "sync_required": false },
  "duration_s": 8,
  "aspect_ratio": "2.35:1",
  "fps": 24,
  "seed": 47291,
  "model_hint": "veo-3.1-standard"
}`;

const VOICE_JSON_SCHEMA = `{
  "scene": "Two friends at a kitchen counter, late morning",
  "voices": [
    {
      "id": "speaker_a",
      "name": "Maya",
      "voice_id": "elevenlabs_voice_id_or_clone_ref",
      "default_emotion": "warm, slightly tired",
      "pace": "medium"
    },
    {
      "id": "speaker_b",
      "name": "Daniel",
      "voice_id": "elevenlabs_voice_id_or_clone_ref",
      "default_emotion": "low energy, contemplative",
      "pace": "slow"
    }
  ],
  "lines": [
    { "speaker": "speaker_a", "text": "Did you sleep at all?", "tags": ["soft"] },
    { "speaker": "speaker_b", "text": "[sighs] Not really.", "tags": ["tired"] }
  ],
  "ambient": "quiet apartment, faint espresso machine",
  "output_format": "wav_44100"
}`;

// ============================================================================================
// COOKBOOK SECTIONS
// ============================================================================================

export const COOKBOOK: CookbookSection[] = [

  // ============================ MAIN ============================

  {
    id: "main-prompt-anatomy",
    track: "main",
    number: "P2.1",
    title: "The 6-part anatomy of a great prompt",
    summary: "Every solid LLM prompt names six layers. Memorize this and you'll outperform 95% of users.",
    source: "AI_Mastery_Roadmap.md",
    tags: ["prompting", "fundamentals"],
    blocks: [
      { kind: "para", text: "Every well-formed LLM prompt names six layers, in roughly this order:" },
      {
        kind: "list",
        ordered: true,
        items: [
          "**Role** — who the model is being. *e.g. \"You are a senior cinematographer.\"*",
          "**Task** — the single, specific job to do.",
          "**Context** — the inputs / data / constraints.",
          "**Examples** — 1-3 input/output pairs (few-shot).",
          "**Format** — exact output shape (Markdown, JSON schema, bullet list).",
          "**Tone / style** — concise, formal, witty, etc.",
        ],
      },
      {
        kind: "callout",
        tone: "tip",
        title: "The instant upgrade",
        text: "If you only add ONE thing to an underperforming prompt — add 2-3 examples. Few-shot beats every other technique 80% of the time.",
      },
      {
        kind: "code",
        language: "text",
        title: "Skeleton you can paste",
        code: `Role: You are <persona>.
Task: <one specific job>.
Context: <inputs / constraints / preferences>.
Examples:
  Input: <ex1 input>
  Output: <ex1 result>
  Input: <ex2 input>
  Output: <ex2 result>
Output format: <markdown / JSON schema / bullet list / etc.>
Tone: <concise / formal / playful>`,
      },
    ],
  },

  {
    id: "main-temperature",
    track: "main",
    number: "P2.2",
    title: "Temperature & sampling cheat-sheet",
    summary: "Lower = deterministic. Higher = diverse. Pick once per task, not per project.",
    source: "AI_Mastery_Roadmap.md",
    tags: ["parameters", "fundamentals"],
    blocks: [
      {
        kind: "table",
        head: ["Temperature", "Use for"],
        rows: [
          ["0.0", "Code, JSON, deterministic extraction, agents"],
          ["0.3 – 0.5", "Analysis, summarization, classification"],
          ["0.7 – 0.9", "Creative writing, brainstorming first drafts"],
          ["1.0 – 1.3", "Wild idea generation, surprise factor"],
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Multi-step pipelines",
        text: "For agents and chained calls, use temperature 0 unless you specifically need variety. You almost never do.",
      },
    ],
  },

  {
    id: "main-rag-vs-finetune",
    track: "main",
    number: "P4.1",
    title: "RAG vs fine-tuning — decision rule",
    summary: "RAG for facts that change. Fine-tune for style/format that doesn't.",
    source: "AI_Mastery_Roadmap.md",
    tags: ["rag", "fine-tuning", "decision"],
    blocks: [
      { kind: "para", text: "Two completely different jobs. People mistake them constantly." },
      {
        kind: "table",
        head: ["You want…", "Approach"],
        rows: [
          ["Up-to-date facts (docs, knowledge bases, news)", "**RAG**"],
          ["A consistent tone, voice, JSON format, or domain dialect", "**Fine-tune** (or few-shot first)"],
          ["Cite sources / show provenance", "**RAG**"],
          ["Make a small model behave like a big one", "**Fine-tune** (distillation)"],
          ["A new SKILL the base model can't do", "**Fine-tune**"],
        ],
      },
      {
        kind: "callout",
        tone: "tip",
        title: "Order of operations",
        text: "Always try: (1) prompting → (2) few-shot → (3) RAG → (4) fine-tune. Fine-tuning is the last resort, not the first.",
      },
    ],
  },

  {
    id: "main-eval-first",
    track: "main",
    number: "P2.3",
    title: "Build the eval BEFORE the prompt",
    summary: "20 input/expected pairs is the cheapest unfair advantage in prompt engineering.",
    source: "AI_Mastery_Roadmap.md",
    tags: ["eval", "promptfoo"],
    blocks: [
      { kind: "para", text: "Most people iterate on prompts by vibes. Elite operators build a test set first." },
      {
        kind: "list",
        ordered: true,
        items: [
          "Write 20 (input, expected output) pairs in a spreadsheet or YAML.",
          "Set up Promptfoo (free OSS eval tool) or a small grader script.",
          "Run any prompt against the set; get a numeric score.",
          "Now you can A/B prompts in seconds — no more guessing.",
        ],
      },
      {
        kind: "callout",
        tone: "tip",
        title: "ROI",
        text: "20 pairs takes 30 minutes once. It saves you hours every time you iterate the prompt.",
      },
    ],
  },

  // ============================ IMAGE ============================

  {
    id: "img-3-1-anatomy",
    track: "image",
    number: "3.1",
    title: "The universal image prompt anatomy",
    summary: "Six layers, in order. Memorize once and use forever.",
    source: "AI_Image_Generation_Mastery.md",
    tags: ["prompting", "fundamentals"],
    blocks: [
      { kind: "para", text: "Every great image prompt names **six layers**, roughly in this order:" },
      {
        kind: "list",
        ordered: true,
        items: [
          "**Subject** — who/what is the image of.",
          "**Action / pose** — what they are doing.",
          "**Setting / environment** — where.",
          "**Style / medium** — photo, oil painting, 3D render, cinematic still, etc.",
          "**Camera / framing / lens** — close-up, wide, 35 mm, low angle, dolly.",
          "**Lighting + mood + color** — golden hour, neon, chiaroscuro, pastel.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Plus technical modifiers",
        text: "high detail, 8K, sharp focus, depth of field, bokeh — used differently across models. Midjourney v7 cares less about these than older SDXL did.",
      },
      {
        kind: "callout",
        tone: "tip",
        title: "Drill",
        text: "For your first 20 generations this week, write each prompt with all six layers explicitly named. Even when it feels redundant. Muscle memory in 3 days.",
      },
    ],
  },

  {
    id: "img-3-2-style-references",
    track: "image",
    number: "3.2",
    title: "Style references that work in any model",
    summary: "The vocabulary that consistently moves the needle across Flux, MJ, SDXL, Imagen.",
    source: "AI_Image_Generation_Mastery.md",
    tags: ["vocabulary", "style"],
    blocks: [
      { kind: "subheading", text: "Photographic" },
      {
        kind: "list",
        items: [
          "shot on Hasselblad H6D",
          "Kodak Portra 400 film grain",
          "shallow depth of field f/1.4",
          "soft window light",
        ],
      },
      { kind: "subheading", text: "Cinematic" },
      {
        kind: "list",
        items: [
          "anamorphic lens flare",
          "Roger Deakins lighting",
          "Wes Anderson symmetry",
        ],
      },
      { kind: "subheading", text: "Illustrated" },
      {
        kind: "list",
        items: [
          "Studio Ghibli style",
          "1980s Moebius comic linework",
          "James Jean flat color",
        ],
      },
      { kind: "subheading", text: "3D / Product" },
      {
        kind: "list",
        items: [
          "octane render, studio lighting, seamless white background",
          "Blender Cycles, ACES tonemapping",
        ],
      },
    ],
  },

  {
    id: "img-3-4-model-tips",
    track: "image",
    number: "3.4",
    title: "Model-specific prompting tips",
    summary: "Different models reward different prompt styles. Match the model to its dialect.",
    source: "AI_Image_Generation_Mastery.md",
    tags: ["models", "midjourney", "flux", "ideogram", "sdxl"],
    blocks: [
      { kind: "subheading", text: "Midjourney v7" },
      {
        kind: "list",
        items: [
          "Use **personalization** (`/settings`) — the model learns your taste over time.",
          "Use the `--style raw` flag for less Midjourney 'house style'.",
          "Aspect ratios: `--ar 16:9`, `--ar 2:3`.",
          "Stylize: `--s 0` (literal) → `--s 1000` (very stylized).",
          "`--cref [URL]` for character reference; `--sref [URL]` for style reference.",
        ],
      },
      { kind: "subheading", text: "Flux (dev / Pro / 2)" },
      {
        kind: "list",
        items: [
          "Loves **long natural-language prompts**. Write paragraphs, not keywords.",
          "Guidance scale (Flux's CFG) ~ 3.5 for dev, lower for Schnell.",
          "Skip negative prompts.",
        ],
      },
      { kind: "subheading", text: "GPT Image 2 (ChatGPT)" },
      {
        kind: "list",
        items: [
          "Best understanding of **complex compositional instructions** — write what you want in plain English.",
          "Use **multi-turn edits**: \"make the shirt blue\", \"now add a coffee cup in the foreground\".",
        ],
      },
      { kind: "subheading", text: "Ideogram 3" },
      {
        kind: "list",
        items: [
          "Put text inside quotes: `A poster with the title \"SUMMER NIGHTS\" in retro neon`.",
          "Describe text style explicitly.",
        ],
      },
      { kind: "subheading", text: "SDXL / Flux local" },
      {
        kind: "list",
        items: [
          "**Tag-style** still works for SDXL fine-tunes (Pony, Illustrious).",
          "Flux local = paragraph natural language.",
        ],
      },
    ],
  },

  {
    id: "img-3-5-json-prompting",
    track: "image",
    number: "3.5",
    title: "JSON prompting (the elite operator skill)",
    summary: "Structured schema instead of free-form text. Reusable, A/B-testable, agent-friendly.",
    source: "AI_Image_Generation_Mastery.md",
    tags: ["json", "schema", "agents"],
    blocks: [
      { kind: "para", text: "JSON prompting means using a **structured schema** instead of free-form text. It works exceptionally well with:" },
      {
        kind: "list",
        items: [
          "**Veo 3 / Veo 3.1** (video — see Video track)",
          "**Imagen 4 / Nano Banana 2 / Gemini-driven workflows**",
          "**GPT Image 2** (when prompted via API/agent)",
          "**Any LLM-driven multi-step pipeline**",
        ],
      },
      { kind: "subheading", text: "Why it works" },
      {
        kind: "list",
        items: [
          "Forces you to specify every layer explicitly.",
          "Reusable / templatable.",
          "Plays well with LLM agents that generate prompts for image models.",
          "Easy to A/B test (change one field at a time).",
        ],
      },
      { kind: "subheading", text: "Universal image JSON schema" },
      { kind: "code", language: "json", code: IMAGE_JSON_SCHEMA, title: "Drop-in template — fill the fields and compile" },
      { kind: "subheading", text: "How to use it" },
      {
        kind: "callout",
        tone: "tip",
        title: "Pattern A — Compile JSON to a text prompt",
        text: "Paste your JSON into ChatGPT/Claude with: 'You are a prompt compiler. Take the JSON below and produce a single dense natural-language image prompt suitable for [Midjourney v7 / Flux 1.1 Pro / GPT Image 2]. Order: subject → action → setting → camera → lighting → color → style. Output ONLY the prompt.' Then paste the result into your image model.",
      },
      {
        kind: "callout",
        tone: "tip",
        title: "Pattern B — Pass JSON directly to API/Agent",
        text: "For Imagen / Gemini-driven pipelines / your own n8n workflow, you can pass JSON straight to a prompt-translator agent that fills missing fields and emits the final prompt.",
      },
      {
        kind: "callout",
        tone: "tip",
        title: "Pattern C — JSON as version-controlled prompt source",
        text: "Keep all your prompts as JSON files in `prompts/` in a Git repo. Each JSON has a UUID, model_hint, and metadata (date, score 1–5, output paths). The elite operator workflow.",
      },
      { kind: "subheading", text: "Hands-on drill — plain text vs JSON (same scene)" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Pick one scene and lock it (same subject, same setting, same mood).",
          "Write one plain text prompt for that scene.",
          "Write one JSON prompt using the schema above for the exact same scene.",
          "Generate both on the same model with the same aspect ratio.",
          "Score each output from 1-5 on composition control, style fidelity, and iteration speed.",
          "Do one revision pass where you only edit 2 JSON fields (for example, `camera` and `lighting`) and compare revision quality vs editing plain text.",
        ],
      },
      {
        kind: "code",
        language: "text",
        title: "Plain text baseline example",
        code: "Cinematic portrait of a woman in a rain-soaked Tokyo alley at dusk, medium shot, 50mm lens, shallow depth of field, warm streetlight key and cool neon fill, contemplative mood, teal-orange grade, fine film grain.",
      },
      {
        kind: "table",
        head: ["Metric", "Plain text", "JSON"],
        rows: [
          ["Composition control", "1-5", "1-5"],
          ["Style/lighting fidelity", "1-5", "1-5"],
          ["Ease of iterative edits", "1-5", "1-5"],
          ["Overall winner", "yes/no", "yes/no"],
        ],
      },
    ],
  },

  {
    id: "img-3-6-screenshot-to-json",
    track: "image",
    number: "3.6",
    title: "Screenshot → JSON (the secret weapon)",
    summary: "Steal the lighting / framing / mood from any image you love. Replace the subject. Generate.",
    source: "AI_Image_Generation_Mastery.md",
    tags: ["workflow", "vision"],
    blocks: [
      { kind: "para", text: "You see an image you love (a movie still, a product photo, a piece of art). You want to recreate the **structure / lighting / mood** with your own subject. Here's the workflow:" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Take a screenshot or download the reference image.",
          "Open Gemini 2.5 Pro / Claude Opus 4.5 / GPT-5.4 (any vision-capable LLM).",
          "Run the prompt below.",
          "Modify the `subject` field — replace with your subject.",
          "Compile to a final prompt (Pattern A, §3.5) → generate.",
        ],
      },
      {
        kind: "code",
        language: "text",
        title: "Vision prompt — paste the image and this text",
        code: `You are an expert visual prompt engineer.
Analyze the attached image and produce a JSON object describing it
using this schema (fill every field; infer when uncertain):

{
  "subject": { "primary", "expression", "pose" },
  "setting": { "location", "details" },
  "style":   { "medium", "film_stock_or_render", "rendering" },
  "camera":  { "framing", "lens_mm", "aperture", "angle" },
  "lighting": { "key", "fill", "ratio", "mood" },
  "color_palette": [],
  "aspect_ratio": ""
}

Output ONLY the JSON. No commentary.`,
      },
      {
        kind: "callout",
        tone: "info",
        title: "Why this works",
        text: "You inherit a professional photographer's lighting, framing, and color decisions for free. The LLM acts as a translator between visual taste and text.",
      },
      { kind: "subheading", text: "Reverse trick — image-to-prompt tools" },
      {
        kind: "table",
        head: ["Tool", "What it does"],
        rows: [
          ["**CLIP Interrogator** (free HF Space)", "Best for SDXL-style tag prompts"],
          ["**Florence-2** (Microsoft)", "Good captions; runs locally"],
          ["**JoyCaption** (open source)", "Modern detailed image captioner"],
          ["**Gemini / Claude / GPT vision**", "Most accurate; use via the JSON pattern above"],
        ],
      },
    ],
  },

  {
    id: "img-3-7-negative-space",
    track: "image",
    number: "3.7",
    title: "Negative space — what NOT to write",
    summary: "Lazy modifiers that modern models ignore (or actively dislike). Stop typing them.",
    source: "AI_Image_Generation_Mastery.md",
    tags: ["pitfalls", "vocabulary"],
    blocks: [
      { kind: "subheading", text: "Lazy filler — modern models ignore" },
      { kind: "list", items: ["beautiful", "amazing", "masterpiece", "high quality", "best quality"] },
      { kind: "subheading", text: "Counter-productive" },
      {
        kind: "list",
        items: [
          "Long resolution lists like \"4K 8K 16K HDR\" — adds noise without resolution gain.",
          "Generic \"photorealistic, hyperrealistic\" on Flux/MJ — they already are.",
          "Random Tokyo/cyberpunk filler when not relevant — biases composition unpredictably.",
        ],
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Negative prompts",
        text: "Mostly an SDXL-era thing. Flux barely needs them. Midjourney uses `--no` instead. Don't paste a giant negative list out of habit.",
      },
    ],
  },

  // ============================ VIDEO ============================

  {
    id: "vid-3-1-anatomy",
    track: "video",
    number: "3.1",
    title: "The universal video prompt anatomy",
    summary: "Eight layers. Same six as image, plus audio and constraints.",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["prompting", "fundamentals"],
    blocks: [
      { kind: "para", text: "A great video prompt names **eight layers**, roughly in this order:" },
      {
        kind: "list",
        ordered: true,
        items: [
          "**Subject** — who/what.",
          "**Action** — what they do.",
          "**Setting** — where and when.",
          "**Camera** — framing, angle, lens, movement.",
          "**Lighting + mood**.",
          "**Style / look** — film stock, render style, color grade.",
          "**Audio** *(Veo 3.1 only)* — dialogue, sfx, ambient, music.",
          "**Constraints** — duration, aspect ratio, seed.",
        ],
      },
    ],
  },

  {
    id: "vid-3-2-why-json",
    track: "video",
    number: "3.2",
    title: "Why JSON prompting dominates for video",
    summary: "Especially for Veo 3.1. Five reasons it became the standard in 2025-26.",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["json", "veo"],
    blocks: [
      { kind: "para", text: "JSON prompts are the de facto standard for Veo 3 and Veo 3.1 because:" },
      {
        kind: "list",
        items: [
          "Video models weight earlier tokens heavily; JSON forces \"what\" before \"how\".",
          "Atomic scenes are easier to chain when each is a JSON object.",
          "LLMs can generate, validate, and remix JSON prompts deterministically.",
          "Multi-shot continuity (lighting, character) is easier when fields persist across scenes.",
          "Tooling (Gemini prompt-system agents, n8n converters, PromptVeo3 library) is JSON-native.",
        ],
      },
    ],
  },

  {
    id: "vid-3-3-json-schema",
    track: "video",
    number: "3.3",
    title: "Universal video JSON schema",
    summary: "Use for Veo, Kling, Runway, Pika, or open-source. Compile to text for non-Veo models.",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["json", "schema"],
    blocks: [
      { kind: "code", language: "json", code: VIDEO_JSON_SCHEMA, title: "Drop-in video schema" },
      {
        kind: "callout",
        tone: "tip",
        title: "Pass straight to Veo, compile for others",
        text: "Veo 3.1 accepts JSON directly. For Kling / Runway / Pika, use the JSON → text compiler in §3.6 first.",
      },
    ],
  },

  {
    id: "vid-3-4-multishot-continuity",
    track: "video",
    number: "3.4",
    title: "Multi-shot continuity — chaining clips",
    summary: "Lock the character, lighting, and grade across every shot. Vary only action and camera.",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["continuity", "workflow"],
    blocks: [
      { kind: "para", text: "To keep the **same character / lighting / world** across multiple Veo or Kling clips, lock these JSON fields **identically** across every shot:" },
      {
        kind: "list",
        items: [
          "`subject.primary` — visual description must be word-for-word identical.",
          "`style.*` — entire object.",
          "`lighting.key`, `lighting.fill`, `lighting.ratio`, `lighting.mood`.",
          "`color_palette`.",
          "`audio.ambient`, `audio.music`.",
        ],
      },
      { kind: "para", text: "Then add a continuity hint in `scene`:" },
      {
        kind: "code",
        language: "json",
        code: `"scene": "Continuing from previous shot. Same woman, same coat, same lighting and grade. Now she stops at a vending machine and selects a hot coffee."`,
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Common failure",
        text: "Slightly different wording in `subject.primary` between shots = different character. Copy-paste, don't retype.",
      },
    ],
  },

  {
    id: "vid-3-5-screenshot-to-json",
    track: "video",
    number: "3.5",
    title: "Screenshot → JSON (video)",
    summary: "Same as image §3.6, but for video — extract structure from a film still or your last frame.",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["workflow", "vision"],
    blocks: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Take a screenshot — movie still, reference frame, or the last frame of your previous Veo clip.",
          "Open Gemini 2.5 Pro or Claude Opus 4.5 (vision-capable).",
          "Paste image + the prompt below.",
          "**For continuation**: keep most fields, change `subject.action` and `camera.movement`.",
          "**For new project**: change `subject.primary` and `setting`.",
          "Pass JSON to a prompt compiler (§3.6) and run.",
        ],
      },
      {
        kind: "code",
        language: "text",
        title: "Vision prompt",
        code: `You are a senior cinematographer turning a single film still into a JSON description
suitable for AI video generation (Veo 3.1 / Kling 3 / Seedance).

Analyze the attached frame and emit JSON using this schema (fill every field; infer when uncertain):

{
  "scene": "",
  "subject": { "primary", "expression", "action" },
  "setting": { "location", "details": [] },
  "style":   { "look", "stock_or_render", "grade" },
  "camera":  { "framing", "lens_mm", "aperture", "angle", "movement", "focus" },
  "lighting":{ "key", "fill", "ratio", "atmosphere", "mood" },
  "color_palette": [],
  "audio":   { "ambient", "sfx": [], "music", "sync_required" },
  "duration_s": 8,
  "aspect_ratio": "",
  "fps": 24
}

Output ONLY the JSON. No commentary.`,
      },
    ],
  },

  {
    id: "vid-3-6-json-compiler",
    track: "video",
    number: "3.6",
    title: "JSON → text compiler and A/B protocol",
    summary: "When a model doesn't accept JSON directly, compile JSON into dense prompt text and compare objectively.",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["json", "compiler", "workflow"],
    blocks: [
      { kind: "para", text: "Use this section when you want to run the same scene on Kling/Runway/Pika from a JSON source of truth." },
      {
        kind: "code",
        language: "text",
        title: "JSON -> text compiler prompt",
        code: `You are a prompt compiler for AI video models.
Given a scene JSON object, generate ONE dense natural-language video prompt.

Rules:
- Preserve subject identity and wardrobe exactly.
- Keep camera/lens/movement explicit.
- Keep lighting, color palette, and mood explicit.
- Include audio intent (dialogue/sfx/music) if present.
- Keep constraints (duration, aspect ratio, fps) at the end.
- Output ONLY the final prompt text.

JSON:
<paste your JSON here>`,
      },
      { kind: "subheading", text: "A/B protocol — plain text vs JSON-first" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Pick 5 scenes (human action, animal, nature, abstract, dialogue).",
          "For each scene, generate clip A from plain text directly.",
          "Generate clip B by writing JSON first, then compiling with the prompt above.",
          "Keep model, duration, and aspect ratio identical for A and B.",
          "Score A/B on motion realism, prompt fidelity, camera accuracy, and continuity-readiness.",
          "Adopt the winner as your default workflow for that model.",
        ],
      },
      {
        kind: "table",
        head: ["Criterion", "Clip A (plain)", "Clip B (JSON-first)"],
        rows: [
          ["Motion realism", "1-5", "1-5"],
          ["Prompt fidelity", "1-5", "1-5"],
          ["Camera control", "1-5", "1-5"],
          ["Ready for multi-shot continuity", "yes/no", "yes/no"],
        ],
      },
    ],
  },

  {
    id: "vid-3-7-veo-specifics",
    track: "video",
    number: "3.7",
    title: "Veo 3.1 specifics",
    summary: "Audio prompting, dialogue formatting, tier choice, length limits.",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["veo", "google"],
    blocks: [
      {
        kind: "list",
        items: [
          "**Audio prompting**: include `audio.dialogue`, `audio.sfx`, `audio.music` — Veo will generate synchronized audio.",
          "**Dialogue**: keep it short and quoted: `\"He says: 'I should have called yesterday.'\"`.",
          "**Lyrics in songs**: Veo will sing them; works well for short jingles.",
          "**Negative audio**: specify `\"audio.constraints\": \"no music, only ambient\"`.",
          "**Tier choice**: Lite (cheap, less quality) → Fast → Standard → Pro. Iterate on Lite/Fast, finalize on Standard/Pro.",
          "**Length**: 8 seconds is the safe upper bound per clip; chain clips for longer.",
        ],
      },
    ],
  },

  {
    id: "vid-3-8-kling-specifics",
    track: "video",
    number: "3.8",
    title: "Kling 3.0 specifics",
    summary: "Use the camera control panel over written camera prompts. Lock subject with reference image.",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["kling"],
    blocks: [
      {
        kind: "list",
        items: [
          "**Camera control panel** (in Kling UI): explicit dolly/pan/tilt sliders. Use them; written camera prompts are weaker than the panel.",
          "**Character consistency**: upload a reference image, lock subject, then write only the action/setting.",
          "**Motion strength**: slider 0–1. Default 0.5. Higher = more wild motion (often degrades quality).",
        ],
      },
    ],
  },

  {
    id: "vid-3-9-runway-specifics",
    track: "video",
    number: "3.9",
    title: "Runway Gen-4.5 specifics",
    summary: "References tab is Runway's killer feature. Act-One drives a still with your face.",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["runway"],
    blocks: [
      {
        kind: "list",
        items: [
          "**References tab**: upload up to 3 reference images for subject/style/setting. This is Runway's strongest feature.",
          "**Act-One**: drive a still character with your facial performance video.",
          "**Camera Control**: explicit camera moves with strength slider.",
        ],
      },
    ],
  },

  // ============================ AUDIO ============================

  {
    id: "aud-3-1-anatomy",
    track: "audio",
    number: "3.1",
    title: "Universal music prompt anatomy",
    summary: "Seven layers for any music gen prompt. Genre, mood, tempo, instruments, vocals, era, reference.",
    source: "AI_Audio_Generation_Mastery.md",
    tags: ["prompting", "fundamentals", "suno", "udio"],
    blocks: [
      { kind: "para", text: "A great music prompt names **seven layers**:" },
      {
        kind: "list",
        ordered: true,
        items: [
          "**Genre / sub-genre** — \"indie folk\", \"lo-fi hip-hop\", \"synthwave\", \"afrobeats\", \"bossa nova\".",
          "**Mood / emotion** — \"melancholic\", \"triumphant\", \"intimate\", \"anthemic\".",
          "**Tempo** — \"85 BPM\", \"uptempo\", \"downtempo\".",
          "**Instrumentation** — \"acoustic guitar, upright bass, brushed drums\".",
          "**Vocal style** — \"female alto, breathy, intimate\" / \"male tenor, rasp, anthemic\" / \"instrumental only\".",
          "**Production / era** — \"1970s analog warmth\", \"modern pop polish\", \"lo-fi tape hiss\".",
          "**Reference** — \"in the style of [Artist]\" (use carefully — see legal §11).",
        ],
      },
    ],
  },

  {
    id: "aud-3-1-structure-tags",
    track: "audio",
    number: "3.1b",
    title: "Suno / Udio — structure tags",
    summary: "Bracketed tags that dramatically improve song coherence and section transitions.",
    source: "AI_Audio_Generation_Mastery.md",
    tags: ["suno", "udio", "structure"],
    blocks: [
      { kind: "para", text: "Suno and Udio support **bracketed structure tags** that dramatically improve song coherence:" },
      {
        kind: "code",
        language: "text",
        title: "Section tags",
        code: `[Intro]
[Verse 1]
[Pre-Chorus]
[Chorus]
[Verse 2]
[Bridge]
[Solo]
[Chorus]
[Outro]`,
      },
      { kind: "para", text: "You can also tag **performance directions**:" },
      {
        kind: "code",
        language: "text",
        title: "Performance tags",
        code: `[acoustic guitar fingerpicking]
[soft female vocals, breathy]
[drum fill]
[strings swell]
[fade out]
[harmonies]
[whisper]`,
      },
      { kind: "subheading", text: "Full prompt example" },
      {
        kind: "code",
        language: "text",
        title: "Style box",
        code: `indie folk, melancholic, 84 BPM, fingerpicked acoustic guitar, upright bass,
brushed drums, female alto vocals, breathy intimate delivery, slight tape warmth,
warm analog mix, 1970s production sensibility`,
      },
      {
        kind: "code",
        language: "text",
        title: "Lyrics box (with structure tags)",
        code: `[Intro: light fingerpicking, no vocals]

[Verse 1]
The kettle hums a song I used to know
The window fogs the colors of the snow
I read your letter twice and let it go
The morning learned to keep me company

[Pre-Chorus]
It's not the missing it's the
quiet of the missing

[Chorus]
And I'll keep walking out into the cold
Until the river decides where I should go
You taught me how to leave but not how to come home
So I'll just keep walking, walking on my own

[Outro: instrumental, fade out over 12 seconds]`,
      },
    ],
  },

  {
    id: "aud-3-1-recipes",
    track: "audio",
    number: "3.1c",
    title: "Six battle-tested genre recipes",
    summary: "Copy-paste style boxes for the most common goals. Each has been validated in production.",
    source: "AI_Audio_Generation_Mastery.md",
    tags: ["suno", "recipes"],
    blocks: [
      { kind: "para", text: "Drop these into Suno's style box. Each has been hardened across hundreds of generations." },
      {
        kind: "table",
        head: ["Goal", "Style box"],
        rows: [
          ["**Lo-fi study beat**", "`lo-fi hip-hop, chill, 78 BPM, dusty boom-bap drums, jazz piano sample, vinyl crackle, mellow saxophone, no vocals, instrumental`"],
          ["**Anthemic indie pop**", "`indie pop, anthemic, 124 BPM, driving drums, layered electric guitars, synth pads, male tenor vocals, big chorus harmonies, modern polish`"],
          ["**Cinematic trailer**", "`cinematic orchestral, epic, 110 BPM, slow build, taiko drums, brass swells, choir, dramatic tension, film score, no vocals`"],
          ["**Bossa nova lounge**", "`bossa nova, intimate, 92 BPM, nylon-string guitar, brushed drums, upright bass, soft female vocals in Portuguese, warm room mic`"],
          ["**Synthwave drive**", "`synthwave, nostalgic, 110 BPM, gated reverb drums, analog synths, electric bass, layered pads, no vocals or wordless vocals, 1985 production`"],
          ["**Afrobeats**", "`afrobeats, joyful, 102 BPM, log drums, shaker, plucky synth, male vocals with ad-libs, modern polish`"],
        ],
      },
      {
        kind: "callout",
        tone: "tip",
        title: "Drill",
        text: "Generate one song per recipe this week. Save your favorite take per genre. You now have a personal reference library.",
      },
      { kind: "subheading", text: "Execution checklist (exactly what to do)" },
      {
        kind: "list",
        ordered: true,
        items: [
          "Pick all 6 recipes in the table and run each recipe exactly once as written.",
          "For each recipe, run one second take where you only change one variable (BPM OR vocal style OR instrument).",
          "Save files with format `recipe-<genre>_take-<1|2>.mp3`.",
          "Score each take 1-5 for hook, arrangement, vocal quality, and mix quality.",
          "Keep one winner per genre in a `winners/` folder for future reference prompts.",
        ],
      },
    ],
  },

  {
    id: "aud-3-2-tts",
    track: "audio",
    number: "3.2",
    title: "Voice / TTS prompting",
    summary: "Plain text gets you 80%. Tags, SSML, and clean reference audio get you the rest.",
    source: "AI_Audio_Generation_Mastery.md",
    tags: ["elevenlabs", "tts", "ssml"],
    blocks: [
      { kind: "subheading", text: "Plain text → ElevenLabs / OpenAI TTS" },
      { kind: "para", text: "Most modern TTS just needs the text. Quality comes from:" },
      {
        kind: "list",
        items: [
          "**Punctuation** — commas/periods control pace.",
          "**Em-dashes** — for natural pauses (use sparingly).",
          "**Ellipses** — for trailing tone.",
          "**All caps** — emphasis (some models).",
          "**Italics in markdown** — emphasis (some models).",
          "**Line breaks** — paragraph pauses.",
        ],
      },
      { kind: "subheading", text: "ElevenLabs v3 audio tags" },
      { kind: "para", text: "ElevenLabs v3 supports **inline tags** for tone/emotion:" },
      {
        kind: "code",
        language: "text",
        code: `[whispers] I didn't think you'd come.
[laughs] That's the funniest thing I've heard all week.
[sighs] Okay. Let's start over.
[excited] This is the best day ever!
[sad] I just need a minute.`,
      },
      { kind: "para", text: "Other tags: `[shouts]`, `[crying]`, `[chuckles]`, `[gasps]`, `[serious]`, `[singing]`, `[breathing]`." },
      { kind: "subheading", text: "SSML (Speech Synthesis Markup Language)" },
      { kind: "para", text: "OpenAI TTS, Google TTS, Amazon Polly, and several others accept SSML:" },
      {
        kind: "code",
        language: "xml",
        code: `<speak>
  <prosody rate="slow" pitch="-2st">
    This is a slower, lower-pitched delivery.
  </prosody>
  <break time="500ms"/>
  Now back to normal pace.
  <emphasis level="strong">This word is stressed.</emphasis>
  <say-as interpret-as="characters">USB</say-as>
</speak>`,
      },
      { kind: "subheading", text: "Voice cloning best practices" },
      {
        kind: "table",
        head: ["Step", "Detail"],
        rows: [
          ["**Reference quality**", "30–60s clean audio, single speaker, no music, no echo"],
          ["**Reference variety**", "Include emotional range if you want range later"],
          ["**Format**", "24 kHz+ WAV, mono"],
          ["**Trim silences**", "Tight start/end"],
          ["**De-noise**", "Adobe Podcast Enhance / iZotope RX before cloning"],
          ["**Test**", "Always generate a short test before committing to a long script"],
        ],
      },
      { kind: "subheading", text: "Voice prompting JSON (multi-speaker dialogue)" },
      { kind: "code", language: "json", code: VOICE_JSON_SCHEMA, title: "Drive ElevenLabs Dialogue API or stitched single-speaker calls" },
    ],
  },

  {
    id: "aud-3-3-screenshot-to-song",
    track: "audio",
    number: "3.3",
    title: "Screenshot / image → song prompt",
    summary: "Feed an image to Gemini/Claude/GPT and ask for a musical interpretation.",
    source: "AI_Audio_Generation_Mastery.md",
    tags: ["workflow", "vision", "suno"],
    blocks: [
      { kind: "para", text: "Same flow as image→prompt and video→prompt — feed an image to a vision LLM and ask for a **musical interpretation**." },
      {
        kind: "code",
        language: "text",
        title: "Vision prompt",
        code: `You are a music director.
Look at the attached image and propose a song that scores it.

Output JSON:
{
  "genre": "",
  "subgenre": "",
  "mood": [],
  "bpm": 0,
  "key": "",
  "instruments": [],
  "vocal": { "present": true, "gender": "", "tone": "", "lyrics_theme": "" },
  "production_era": "",
  "reference_artists_descriptive_only": [],
  "lyrics_first_verse": ""
}

Only fill 'reference_artists_descriptive_only' with stylistic descriptors, NOT direct artist names
(to avoid copyright infringement requests). E.g. "1970s warm female folk" not "Joni Mitchell".

Output ONLY the JSON.`,
      },
      { kind: "para", text: "Compile the JSON into Suno's style box + lyrics box. Same flow as image→prompt." },
    ],
  },
];

// Helpers ----------------------------------------------------------------------------

export const COOKBOOK_TRACKS: Track[] = ["main", "image", "video", "audio"];

export function getCookbookSection(id: string): CookbookSection | undefined {
  return COOKBOOK.find((s) => s.id === id);
}

export function getCookbookByTrack(track: Track): CookbookSection[] {
  return COOKBOOK.filter((s) => s.track === track);
}
