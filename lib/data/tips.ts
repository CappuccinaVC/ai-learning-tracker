// Tips, tricks, JSON prompt templates and high-leverage insights distilled
// from the 4 mastery files. All copy-pastable.

import type { Track } from "./types";

export interface Tip {
  id: string;
  track: Track;
  title: string;
  insight: string;          // 1-2 sentence takeaway
  body?: string;            // longer explanation (optional)
  template?: string;        // copy-pastable prompt / JSON / command
  templateLanguage?: "json" | "text" | "shell" | "yaml";
  source: string;           // which mastery file
  cookbookSection?: string; // in-app cookbook anchor (CookbookSection.id)
  tags: string[];
  links?: { label: string; url: string }[];
}

const BASE_TIPS: Tip[] = [
  // ===================== MAIN ROADMAP — META =====================
  {
    id: "main-prompt-anatomy",
    track: "main",
    title: "The 6-part anatomy of a great prompt",
    insight: "Role + Task + Context + Constraints + Examples + Output format.",
    body: "Every elite prompt is built from these six ingredients. Skip any and the model fills it in for you (poorly).",
    template: `Role: <who the model should act as>
Task: <one-sentence specific task>
Context: <relevant facts, audience, prior work>
Constraints: <rules, limits, must/must-not>
Examples:
- Input: <ex1>
  Output: <ex1 result>
- Input: <ex2>
  Output: <ex2 result>
Output format: <markdown / JSON schema / bullet list / etc>`,
    templateLanguage: "text",
    source: "AI_Mastery_Roadmap.md",
    tags: ["prompting", "fundamentals"],
  },
  {
    id: "main-meta-prompt",
    track: "main",
    title: "Meta-prompt: ask the LLM to write your prompt",
    insight: "Stop hand-crafting. Tell the model your goal and let it propose the prompt.",
    template: `You are a prompt engineer. I want to <goal>. 
The audience is <who>. The output must <constraints>.
Please:
1. Ask me 3-5 clarifying questions before writing the prompt.
2. After my answers, output a final prompt I can paste into <ChatGPT/Claude/Gemini>.
3. Include reasoning for each design choice.`,
    templateLanguage: "text",
    source: "AI_Mastery_Roadmap.md",
    tags: ["prompting", "meta"],
  },
  {
    id: "main-rag-vs-finetune",
    track: "main",
    title: "RAG vs fine-tuning decision rule",
    insight: "RAG for facts that change. Fine-tune for style/format that doesn't.",
    body: "If the answer depends on knowledge that updates monthly → RAG. If you want the model to consistently produce a specific tone, JSON schema, or domain-specific format → fine-tune (or few-shot first).",
    source: "AI_Mastery_Roadmap.md",
    tags: ["rag", "fine-tuning", "decision"],
  },
  {
    id: "main-eval-first",
    track: "main",
    title: "Build the eval before the prompt",
    insight: "20 input/expected-output pairs is the cheapest unfair advantage in prompt engineering.",
    body: "Before iterating, write 20 (input, expected output) pairs. Use Promptfoo or a script to grade. Now you can A/B prompts in seconds instead of vibes.",
    links: [{ label: "Promptfoo", url: "https://www.promptfoo.dev/" }],
    source: "AI_Mastery_Roadmap.md",
    tags: ["eval", "promptfoo"],
  },
  {
    id: "main-temperature-guide",
    track: "main",
    title: "Temperature cheat-sheet",
    insight: "0.0 for code/JSON. 0.3-0.5 for analysis. 0.7-0.9 for creative. 1.0+ for brainstorming.",
    body: "Lower temperature = more deterministic, higher = more diverse. For multi-step pipelines, use 0 unless you specifically need variety.",
    source: "AI_Mastery_Roadmap.md",
    tags: ["parameters", "fundamentals"],
  },
  {
    id: "main-system-prompt-pattern",
    track: "main",
    title: "Layer system prompts for multi-step agents",
    insight: "System prompts compose: identity → capabilities → constraints → output schema.",
    template: `# Identity
You are <Name>, a <role>. You <one-line mission>.

# Capabilities
- You CAN: <list>
- You CANNOT: <list>

# Constraints
- Always: <rule>
- Never: <rule>
- Tone: <description>

# Output
Always respond as JSON matching:
{
  "thought": string,
  "action": string,
  "args": object
}`,
    templateLanguage: "text",
    source: "AI_Mastery_Roadmap.md",
    tags: ["agents", "system-prompts"],
  },

  // ===================== IMAGE TRACK =====================
  {
    id: "img-universal-json",
    track: "image",
    title: "Universal Image JSON schema (works on Flux, Midjourney, SDXL, Imagen)",
    insight: "JSON-structured prompts beat natural language for control & reproducibility. This schema is portable across models.",
    template: `{
  "subject": {
    "what": "a tired barista in her late 20s",
    "doing": "leaning on the counter, looking at a customer just out of frame",
    "wearing": "black apron over a white tee",
    "expression": "soft half-smile, eyes slightly crinkled"
  },
  "scene": {
    "location": "small artisan coffee shop interior",
    "time_of_day": "late afternoon, golden hour spilling through window",
    "weather": "overcast outside, warm inside",
    "props": ["espresso machine", "ceramic cups", "chalkboard menu"]
  },
  "camera": {
    "shot": "medium close-up",
    "angle": "slightly low, eye-level with subject",
    "lens": "50mm f/1.8",
    "depth_of_field": "shallow, background heavily blurred",
    "framing": "rule of thirds, subject left"
  },
  "lighting": {
    "key": "warm window light from camera right",
    "fill": "subtle bounce from white ceiling",
    "mood": "cozy, melancholic",
    "color_temp": "3200K warm"
  },
  "style": {
    "medium": "35mm film photograph",
    "film_stock": "Kodak Portra 400",
    "grain": "fine, organic",
    "color_grade": "warm shadows, slightly muted highlights",
    "references": ["Saul Leiter color photography", "Wong Kar-wai stills"]
  },
  "quality": ["sharp focus on eyes", "no plastic skin", "natural skin texture"],
  "negative": ["text", "watermark", "deformed hands", "cartoon", "oversaturated"],
  "aspect_ratio": "3:2",
  "seed": 12345
}`,
    templateLanguage: "json",
    source: "AI_Image_Generation_Mastery.md",
    tags: ["json", "prompting", "schema"],
    links: [{ label: "Flux", url: "https://blackforestlabs.ai" }, { label: "Midjourney", url: "https://midjourney.com" }],
  },
  {
    id: "img-screenshot-to-json",
    track: "image",
    title: "Screenshot → JSON: the elite operator move",
    insight: "Paste any image into ChatGPT/Claude with this prompt to get a JSON spec you can iterate on.",
    template: `You are a senior visual director. I'll attach an image. 
Output a JSON object describing it using this schema (and only this schema):

{
  "subject": { "what", "doing", "wearing", "expression" },
  "scene": { "location", "time_of_day", "weather", "props" },
  "camera": { "shot", "angle", "lens", "depth_of_field", "framing" },
  "lighting": { "key", "fill", "mood", "color_temp" },
  "style": { "medium", "film_stock", "grain", "color_grade", "references" },
  "quality": [],
  "negative": [],
  "aspect_ratio": "<W:H>"
}

Be specific. Infer plausible values where the image is ambiguous. 
Reply with ONLY the JSON, no markdown, no commentary.`,
    templateLanguage: "text",
    source: "AI_Image_Generation_Mastery.md",
    tags: ["json", "vision", "workflow"],
  },
  {
    id: "img-camera-vocabulary",
    track: "image",
    title: "Camera vocabulary that actually moves the needle",
    insight: "Specific lens specs and shot terminology dramatically increase image quality.",
    body: "Shots: extreme close-up, close-up, medium close-up, medium, cowboy, full, wide, extreme wide.\nAngles: bird's eye, high, eye-level, low, dutch tilt, worm's eye.\nLenses: 24mm wide, 35mm street, 50mm standard, 85mm portrait, 135mm telephoto, 200mm compression.\nDepth: shallow (f/1.4-2.8), medium (f/4-5.6), deep (f/8+).",
    source: "AI_Image_Generation_Mastery.md",
    tags: ["vocabulary", "camera"],
  },
  {
    id: "img-flux-vs-mj",
    track: "image",
    title: "Flux vs Midjourney: when to use which",
    insight: "Flux for photoreal & text. Midjourney for stylized & artistic. Recraft for design with native SVG.",
    body: "Flux 1.1 Pro / Flux 2 Pro: best photorealism, best text rendering, ControlNet-friendly. Use via fal.ai or Replicate API.\nMidjourney v6+: best artistic styles, painterly looks, hard to beat for moodboards.\nRecraft: design-first, exports clean SVG.\nIdeogram: best when text inside the image is the goal.",
    source: "AI_Image_Generation_Mastery.md",
    tags: ["models", "comparison"],
  },
  {
    id: "img-comfyui-essentials",
    track: "image",
    title: "ComfyUI essential workflow nodes",
    insight: "Master these 8 nodes and you can build 90% of workflows.",
    body: "1. Load Checkpoint\n2. CLIP Text Encode (positive / negative)\n3. Empty Latent Image\n4. KSampler (Euler / DPM++)\n5. VAE Decode\n6. Save Image\n7. ControlNet Apply (depth / canny / openpose)\n8. LoRA Loader\nBonus: IP-Adapter for image conditioning, FaceDetailer for portraits.",
    source: "AI_Image_Generation_Mastery.md",
    tags: ["comfyui", "workflow"],
    links: [{ label: "ComfyUI Examples", url: "https://comfyanonymous.github.io/ComfyUI_examples/" }],
  },

  // ===================== VIDEO TRACK =====================
  {
    id: "vid-veo-json",
    track: "video",
    title: "Veo 3.1 JSON prompt template (current best practice)",
    insight: "Veo 3.1 expects structured prompts with explicit camera, audio, and dialogue blocks. JSON > sentences.",
    template: `{
  "shot": {
    "type": "medium close-up",
    "movement": "slow dolly-in over 4 seconds",
    "lens": "50mm",
    "framing": "rule of thirds, subject left"
  },
  "subject": {
    "description": "woman in her 30s, dark curly hair, freckles, navy turtleneck",
    "action": "looks down at her phone, then slowly raises her eyes toward camera",
    "expression": "switching from worry to determination"
  },
  "scene": {
    "location": "rooftop at dusk",
    "weather": "light wind, overcast",
    "props": ["distant city skyline", "neon signs flickering"]
  },
  "lighting": {
    "key": "soft purple-blue dusk ambient",
    "rim": "warm orange neon from camera-left",
    "mood": "contemplative, cinematic"
  },
  "style": {
    "look": "anamorphic film, shallow DoF",
    "color_grade": "teal & orange, slight halation"
  },
  "audio": {
    "ambient": "distant traffic, faint wind",
    "music": "minimal piano, building strings",
    "dialogue": null,
    "sfx": "phone vibrate at 0:01"
  },
  "duration_seconds": 8,
  "negative": ["text overlays", "watermark", "warping faces"]
}`,
    templateLanguage: "json",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["veo", "json", "prompting"],
    links: [{ label: "Veo Docs", url: "https://ai.google.dev/gemini-api/docs/video" }],
  },
  {
    id: "vid-multishot-continuity",
    track: "video",
    title: "Multi-shot continuity: lock the character first",
    insight: "Generate one perfect reference image, then use it as image-to-video for every shot.",
    body: "Workflow: 1) Nail your character with Flux/Midjourney → save the seed. 2) Use that exact image as the i2v reference for every shot. 3) Keep lighting, color grade, and clothing in the JSON identical across shots — only change camera and action. 4) For dialogue, write per-shot JSON with audio.dialogue field set; never mix narration & dialogue in one shot.",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["continuity", "workflow", "characters"],
  },
  {
    id: "vid-screenshot-chain",
    track: "video",
    title: "Screenshot → next-shot JSON (the chain trick)",
    insight: "Take a frame from the previous video, paste to GPT-4 Vision, ask for JSON of the next logical shot.",
    template: `Here's a frame from my previous shot. The story so far: <one paragraph>.

Generate a Veo 3.1 JSON prompt for the NEXT shot that:
- Maintains the same character appearance, wardrobe, and lighting
- Cuts to a NEW camera angle (don't repeat the previous one)
- Advances the story by: <plot beat>
- Continues the audio mood from the previous shot

Output ONLY valid JSON matching the Veo 3.1 schema. No prose.`,
    templateLanguage: "text",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["workflow", "continuity"],
  },
  {
    id: "vid-model-picker",
    track: "video",
    title: "Video model picker (Q4 2025)",
    insight: "Veo 3.1 for cinematic, Kling 3.0 for character-driven, Runway for editing-heavy, Pika for social, Wan/LTX for local.",
    body: "Veo 3.1: best cinematography & native audio (paid).\nKling 3.0: best human characters & dialogue lip-sync.\nRunway Gen-4.5: best editing suite + features around the gen.\nPika 2.0: fastest, cheapest for social.\nWan 2.6 / LTX-Video: open-source, run locally on 12-24GB VRAM.\nHunyuanVideo: open-source flagship, 24GB+ VRAM.",
    source: "AI_Video_Generation_Mastery.md",
    tags: ["models", "comparison"],
  },

  // ===================== AUDIO TRACK =====================
  {
    id: "aud-suno-structure-tags",
    track: "audio",
    title: "Suno: the structure tags every prompt needs",
    insight: "Section tags in brackets ([Verse], [Chorus]) instantly improve song structure and singability.",
    template: `[Intro]
(soft fingerpicked guitar, no vocals, 8 bars)

[Verse 1]
walking through the empty street again
neon spilling colors on the rain
nothing here belongs to me at all
but I keep on walking just the same

[Pre-Chorus]
and the city's getting smaller now
every step I take, I disappear

[Chorus]
oh, I am the static in the radio
oh, I am the silence in between the words you didn't know

[Verse 2]
...

[Bridge]
(half-time, atmospheric, female harmony layered)

[Chorus]
(double vocal, drums full, big room reverb)

[Outro]
(strip back to piano, fade over 16 bars)`,
    templateLanguage: "text",
    source: "AI_Audio_Generation_Mastery.md",
    tags: ["suno", "structure", "lyrics"],
    links: [{ label: "Suno", url: "https://suno.com" }],
  },
  {
    id: "aud-suno-style-box",
    track: "audio",
    title: "Suno style box: the 4-axis formula",
    insight: "Genre + sub-genre + era + 2-3 reference adjectives. Avoid artist names (filtered).",
    template: `indie folk, dream-pop adjacent, 2010s Sufjan-era, 
intimate, breathy female vocal, 
hushed dynamics, vinyl warmth, 
fingerpicked acoustic guitar, soft analog synth pad, 
gentle brushed snare`,
    templateLanguage: "text",
    source: "AI_Audio_Generation_Mastery.md",
    tags: ["suno", "style"],
  },
  {
    id: "aud-eleven-v3-tags",
    track: "audio",
    title: "ElevenLabs v3 audio tags (emotion in TTS)",
    insight: "Inline tags like [whispers], [laughs], [sighs] inject emotion mid-sentence.",
    template: `[whispers] I shouldn't tell you this... 
[normal] but the truth is, [pauses] I knew. 
[sighs] I knew the whole time. [laughs nervously] crazy, right?

# Pacing controls
- [pauses] short pause
- [pauses for 2 seconds] longer pause  
- ... ellipses naturally slow delivery
- ALL CAPS for emphasis or shouting

# Emotion tags
[whispers] [laughs] [laughs nervously] [sighs] 
[gasps] [clears throat] [scoffs] [sobs]
[shouts] [angry] [excited] [sad] [calm]`,
    templateLanguage: "text",
    source: "AI_Audio_Generation_Mastery.md",
    tags: ["elevenlabs", "tts", "emotion"],
    links: [{ label: "ElevenLabs Docs", url: "https://elevenlabs.io/docs" }],
  },
  {
    id: "aud-ssml-template",
    track: "audio",
    title: "SSML template for production-grade TTS",
    insight: "SSML (Speech Synthesis Markup Language) is the gold standard for prosody. Works on ElevenLabs, Google, Azure.",
    template: `<speak>
  <prosody rate="medium" pitch="medium">
    Welcome to the show.
  </prosody>
  <break time="500ms"/>
  <prosody rate="slow" pitch="-2st">
    Today, we're going to talk about something <emphasis level="strong">unusual</emphasis>.
  </prosody>
  <break time="300ms"/>
  <prosody rate="fast" pitch="+1st">
    Stay with me.
  </prosody>
</speak>`,
    templateLanguage: "text",
    source: "AI_Audio_Generation_Mastery.md",
    tags: ["ssml", "tts"],
  },
  {
    id: "aud-screenshot-to-song",
    track: "audio",
    title: "Inspiration → Suno JSON",
    insight: "Paste a song's Spotify/YouTube screenshot or describe a vibe. Get back a Suno-ready prompt.",
    template: `I want a song with a vibe similar to <reference>. 
Don't copy — just match the FEEL.

Output a Suno prompt with:
1. Style box (genre + 4-5 descriptors, NO artist names)
2. Lyrics with [Intro] [Verse] [Pre-Chorus] [Chorus] [Bridge] [Outro] tags
3. Tempo and key suggestion
4. Approximate length

Theme: <theme>
Mood: <mood>  
Length: <2:30 / 3:30 / 4:30>
Vocal: <male/female/duet>`,
    templateLanguage: "text",
    source: "AI_Audio_Generation_Mastery.md",
    tags: ["suno", "workflow"],
  },
  {
    id: "aud-voice-agent-stack",
    track: "audio",
    title: "Voice agent stack (Q4 2025)",
    insight: "Cartesia Sonic (TTS) + Deepgram Nova-3 (STT) + GPT-4o (LLM) + LiveKit/Vapi (orchestration) = sub-300ms latency.",
    body: "For a phone-grade real-time voice agent, latency is everything. Stack:\n• STT: Deepgram Nova-3 (fastest paid) or Whisper local\n• LLM: GPT-4o-mini or Claude 3.5 Haiku for speed\n• TTS: Cartesia Sonic (~75ms TTS), ElevenLabs Turbo, or PlayHT\n• Orchestration: LiveKit Agents (open-source) or Vapi (managed)\n• VAD: Silero or built-in to LiveKit\nTarget: <300ms turn-taking. Anything above 800ms feels broken.",
    source: "AI_Audio_Generation_Mastery.md",
    tags: ["voice-agents", "stack"],
    links: [
      { label: "LiveKit Agents", url: "https://livekit.io/agents" },
      { label: "Vapi", url: "https://vapi.ai" },
      { label: "Cartesia", url: "https://cartesia.ai" },
    ],
  },
];

const TIP_TO_COOKBOOK_SECTION: Record<string, string> = {
  "main-prompt-anatomy": "main-prompt-anatomy",
  "main-rag-vs-finetune": "main-rag-vs-finetune",
  "main-eval-first": "main-eval-first",
  "main-temperature-guide": "main-temperature",

  "img-universal-json": "img-3-5-json-prompting",
  "img-screenshot-to-json": "img-3-6-screenshot-to-json",
  "img-camera-vocabulary": "img-3-2-style-references",
  "img-flux-vs-mj": "img-3-4-model-tips",

  "vid-veo-json": "vid-3-3-json-schema",
  "vid-multishot-continuity": "vid-3-4-multishot-continuity",
  "vid-screenshot-chain": "vid-3-5-screenshot-to-json",

  "aud-suno-structure-tags": "aud-3-1-structure-tags",
  "aud-suno-style-box": "aud-3-1-recipes",
  "aud-eleven-v3-tags": "aud-3-2-tts",
  "aud-ssml-template": "aud-3-2-tts",
  "aud-screenshot-to-song": "aud-3-3-screenshot-to-song",
};

export const TIPS: Tip[] = BASE_TIPS.map((tip) => ({
  ...tip,
  cookbookSection: TIP_TO_COOKBOOK_SECTION[tip.id],
}));

export const TIP_TRACKS: Track[] = ["main", "image", "video", "audio"];
