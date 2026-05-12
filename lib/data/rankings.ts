export const RANKINGS_REVALIDATE_SECONDS = 60 * 60 * 24;

export type RankingCategoryId = "chat" | "local" | "image" | "video" | "audio";
export type RankingSourceId = "arena" | "huggingface" | "hybrid";

export interface RankingEntry {
  rank: number;
  name: string;
  provider: string;
  score: number | null;
  scoreLabel: string;
  likes: number | null;
  license: string | null;
  modelUrl: string;
  metrics?: Array<{ label: string; value: string }>;
}

export interface RankingCategory {
  id: RankingCategoryId;
  label: string;
  description: string;
  metric: string;
  sourceName: string;
  sourceUrl: string;
  updatedAt: string;
  entries: RankingEntry[];
  externalLinks: Array<{ title: string; url: string }>;
}

export interface RankingsPayload {
  generatedAt: string;
  revalidateSeconds: number;
  categories: Record<RankingCategoryId, RankingCategory>;
  sourceSelection: Record<RankingCategoryId, RankingSourceId>;
  sourceOptions: Record<RankingCategoryId, RankingSourceId[]>;
}

const SOURCE_OPTIONS: Record<RankingCategoryId, RankingSourceId[]> = {
  chat: ["arena", "huggingface", "hybrid"],
  local: ["arena", "huggingface", "hybrid"],
  image: ["arena", "huggingface", "hybrid"],
  video: ["arena", "huggingface", "hybrid"],
  audio: ["huggingface", "hybrid"],
};

interface HuggingFaceModel {
  id: string;
  downloads?: number;
  likes?: number;
  lastModified?: string;
  tags?: string[];
  cardData?: {
    license?: string;
  };
}

interface ArenaLatest {
  date?: string;
  path?: string;
}

interface ArenaModel {
  rank: number;
  model: string;
  vendor?: string;
  license?: string | null;
  score?: number;
  ci?: number;
  votes?: number;
}

interface ArenaLeaderboard {
  meta: {
    source_url?: string;
    fetched_at?: string;
    last_updated?: string;
    leaderboard?: string;
    model_count?: number;
  };
  models: ArenaModel[];
}

const HF_MODELS_API = "https://huggingface.co/api/models";
const ARENA_SNAPSHOT_BASE = "https://raw.githubusercontent.com/oolong-tea-2026/arena-ai-leaderboards/main/data";

async function fetchJsonWithCache<T>(url: string, forceFresh: boolean): Promise<T> {
  const init: RequestInit = {
    headers: {
      "User-Agent": "AI-Learning-Tracker/1.0",
      Accept: "application/json",
    },
  };

  if (forceFresh) init.cache = "no-store";
  else init.next = { revalidate: RANKINGS_REVALIDATE_SECONDS };

  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} for ${url}`);
  }
  return (await res.json()) as T;
}

async function fetchHuggingFaceModels(pipelineTag: string, limit: number, forceFresh: boolean): Promise<HuggingFaceModel[]> {
  const url = `${HF_MODELS_API}?pipeline_tag=${encodeURIComponent(pipelineTag)}&sort=downloads&direction=-1&limit=${limit}&full=true`;
  const data = await fetchJsonWithCache<HuggingFaceModel[]>(url, forceFresh);
  return Array.isArray(data) ? data : [];
}

async function fetchArenaLatestPath(forceFresh: boolean): Promise<string | null> {
  try {
    const latest = await fetchJsonWithCache<ArenaLatest>(`${ARENA_SNAPSHOT_BASE}/latest.json`, forceFresh);
    return latest.path ?? latest.date ?? null;
  } catch {
    return null;
  }
}

async function fetchArenaLeaderboard(board: "text" | "text-to-image" | "text-to-video", latestPath: string, forceFresh: boolean): Promise<ArenaLeaderboard | null> {
  try {
    const data = await fetchJsonWithCache<ArenaLeaderboard>(`${ARENA_SNAPSHOT_BASE}/${latestPath}/${board}.json`, forceFresh);
    if (!Array.isArray(data.models)) return null;
    return data;
  } catch {
    return null;
  }
}

function inferLicense(model: HuggingFaceModel): string | null {
  if (model.cardData?.license) return model.cardData.license;
  const tagLicense = model.tags?.find((tag) => tag.startsWith("license:"));
  return tagLicense ? tagLicense.replace("license:", "") : null;
}

function toEntry(model: HuggingFaceModel, idx: number): RankingEntry {
  const [provider] = model.id.split("/");
  const downloads = model.downloads ?? null;

  return {
    rank: idx + 1,
    name: model.id,
    provider: provider ?? "unknown",
    score: downloads,
    scoreLabel: downloads !== null ? "HF downloads" : "n/a",
    likes: model.likes ?? null,
    license: inferLicense(model),
    modelUrl: `https://huggingface.co/${model.id}`,
    metrics: model.likes !== undefined ? [{ label: "HF likes", value: String(model.likes) }] : undefined,
  };
}

function toArenaEntry(model: ArenaModel, idx: number, leaderboardUrl: string): RankingEntry {
  return {
    rank: idx + 1,
    name: model.model,
    provider: model.vendor ?? "unknown",
    score: model.score ?? null,
    scoreLabel: "Arena Elo",
    likes: null,
    license: model.license ?? null,
    modelUrl: leaderboardUrl,
    metrics: [
      ...(typeof model.votes === "number" ? [{ label: "Votes", value: String(model.votes) }] : []),
      ...(typeof model.ci === "number" ? [{ label: "CI ±", value: String(model.ci) }] : []),
      { label: "Global rank", value: `#${model.rank}` },
    ],
  };
}

function fallbackCategory(id: RankingCategoryId, updatedAt: string): RankingCategory {
  const common = {
    sourceName: "Hybrid fallback",
    sourceUrl: "https://huggingface.co/models",
    updatedAt,
  };

  if (id === "chat") {
    return {
      id,
      label: "Chat LLMs",
      description: "Fallback list when live API ranking is unavailable.",
      metric: "Editorial fallback",
      ...common,
      entries: [
        { rank: 1, name: "openai/gpt-4.1", provider: "openai", score: null, scoreLabel: "fallback", likes: null, license: null, modelUrl: "https://openai.com" },
        { rank: 2, name: "anthropic/claude-opus-4", provider: "anthropic", score: null, scoreLabel: "fallback", likes: null, license: null, modelUrl: "https://www.anthropic.com" },
        { rank: 3, name: "google/gemini-1.5-pro", provider: "google", score: null, scoreLabel: "fallback", likes: null, license: null, modelUrl: "https://deepmind.google/technologies/gemini/" },
      ],
      externalLinks: [
        { title: "Arena AI — Text Leaderboard", url: "https://arena.ai/leaderboard/text" },
        { title: "Artificial Analysis — LLM Rankings", url: "https://artificialanalysis.ai/" },
        { title: "OpenRouter — Model Rankings", url: "https://openrouter.ai/rankings" },
      ],
    };
  }

  if (id === "local") {
    return {
      id,
      label: "Local LLMs",
      description: "Fallback list when live API ranking is unavailable.",
      metric: "Editorial fallback",
      ...common,
      entries: [
        { rank: 1, name: "meta-llama/Meta-Llama-3.1-8B-Instruct", provider: "meta-llama", score: null, scoreLabel: "fallback", likes: null, license: "llama", modelUrl: "https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct" },
        { rank: 2, name: "Qwen/Qwen2.5-7B-Instruct", provider: "Qwen", score: null, scoreLabel: "fallback", likes: null, license: "apache-2.0", modelUrl: "https://huggingface.co/Qwen" },
        { rank: 3, name: "mistralai/Mistral-7B-Instruct-v0.3", provider: "mistralai", score: null, scoreLabel: "fallback", likes: null, license: "apache-2.0", modelUrl: "https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3" },
      ],
      externalLinks: [
        { title: "Arena AI — Text Leaderboard", url: "https://arena.ai/leaderboard/text" },
        { title: "Open LLM Leaderboard", url: "https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard" },
        { title: "Ollama Library", url: "https://ollama.com/library" },
        { title: "OpenRouter — Model Rankings", url: "https://openrouter.ai/rankings" },
      ],
    };
  }

  if (id === "image") {
    return {
      id,
      label: "Image Models",
      description: "Fallback list when live API ranking is unavailable.",
      metric: "Editorial fallback",
      ...common,
      entries: [
        { rank: 1, name: "black-forest-labs/FLUX.1-dev", provider: "black-forest-labs", score: null, scoreLabel: "fallback", likes: null, license: "non-commercial", modelUrl: "https://huggingface.co/black-forest-labs/FLUX.1-dev" },
        { rank: 2, name: "stabilityai/stable-diffusion-xl-base-1.0", provider: "stabilityai", score: null, scoreLabel: "fallback", likes: null, license: "openrail++", modelUrl: "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0" },
        { rank: 3, name: "playgroundai/playground-v2.5-1024px-aesthetic", provider: "playgroundai", score: null, scoreLabel: "fallback", likes: null, license: null, modelUrl: "https://huggingface.co/playgroundai/playground-v2.5-1024px-aesthetic" },
      ],
      externalLinks: [
        { title: "Arena AI — Text to Image", url: "https://arena.ai/leaderboard/text-to-image" },
        { title: "Artificial Analysis — Image Models", url: "https://artificialanalysis.ai/text-to-image" },
        { title: "Hugging Face — Text to Image", url: "https://huggingface.co/models?pipeline_tag=text-to-image" },
      ],
    };
  }

  if (id === "video") {
    return {
      id,
      label: "Video Models",
      description: "Fallback list when live API ranking is unavailable.",
      metric: "Editorial fallback",
      ...common,
      entries: [
        { rank: 1, name: "genmo/mochi-1-preview", provider: "genmo", score: null, scoreLabel: "fallback", likes: null, license: null, modelUrl: "https://huggingface.co/genmo/mochi-1-preview" },
        { rank: 2, name: "THUDM/CogVideoX-5b", provider: "THUDM", score: null, scoreLabel: "fallback", likes: null, license: "apache-2.0", modelUrl: "https://huggingface.co/THUDM/CogVideoX-5b" },
        { rank: 3, name: "Lightricks/LTX-Video", provider: "Lightricks", score: null, scoreLabel: "fallback", likes: null, license: null, modelUrl: "https://huggingface.co/Lightricks" },
      ],
      externalLinks: [
        { title: "Arena AI — Text to Video", url: "https://arena.ai/leaderboard/text-to-video" },
        { title: "Artificial Analysis — Video Models", url: "https://artificialanalysis.ai/text-to-video" },
        { title: "Hugging Face — Text to Video", url: "https://huggingface.co/models?pipeline_tag=text-to-video" },
      ],
    };
  }

  return {
    id: "audio",
    label: "Audio Models",
    description: "Fallback list when live API ranking is unavailable.",
    metric: "Editorial fallback",
    ...common,
    entries: [
      { rank: 1, name: "facebook/musicgen-large", provider: "facebook", score: null, scoreLabel: "fallback", likes: null, license: "cc-by-nc-4.0", modelUrl: "https://huggingface.co/facebook/musicgen-large" },
      { rank: 2, name: "suno/bark", provider: "suno", score: null, scoreLabel: "fallback", likes: null, license: "mit", modelUrl: "https://huggingface.co/suno/bark" },
      { rank: 3, name: "microsoft/speecht5_tts", provider: "microsoft", score: null, scoreLabel: "fallback", likes: null, license: "mit", modelUrl: "https://huggingface.co/microsoft/speecht5_tts" },
    ],
    externalLinks: [
      { title: "Hugging Face — Text to Audio", url: "https://huggingface.co/models?pipeline_tag=text-to-audio" },
      { title: "Hugging Face — Text to Speech", url: "https://huggingface.co/models?pipeline_tag=text-to-speech" },
      { title: "Papers with Code — SOTA Leaderboards", url: "https://paperswithcode.com/sota" },
    ],
  };
}

function buildCategory(params: {
  id: RankingCategoryId;
  label: string;
  description: string;
  metric: string;
  sourceName: string;
  sourceUrl: string;
  updatedAt: string;
  models: HuggingFaceModel[];
  externalLinks: Array<{ title: string; url: string }>;
}): RankingCategory {
  const entries = params.models.slice(0, 10).map(toEntry);

  return {
    id: params.id,
    label: params.label,
    description: params.description,
    metric: params.metric,
    sourceName: params.sourceName,
    sourceUrl: params.sourceUrl,
    updatedAt: params.updatedAt,
    entries,
    externalLinks: params.externalLinks,
  };
}

function buildCategoryFromEntries(params: {
  id: RankingCategoryId;
  label: string;
  description: string;
  metric: string;
  sourceName: string;
  sourceUrl: string;
  updatedAt: string;
  entries: RankingEntry[];
  externalLinks: Array<{ title: string; url: string }>;
}): RankingCategory {
  return {
    id: params.id,
    label: params.label,
    description: params.description,
    metric: params.metric,
    sourceName: params.sourceName,
    sourceUrl: params.sourceUrl,
    updatedAt: params.updatedAt,
    entries: params.entries.slice(0, 10),
    externalLinks: params.externalLinks,
  };
}

function dedupeById(models: HuggingFaceModel[]): HuggingFaceModel[] {
  const seen = new Set<string>();
  const out: HuggingFaceModel[] = [];
  for (const model of models) {
    if (seen.has(model.id)) continue;
    seen.add(model.id);
    out.push(model);
  }
  return out;
}

const CATEGORY_IDS: RankingCategoryId[] = ["chat", "local", "image", "video", "audio"];

function parseSourceSelection(raw?: Partial<Record<RankingCategoryId, string>>): Record<RankingCategoryId, RankingSourceId> {
  const defaults: Record<RankingCategoryId, RankingSourceId> = {
    chat: "arena",
    local: "arena",
    image: "arena",
    video: "arena",
    audio: "hybrid",
  };

  for (const id of CATEGORY_IDS) {
    const candidate = raw?.[id];
    if (!candidate) continue;
    const normalized = candidate.toLowerCase();
    if (SOURCE_OPTIONS[id].includes(normalized as RankingSourceId)) {
      defaults[id] = normalized as RankingSourceId;
    }
  }

  return defaults;
}

function resolveCategory(params: {
  source: RankingSourceId;
  preferredArena: RankingCategory | null;
  preferredHf: RankingCategory | null;
  fallback: RankingCategory;
}): RankingCategory {
  const { source, preferredArena, preferredHf, fallback } = params;

  if (source === "arena") return preferredArena ?? preferredHf ?? fallback;
  if (source === "huggingface") return preferredHf ?? preferredArena ?? fallback;
  return preferredArena ?? preferredHf ?? fallback;
}

export async function getRankingsPayload(options?: {
  forceFresh?: boolean;
  sourceSelection?: Partial<Record<RankingCategoryId, string>>;
}): Promise<RankingsPayload> {
  const forceFresh = options?.forceFresh ?? false;
  const selectedSources = parseSourceSelection(options?.sourceSelection);
  const generatedAt = new Date().toISOString();

  const latestArenaPath = await fetchArenaLatestPath(forceFresh);

  const [arenaTextRes, arenaImageRes, arenaVideoRes, textGenRes, imageRes, videoRes, audioRes, ttsRes] = await Promise.allSettled([
    latestArenaPath ? fetchArenaLeaderboard("text", latestArenaPath, forceFresh) : Promise.resolve(null),
    latestArenaPath ? fetchArenaLeaderboard("text-to-image", latestArenaPath, forceFresh) : Promise.resolve(null),
    latestArenaPath ? fetchArenaLeaderboard("text-to-video", latestArenaPath, forceFresh) : Promise.resolve(null),
    fetchHuggingFaceModels("text-generation", 80, forceFresh),
    fetchHuggingFaceModels("text-to-image", 20, forceFresh),
    fetchHuggingFaceModels("text-to-video", 20, forceFresh),
    fetchHuggingFaceModels("text-to-audio", 20, forceFresh),
    fetchHuggingFaceModels("text-to-speech", 20, forceFresh),
  ]);

  const arenaText = arenaTextRes.status === "fulfilled" ? arenaTextRes.value : null;
  const arenaImage = arenaImageRes.status === "fulfilled" ? arenaImageRes.value : null;
  const arenaVideo = arenaVideoRes.status === "fulfilled" ? arenaVideoRes.value : null;

  const textModels = textGenRes.status === "fulfilled" ? textGenRes.value : [];
  const imageModels = imageRes.status === "fulfilled" ? imageRes.value : [];
  const videoModels = videoRes.status === "fulfilled" ? videoRes.value : [];
  const audioModels = dedupeById([
    ...(audioRes.status === "fulfilled" ? audioRes.value : []),
    ...(ttsRes.status === "fulfilled" ? ttsRes.value : []),
  ]);

  const chatCandidates = textModels.filter((m) =>
    /(chat|instruct|assistant|llama|qwen|mistral|gemma|phi)/i.test(m.id)
  );

  const localCandidates = textModels.filter((m) => {
    const id = m.id.toLowerCase();
    return !id.includes("gguf") && !id.includes("gptq") && !id.includes("awq");
  });

  const openArenaText = arenaText?.models.filter((m) => (m.license ?? "").toLowerCase() === "open") ?? [];

  const chatFromArena = arenaText?.models?.length
    ? buildCategoryFromEntries({
        id: "chat",
        label: "Chat LLMs",
        description: "Human preference ranking from Arena AI snapshots (includes frontier proprietary models).",
        metric: "Arena Elo",
        sourceName: "Arena AI snapshot API",
        sourceUrl: arenaText.meta.source_url ?? "https://arena.ai/leaderboard/text",
        updatedAt: arenaText.meta.fetched_at ?? generatedAt,
        entries: arenaText.models.slice(0, 10).map((m, idx) => toArenaEntry(m, idx, arenaText.meta.source_url ?? "https://arena.ai/leaderboard/text")),
          externalLinks: [
            { title: "Arena AI — Text Leaderboard", url: "https://arena.ai/leaderboard/text" },
            { title: "Artificial Analysis — LLM Rankings", url: "https://artificialanalysis.ai/" },
            { title: "OpenRouter — Model Rankings", url: "https://openrouter.ai/rankings" },
            { title: "Papers with Code — SOTA Leaderboards", url: "https://paperswithcode.com/sota" },
          ],
        })
      : null;

  const localFromArena = openArenaText.length
    ? buildCategoryFromEntries({
        id: "local",
        label: "Local LLMs",
        description: "Open-license subset from Arena AI text leaderboard (good proxy for local-capable models).",
        metric: "Arena Elo (open-license subset)",
        sourceName: "Arena AI snapshot API",
        sourceUrl: arenaText?.meta.source_url ?? "https://arena.ai/leaderboard/text",
        updatedAt: arenaText?.meta.fetched_at ?? generatedAt,
        entries: openArenaText.slice(0, 10).map((m, idx) => toArenaEntry(m, idx, arenaText?.meta.source_url ?? "https://arena.ai/leaderboard/text")),
          externalLinks: [
            { title: "Arena AI — Text Leaderboard", url: "https://arena.ai/leaderboard/text" },
            { title: "Open LLM Leaderboard", url: "https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard" },
            { title: "Ollama Library", url: "https://ollama.com/library" },
            { title: "OpenRouter — Model Rankings", url: "https://openrouter.ai/rankings" },
            { title: "Papers with Code — SOTA Leaderboards", url: "https://paperswithcode.com/sota" },
          ],
        })
      : null;

  const imageFromArena = arenaImage?.models?.length
    ? buildCategoryFromEntries({
        id: "image",
        label: "Image Models",
        description: "Human-voted text-to-image ranking from Arena AI snapshots.",
        metric: "Arena Elo",
        sourceName: "Arena AI snapshot API",
        sourceUrl: arenaImage.meta.source_url ?? "https://arena.ai/leaderboard/text-to-image",
        updatedAt: arenaImage.meta.fetched_at ?? generatedAt,
        entries: arenaImage.models.slice(0, 10).map((m, idx) => toArenaEntry(m, idx, arenaImage.meta.source_url ?? "https://arena.ai/leaderboard/text-to-image")),
          externalLinks: [
            { title: "Arena AI — Text to Image", url: "https://arena.ai/leaderboard/text-to-image" },
            { title: "Artificial Analysis — Image Models", url: "https://artificialanalysis.ai/text-to-image" },
            { title: "Hugging Face — Text to Image", url: "https://huggingface.co/models?pipeline_tag=text-to-image" },
            { title: "OpenRouter — Model Rankings", url: "https://openrouter.ai/rankings" },
          ],
        })
      : null;

  const videoFromArena = arenaVideo?.models?.length
    ? buildCategoryFromEntries({
        id: "video",
        label: "Video Models",
        description: "Human-voted text-to-video ranking from Arena AI snapshots.",
        metric: "Arena Elo",
        sourceName: "Arena AI snapshot API",
        sourceUrl: arenaVideo.meta.source_url ?? "https://arena.ai/leaderboard/text-to-video",
        updatedAt: arenaVideo.meta.fetched_at ?? generatedAt,
        entries: arenaVideo.models.slice(0, 10).map((m, idx) => toArenaEntry(m, idx, arenaVideo.meta.source_url ?? "https://arena.ai/leaderboard/text-to-video")),
        externalLinks: [
          { title: "Arena AI — Text to Video", url: "https://arena.ai/leaderboard/text-to-video" },
          { title: "Artificial Analysis — Video Models", url: "https://artificialanalysis.ai/text-to-video" },
          { title: "Hugging Face — Text to Video", url: "https://huggingface.co/models?pipeline_tag=text-to-video" },
        ],
      })
    : null;

  const chatFromHf =
    chatCandidates.length > 0
      ? buildCategory({
          id: "chat",
          label: "Chat LLMs",
          description: "Top chat-oriented models by Hugging Face downloads.",
          metric: "Hugging Face downloads",
          sourceName: "Hugging Face API",
          sourceUrl: "https://huggingface.co/models?pipeline_tag=text-generation&sort=downloads",
          updatedAt: generatedAt,
          models: chatCandidates,
          externalLinks: [
            { title: "Arena AI — Text Leaderboard", url: "https://arena.ai/leaderboard/text" },
            { title: "Artificial Analysis — LLM Rankings", url: "https://artificialanalysis.ai/" },
            { title: "OpenRouter — Model Rankings", url: "https://openrouter.ai/rankings" },
          ],
        })
      : null;

  const localFromHf =
    localCandidates.length > 0
      ? buildCategory({
          id: "local",
          label: "Local LLMs",
          description: "Open-weight models suitable for local/self-hosted usage, ranked by downloads.",
          metric: "Hugging Face downloads",
          sourceName: "Hugging Face API",
          sourceUrl: "https://huggingface.co/models?pipeline_tag=text-generation&sort=downloads",
          updatedAt: generatedAt,
          models: localCandidates,
          externalLinks: [
            { title: "Arena AI — Text Leaderboard", url: "https://arena.ai/leaderboard/text" },
            { title: "Open LLM Leaderboard", url: "https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard" },
            { title: "Ollama Library", url: "https://ollama.com/library" },
            { title: "OpenRouter — Model Rankings", url: "https://openrouter.ai/rankings" },
          ],
        })
      : null;

  const imageFromHf =
    imageModels.length > 0
      ? buildCategory({
          id: "image",
          label: "Image Models",
          description: "Text-to-image models ranked by live Hugging Face downloads.",
          metric: "Hugging Face downloads",
          sourceName: "Hugging Face API",
          sourceUrl: "https://huggingface.co/models?pipeline_tag=text-to-image&sort=downloads",
          updatedAt: generatedAt,
          models: imageModels,
          externalLinks: [
            { title: "Arena AI — Text to Image", url: "https://arena.ai/leaderboard/text-to-image" },
            { title: "Artificial Analysis — Image Models", url: "https://artificialanalysis.ai/text-to-image" },
            { title: "Hugging Face — Text to Image", url: "https://huggingface.co/models?pipeline_tag=text-to-image" },
          ],
        })
      : null;

  const videoFromHf =
    videoModels.length > 0
      ? buildCategory({
          id: "video",
          label: "Video Models",
          description: "Text-to-video model momentum based on Hugging Face downloads.",
          metric: "Hugging Face downloads",
          sourceName: "Hugging Face API",
          sourceUrl: "https://huggingface.co/models?pipeline_tag=text-to-video&sort=downloads",
          updatedAt: generatedAt,
          models: videoModels,
          externalLinks: [
            { title: "Arena AI — Text to Video", url: "https://arena.ai/leaderboard/text-to-video" },
            { title: "Artificial Analysis — Video Models", url: "https://artificialanalysis.ai/text-to-video" },
            { title: "Hugging Face — Text to Video", url: "https://huggingface.co/models?pipeline_tag=text-to-video" },
          ],
        })
      : null;

  const audioFromHf =
    audioModels.length > 0
      ? buildCategory({
          id: "audio",
          label: "Audio Models",
          description: "Text-to-audio and speech models ranked by Hugging Face downloads.",
          metric: "Hugging Face downloads",
          sourceName: "Hugging Face API",
          sourceUrl: "https://huggingface.co/models?pipeline_tag=text-to-audio&sort=downloads",
          updatedAt: generatedAt,
          models: audioModels,
          externalLinks: [
            { title: "Hugging Face — Text to Audio", url: "https://huggingface.co/models?pipeline_tag=text-to-audio" },
            { title: "Hugging Face — Text to Speech", url: "https://huggingface.co/models?pipeline_tag=text-to-speech" },
            { title: "Papers with Code — SOTA Leaderboards", url: "https://paperswithcode.com/sota" },
          ],
        })
      : null;

  const categories: Record<RankingCategoryId, RankingCategory> = {
    chat: resolveCategory({
      source: selectedSources.chat,
      preferredArena: chatFromArena,
      preferredHf: chatFromHf,
      fallback: fallbackCategory("chat", generatedAt),
    }),
    local: resolveCategory({
      source: selectedSources.local,
      preferredArena: localFromArena,
      preferredHf: localFromHf,
      fallback: fallbackCategory("local", generatedAt),
    }),
    image: resolveCategory({
      source: selectedSources.image,
      preferredArena: imageFromArena,
      preferredHf: imageFromHf,
      fallback: fallbackCategory("image", generatedAt),
    }),
    video: resolveCategory({
      source: selectedSources.video,
      preferredArena: videoFromArena,
      preferredHf: videoFromHf,
      fallback: fallbackCategory("video", generatedAt),
    }),
    audio: resolveCategory({
      source: selectedSources.audio,
      preferredArena: null,
      preferredHf: audioFromHf,
      fallback: fallbackCategory("audio", generatedAt),
    }),
  };

  return {
    generatedAt,
    revalidateSeconds: RANKINGS_REVALIDATE_SECONDS,
    categories,
    sourceSelection: selectedSources,
    sourceOptions: SOURCE_OPTIONS,
  };
}
