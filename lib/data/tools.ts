import type { Tool } from "./types";

export const TOOLS: Tool[] = [
  // Phase 0 — Core dev
  { id: "python", name: "Python", category: "Language", track: ["main"], cost: "free", url: "https://www.python.org/downloads/", description: "Lingua franca of AI. Main language for scripting, APIs, notebooks.", priority: "essential", whenPhase: 0 },
  { id: "vscode", name: "VS Code", category: "Editor", track: ["main"], cost: "free", url: "https://code.visualstudio.com/", description: "Primary coding environment. Industry standard.", priority: "essential", whenPhase: 0 },
  { id: "git", name: "Git", category: "Version Control", track: ["main"], cost: "free", url: "https://git-scm.com/", description: "Version control for every project.", priority: "essential", whenPhase: 0 },
  { id: "node", name: "Node.js LTS", category: "Runtime", track: ["main"], cost: "free", url: "https://nodejs.org/", description: "For the tracker website + many AI tools.", priority: "essential", whenPhase: 0 },
  { id: "obsidian", name: "Obsidian", category: "Knowledge", track: ["main"], cost: "freemium", url: "https://obsidian.md/", description: "Your AI second brain. Local markdown notes.", priority: "essential", whenPhase: 0 },

  // Phase 1-2 — Foundations
  { id: "anaconda", name: "Anaconda", category: "Env Mgmt", track: ["main"], cost: "free", url: "https://www.anaconda.com/download", description: "Python distribution + conda package manager.", priority: "essential", whenPhase: 1 },
  { id: "jupyter", name: "JupyterLab", category: "Notebook", track: ["main"], cost: "free", url: "https://jupyter.org/install", description: "Interactive Python notebooks.", priority: "essential", whenPhase: 1 },
  { id: "chatgpt", name: "ChatGPT", category: "AI Assistant", track: ["main"], cost: "freemium", priceNote: "Plus $20/mo", url: "https://chatgpt.com/", description: "Daily reasoning partner, concept explainer, code helper.", priority: "essential", whenPhase: 0 },
  { id: "claude", name: "Claude", category: "AI Assistant", track: ["main"], cost: "freemium", priceNote: "Pro $20/mo", url: "https://claude.ai/", description: "Long-context reading, writing, synthesis. Best for learning.", priority: "essential", whenPhase: 0 },
  { id: "gemini", name: "Gemini", category: "AI Assistant", track: ["main"], cost: "freemium", priceNote: "Advanced $20/mo", url: "https://gemini.google.com", description: "Google's AI; 1M token context on free tier.", priority: "recommended", whenPhase: 0 },
  { id: "perplexity", name: "Perplexity", category: "AI Search", track: ["main"], cost: "freemium", priceNote: "Pro $20/mo", url: "https://perplexity.ai", description: "AI search with citations.", priority: "recommended", whenPhase: 0 },

  // Phase 2 — Prompt eval
  { id: "promptfoo", name: "Promptfoo", category: "Eval", track: ["main"], cost: "free", url: "https://www.promptfoo.dev/", description: "OSS prompt testing, red-teaming.", priority: "essential", whenPhase: 2 },
  { id: "openrouter", name: "OpenRouter", category: "Inference", track: ["main"], cost: "freemium", url: "https://openrouter.ai", description: "Many models, one API.", priority: "essential", whenPhase: 2 },

  // Phase 3 — Local LLM stack
  { id: "ollama", name: "Ollama", category: "Local LLM", track: ["main"], cost: "free", url: "https://ollama.com/", install: "Download installer", description: "Run local LLMs via CLI.", priority: "essential", whenPhase: 2 },
  { id: "lmstudio", name: "LM Studio", category: "Local LLM", track: ["main"], cost: "free", url: "https://lmstudio.ai/", description: "GUI local model runner.", priority: "recommended", whenPhase: 2 },
  { id: "anythingllm", name: "AnythingLLM", category: "Local RAG", track: ["main"], cost: "free", url: "https://anythingllm.com/", description: "Local-first chat with documents.", priority: "essential", whenPhase: 2 },
  { id: "openwebui", name: "Open WebUI", category: "Local LLM UI", track: ["main"], cost: "free", url: "https://openwebui.com/", description: "Browser UI for local models.", priority: "recommended", whenPhase: 2 },

  // Phase 3 — Automation
  { id: "n8n", name: "n8n", category: "Automation", track: ["main"], cost: "freemium", url: "https://n8n.io/", description: "Low-code AI workflows, agents, MCP, RAG.", priority: "essential", whenPhase: 3 },
  { id: "zapier", name: "Zapier", category: "Automation", track: ["main"], cost: "freemium", url: "https://zapier.com/", description: "No-code automations.", priority: "recommended", whenPhase: 3 },
  { id: "make", name: "Make (Integromat)", category: "Automation", track: ["main"], cost: "freemium", url: "https://www.make.com/", description: "Visual automation, clearer logic than Zapier.", priority: "recommended", whenPhase: 3 },
  { id: "langflow", name: "Langflow", category: "Agent Builder", track: ["main"], cost: "free", url: "https://www.langflow.org/", description: "Visual LangChain builder.", priority: "recommended", whenPhase: 3 },

  // Phase 4 — Frameworks
  { id: "langchain", name: "LangChain", category: "Framework", track: ["main"], cost: "free", url: "https://python.langchain.com", description: "Framework for LLM-powered apps.", priority: "essential", whenPhase: 4 },
  { id: "llamaindex", name: "LlamaIndex", category: "RAG", track: ["main"], cost: "free", url: "https://docs.llamaindex.ai", description: "RAG pipelines and document querying.", priority: "essential", whenPhase: 4 },
  { id: "hf-transformers", name: "Hugging Face Transformers", category: "Library", track: ["main"], cost: "free", url: "https://huggingface.co/transformers", description: "Run/fine-tune open-source models.", priority: "essential", whenPhase: 4 },
  { id: "gradio", name: "Gradio", category: "UI Framework", track: ["main"], cost: "free", url: "https://www.gradio.app", description: "Build demo UIs for AI models.", priority: "essential", whenPhase: 4 },
  { id: "streamlit", name: "Streamlit", category: "UI Framework", track: ["main"], cost: "freemium", url: "https://streamlit.io", description: "AI web apps in pure Python.", priority: "essential", whenPhase: 4 },
  { id: "fastapi", name: "FastAPI", category: "API Framework", track: ["main"], cost: "free", url: "https://fastapi.tiangolo.com", description: "Serve AI models via API.", priority: "recommended", whenPhase: 4 },

  // Phase 4 — Coding accelerators
  { id: "copilot", name: "GitHub Copilot", category: "Coding AI", track: ["main"], cost: "freemium", priceNote: "Pro $10/mo (free for students)", url: "https://github.com/features/copilot", description: "AI autocomplete in VS Code.", priority: "recommended", whenPhase: 4 },
  { id: "cursor", name: "Cursor", category: "AI IDE", track: ["main"], cost: "freemium", priceNote: "Pro $20/mo", url: "https://cursor.com/", description: "AI-first IDE. Multi-file edits.", priority: "recommended", whenPhase: 4 },
  { id: "windsurf", name: "Windsurf", category: "AI IDE", track: ["main"], cost: "freemium", url: "https://codeium.com/windsurf", description: "Agentic IDE from Codeium.", priority: "recommended", whenPhase: 4 },

  // Phase 5 — Agents
  { id: "crewai", name: "CrewAI", category: "Multi-Agent", track: ["main"], cost: "free", url: "https://crewai.com", description: "Build multi-agent AI systems.", priority: "recommended", whenPhase: 5 },
  { id: "autogen", name: "AutoGen", category: "Multi-Agent", track: ["main"], cost: "free", url: "https://microsoft.github.io/autogen", description: "Microsoft's multi-agent framework.", priority: "recommended", whenPhase: 5 },
  { id: "langgraph", name: "LangGraph", category: "Agent Framework", track: ["main"], cost: "free", url: "https://langchain-ai.github.io/langgraph/", description: "Stateful agent graphs.", priority: "recommended", whenPhase: 5 },

  // Phase 5-6 — Deployment
  { id: "docker", name: "Docker Desktop", category: "Container", track: ["main"], cost: "freemium", url: "https://www.docker.com/products/docker-desktop/", description: "Reproducible local AI environments.", priority: "recommended", whenPhase: 5 },
  { id: "hf-spaces", name: "Hugging Face Spaces", category: "Hosting", track: ["main"], cost: "freemium", url: "https://huggingface.co/spaces", description: "Free hosting for AI demos.", priority: "essential", whenPhase: 5 },
  { id: "vercel", name: "Vercel", category: "Hosting", track: ["main"], cost: "freemium", url: "https://vercel.com", description: "Deploy Next.js / web apps.", priority: "essential", whenPhase: 5 },
  { id: "netlify", name: "Netlify", category: "Hosting", track: ["main"], cost: "freemium", url: "https://netlify.com", description: "Deploy static sites.", priority: "essential", whenPhase: 5 },
  { id: "supabase", name: "Supabase", category: "Backend", track: ["main"], cost: "freemium", url: "https://supabase.com", description: "Postgres + auth + storage backend.", priority: "essential", whenPhase: 5 },

  // === IMAGE ===
  { id: "comfyui", name: "ComfyUI", category: "Local Gen", track: ["image", "video"], cost: "free", url: "https://docs.comfy.org/", description: "Node-based local image/video generation workflows.", priority: "essential", whenPhase: 3 },
  { id: "forge", name: "Forge", category: "Local Gen", track: ["image"], cost: "free", url: "https://github.com/lllyasviel/stable-diffusion-webui-forge", description: "A1111 fork with Flux support, fast on lower VRAM.", priority: "recommended", whenPhase: 3 },
  { id: "a1111", name: "Automatic1111", category: "Local Gen", track: ["image"], cost: "free", url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui", description: "Classic local SD web UI.", priority: "recommended", whenPhase: 3 },
  { id: "midjourney", name: "Midjourney", category: "Cloud Gen", track: ["image"], cost: "paid", priceNote: "$10-120/mo", url: "https://midjourney.com", description: "Best-in-class artistic image generation.", priority: "recommended", whenPhase: 3 },
  { id: "leonardo", name: "Leonardo.ai", category: "Cloud Gen", track: ["image"], cost: "freemium", priceNote: "Pro $12/mo", url: "https://leonardo.ai", description: "Creative suite with realtime canvas.", priority: "recommended", whenPhase: 3 },
  { id: "ideogram", name: "Ideogram", category: "Cloud Gen", track: ["image"], cost: "freemium", url: "https://ideogram.ai", description: "Best for text inside images, typography.", priority: "recommended", whenPhase: 3 },
  { id: "flux-pro", name: "Flux 1.1 Pro / Flux 2 Pro", category: "Cloud Gen", track: ["image"], cost: "paid", url: "https://blackforestlabs.ai", description: "Frontier photorealism. Via fal.ai or Replicate.", priority: "recommended", whenPhase: 3 },
  { id: "recraft", name: "Recraft", category: "Cloud Gen", track: ["image"], cost: "freemium", url: "https://recraft.ai", description: "Design-first; generates native SVG.", priority: "recommended", whenPhase: 3 },
  { id: "magnific", name: "Magnific", category: "Upscaler", track: ["image"], cost: "paid", priceNote: "$39+/mo", url: "https://magnific.ai", description: "Best creative upscaling.", priority: "recommended", whenPhase: 3 },
  { id: "krea", name: "Krea AI", category: "Realtime", track: ["image"], cost: "freemium", url: "https://krea.ai", description: "Realtime canvas for image+video.", priority: "recommended", whenPhase: 3 },
  { id: "civitai", name: "Civitai", category: "Model Hub", track: ["image"], cost: "free", url: "https://civitai.com", description: "Free model & LoRA marketplace.", priority: "essential", whenPhase: 3 },

  // === VIDEO ===
  { id: "veo", name: "Veo 3.1", category: "Cloud Gen", track: ["video"], cost: "paid", url: "https://deepmind.google", description: "Google's frontier video model. Native audio. Best for cinematic.", priority: "essential", whenPhase: 3 },
  { id: "kling", name: "Kling 3.0", category: "Cloud Gen", track: ["video"], cost: "paid", url: "https://klingai.com", description: "Best for human-centric narratives, character consistency.", priority: "recommended", whenPhase: 3 },
  { id: "runway", name: "Runway Gen-4.5", category: "Cloud Gen", track: ["video"], cost: "freemium", priceNote: "$12+/mo", url: "https://runwayml.com", description: "Pro video gen + editing suite.", priority: "recommended", whenPhase: 3 },
  { id: "pika", name: "Pika 2.0", category: "Cloud Gen", track: ["video"], cost: "freemium", priceNote: "$8/mo+", url: "https://pika.art", description: "Quick scenes, social content.", priority: "recommended", whenPhase: 3 },
  { id: "fal", name: "fal.ai", category: "Aggregator", track: ["video", "image"], cost: "paid", url: "https://fal.ai", description: "API aggregator for video/image models.", priority: "essential", whenPhase: 4 },
  { id: "wan", name: "Wan 2.6", category: "Local Gen", track: ["video"], cost: "open_source", url: "https://github.com/Wan-Video", description: "Open-source video model. Cloud via fal.ai.", priority: "recommended", whenPhase: 5 },
  { id: "hunyuanvideo", name: "HunyuanVideo", category: "Local Gen", track: ["video"], cost: "open_source", url: "https://huggingface.co/tencent/HunyuanVideo", description: "Tencent's open video model. 24GB+ VRAM.", priority: "optional", whenPhase: 5 },
  { id: "ltxvideo", name: "LTX-Video", category: "Local Gen", track: ["video"], cost: "open_source", url: "https://huggingface.co/Lightricks/LTX-Video", description: "Fast open-source video. 12GB VRAM.", priority: "recommended", whenPhase: 5 },
  { id: "topaz", name: "Topaz Video AI", category: "Post-Production", track: ["video"], cost: "paid", priceNote: "$299 one-time", url: "https://www.topazlabs.com/topaz-video-ai", description: "Best upscaler + frame interpolation.", priority: "optional", whenPhase: 3 },
  { id: "davinci", name: "DaVinci Resolve", category: "Editor", track: ["video"], cost: "freemium", url: "https://www.blackmagicdesign.com/products/davinciresolve", description: "Free pro NLE. Industry-grade.", priority: "essential", whenPhase: 3 },
  { id: "heygen", name: "HeyGen", category: "Avatar", track: ["video"], cost: "freemium", url: "https://heygen.com", description: "Best avatar/talking-head realism.", priority: "optional", whenPhase: 3 },

  // === AUDIO ===
  { id: "suno", name: "Suno v5", category: "Music Gen", track: ["audio"], cost: "freemium", priceNote: "Pro $10/mo", url: "https://suno.com", description: "Best text-to-song with vocals.", priority: "essential", whenPhase: 3 },
  { id: "udio", name: "Udio", category: "Music Gen", track: ["audio"], cost: "freemium", priceNote: "$10/mo", url: "https://udio.com", description: "Strong music model with inpaint/stem control.", priority: "recommended", whenPhase: 3 },
  { id: "elevenlabs", name: "ElevenLabs", category: "TTS / Voice", track: ["audio"], cost: "freemium", priceNote: "$5-330/mo", url: "https://elevenlabs.io", description: "Best TTS + voice cloning + dialogue.", priority: "essential", whenPhase: 3 },
  { id: "notebooklm", name: "NotebookLM", category: "Podcast AI", track: ["audio"], cost: "free", url: "https://notebooklm.google.com", description: "Two-host AI podcast from your sources.", priority: "essential", whenPhase: 3 },
  { id: "stable-audio", name: "Stable Audio", category: "Music Gen", track: ["audio"], cost: "freemium", url: "https://stableaudio.com", description: "Quick high-quality audio samples.", priority: "recommended", whenPhase: 3 },
  { id: "mureka", name: "Mureka", category: "Music Gen", track: ["audio"], cost: "freemium", url: "https://mureka.ai", description: "Strong for non-English music.", priority: "optional", whenPhase: 3 },
  { id: "cartesia", name: "Cartesia Sonic", category: "Realtime TTS", track: ["audio"], cost: "freemium", url: "https://cartesia.ai", description: "Lowest-latency realtime voice for agents.", priority: "recommended", whenPhase: 4 },
  { id: "deepgram", name: "Deepgram Nova-3", category: "STT", track: ["audio"], cost: "freemium", url: "https://deepgram.com", description: "Fastest STT API.", priority: "recommended", whenPhase: 4 },
  { id: "whisper", name: "OpenAI Whisper", category: "STT", track: ["audio"], cost: "open_source", url: "https://github.com/openai/whisper", description: "Best free open-source STT.", priority: "essential", whenPhase: 3 },
  { id: "audacity", name: "Audacity", category: "DAW", track: ["audio"], cost: "free", url: "https://www.audacityteam.org/download/", description: "Free open-source audio editor.", priority: "recommended", whenPhase: 3 },
  { id: "ffmpeg", name: "FFmpeg", category: "CLI Tool", track: ["audio", "video"], cost: "free", url: "https://ffmpeg.org/download.html", description: "Audio/video swiss army knife.", priority: "recommended", whenPhase: 3 },
  { id: "demucs", name: "Demucs", category: "Stem Separation", track: ["audio"], cost: "open_source", url: "https://github.com/facebookresearch/demucs", description: "Best free stem separation.", priority: "recommended", whenPhase: 3 },
  { id: "vapi", name: "Vapi", category: "Voice Agent", track: ["audio"], cost: "freemium", url: "https://vapi.ai", description: "Build phone-grade voice agents.", priority: "recommended", whenPhase: 5 },
  { id: "livekit", name: "LiveKit Agents", category: "Voice Agent", track: ["audio"], cost: "freemium", url: "https://livekit.io", description: "Open-source voice agent framework.", priority: "recommended", whenPhase: 5 },
];

export const TOOL_CATEGORIES = Array.from(new Set(TOOLS.map((t) => t.category))).sort();
