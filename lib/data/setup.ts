import type { SetupItem } from "./types";

export const SETUP_ITEMS: SetupItem[] = [
  // 1. Identity & Accounts
  { id: "gmail", category: "Identity", title: "Create dedicated AI email account", description: "Use any provider (Gmail, Proton, Outlook, etc.). Keep AI tool emails separate from personal inbox.", estimatedMinutes: 5 },
  { id: "chrome-profile", category: "Identity", title: "Create dedicated browser profile/workspace", description: "Set up an 'AI Learning' profile/container/workspace in your browser of choice (Chrome, Firefox, Brave, Edge).", estimatedMinutes: 5 },
  { id: "bitwarden", category: "Identity", title: "Install Bitwarden password manager", description: "Create vault, add 'AI Stack' folder. You'll create 40+ accounts.", url: "https://bitwarden.com/download/", estimatedMinutes: 10 },
  { id: "github", category: "Identity", title: "Create GitHub account", description: "Professional username. Add bio, avatar, profile README.", url: "https://github.com/join", estimatedMinutes: 15 },
  { id: "github-ssh", category: "Identity", title: "Add SSH key to GitHub", description: "ssh-keygen -t ed25519 -C 'yourname@yourdomain.com' then add to GitHub Settings → SSH Keys.", estimatedMinutes: 10 },
  { id: "github-student", category: "Identity", title: "Apply for GitHub Student Pack (if eligible)", description: "Free Copilot, free Notion Plus, free domain.", url: "https://education.github.com/pack", estimatedMinutes: 10 },

  // 2. AI Assistant Accounts
  { id: "acc-chatgpt", category: "AI Assistants", title: "Sign up: ChatGPT", description: "Free tier. Upgrade later in Phase 2.", url: "https://chatgpt.com", estimatedMinutes: 3 },
  { id: "acc-claude", category: "AI Assistants", title: "Sign up: Claude", description: "Free tier; upgrade to Pro in Phase 1 = highest learning ROI.", url: "https://claude.ai", estimatedMinutes: 3 },
  { id: "acc-gemini", category: "AI Assistants", title: "Sign up: Gemini", description: "Optional Google account flow; verify access if this model is part of your stack.", url: "https://gemini.google.com", estimatedMinutes: 2 },
  { id: "acc-perplexity", category: "AI Assistants", title: "Sign up: Perplexity", description: "AI search with citations.", url: "https://perplexity.ai", estimatedMinutes: 3 },
  { id: "acc-grok", category: "AI Assistants", title: "Sign up: Grok (optional)", description: "Via X/Twitter.", url: "https://x.com/i/grok", estimatedMinutes: 3 },

  // 3. Cloud / Developer Accounts
  { id: "acc-hf", category: "Cloud & Dev", title: "Sign up: Hugging Face", description: "The GitHub of AI. Models, datasets, Spaces.", url: "https://huggingface.co/join", estimatedMinutes: 5 },
  { id: "acc-kaggle", category: "Cloud & Dev", title: "Sign up: Kaggle", description: "Free GPU notebooks + datasets + learning modules.", url: "https://kaggle.com", estimatedMinutes: 3 },
  { id: "acc-openrouter", category: "Cloud & Dev", title: "Sign up: OpenRouter", description: "Multi-model API in one bill.", url: "https://openrouter.ai", estimatedMinutes: 3 },
  { id: "acc-replicate", category: "Cloud & Dev", title: "Sign up: Replicate", description: "Run open-source models via API.", url: "https://replicate.com", estimatedMinutes: 3 },
  { id: "acc-groq", category: "Cloud & Dev", title: "Sign up: Groq", description: "Ultra-fast Llama/Mixtral inference. Generous free tier.", url: "https://console.groq.com", estimatedMinutes: 3 },

  // 4. Software Install — Core Dev
  { id: "install-python", category: "Software", title: "Install Python 3.11+", description: "✅ Check 'Add Python to PATH' during install. Verify: `python --version`.", url: "https://www.python.org/downloads/", command: "python --version", estimatedMinutes: 10 },
  { id: "install-vscode", category: "Software", title: "Install VS Code + key extensions", description: "Extensions: Python, Pylance, Jupyter, Tailwind CSS IntelliSense, Prettier.", url: "https://code.visualstudio.com/", estimatedMinutes: 15 },
  { id: "install-git", category: "Software", title: "Install Git for Windows", description: "Set: git config --global user.name & user.email.", url: "https://git-scm.com/", command: 'git config --global user.name "Your Name"', estimatedMinutes: 10 },
  { id: "install-node", category: "Software", title: "Install Node.js LTS", description: "Required for the tracker website + many AI tools.", url: "https://nodejs.org/", command: "node --version", estimatedMinutes: 5 },
  { id: "install-terminal", category: "Software", title: "Install Windows Terminal (Win10 only)", description: "Skip if on Windows 11.", url: "ms-windows-store://pdp/?productid=9N0DX20HK701", estimatedMinutes: 2 },

  // 5. Knowledge Management
  {
    id: "install-obsidian",
    category: "Knowledge Mgmt",
    title: "Install Obsidian + create vault",
    description: "Vault: 'AI-Learning'. Folders: 00-Daily-Notes, 10-Prompts, 20-Projects, 30-Concepts, 40-Papers, 99-Archive.",
    url: "https://obsidian.md/",
    estimatedMinutes: 15,
    goal: "Set up the local, file-based second brain you'll use every day for the next 40 weeks.",
    note: `**Why Obsidian, not Google NotebookLM, Notion, or Apple Notes?**

NotebookLM is a *question-answering tool* over uploaded sources — it's brilliant for "summarize this PDF" and "generate a podcast from my notes". But it is NOT a note-taking app. You can't write linked, evolving daily notes inside it. It's a reader, not a writer.

Obsidian is the **writing + linking + archiving layer**; NotebookLM (or any RAG tool) is the **reading + querying layer on top of it**. You'll use both — but only Obsidian becomes "you" over time.

The 6 reasons Obsidian wins as your primary AI-learning vault:

1. **Local plain-text Markdown.** Your notes are .md files on disk. No vendor lock-in. Works offline. Survives any company shutdown (Notion, Roam, Evernote have all spooked users with pricing/policy changes). 10 years from now you can still grep them.

2. **Bidirectional links + graph.** Type \`[[Transformers]]\` anywhere and it auto-links across your whole vault. This is THE feature for learning interconnected topics like AI, where "attention", "tokens", "embeddings", "RAG", "agents" all reference each other. The graph view shows your mental model materialize.

3. **AI-friendly storage.** Because everything is plain .md, you can later (Phase 5) point your own RAG pipeline at the vault and chat with your notes via Claude/OpenAI APIs. You literally build your own NotebookLM, but personal and offline. Try doing that with Apple Notes.

4. **Daily-notes plugin** turns your journal into a date-keyed log that auto-creates "2026-05-11.md" each morning. Combined with templates, it makes the *ritual* of learning trivial to maintain — and ritual is what carries you through Week 17 when motivation dies.

5. **Plugins for free.** Dataview (query notes like SQL), Templater (smart templates), Excalidraw (sketch concepts), Calendar, Tasks, Spaced Repetition — all free, all community-built. You get a $500/yr Notion AI feature set for $0.

6. **Sync that respects you.** Obsidian Sync ($4/mo, end-to-end encrypted), or free via iCloud / Dropbox / a private git repo. NotebookLM has no concept of personal data sovereignty.

**Use NotebookLM as a complement** — upload your research PDFs there to "talk to them" while you take *durable* notes back in Obsidian. The Obsidian notes are what stay with you forever.`,
    steps: [
      "Download Obsidian for Windows from obsidian.md (free, no account needed).",
      "Launch → 'Create new vault' → name it `AI-Learning` → place it at `C:\\AI\\00-Notes\\AI-Learning` (matches the C:\\AI folder structure).",
      "In the new vault, create 6 folders: `00-Daily-Notes`, `10-Prompts`, `20-Projects`, `30-Concepts`, `40-Papers`, `99-Archive`.",
      "Settings → Core plugins → enable: **Daily Notes**, **Templates**, **Outgoing/Backlinks**, **Graph view**, **Tags pane**, **Page preview**.",
      "Settings → Daily notes → set the new-file location to `00-Daily-Notes` and date format to `YYYY-MM-DD`.",
      "Settings → Appearance → pick a comfortable theme (try 'Minimal' or 'Things'). Set base font size to your preference.",
      "Optional but recommended community plugins: **Dataview**, **Templater**, **Calendar**, **Excalidraw**.",
    ],
    successCriteria: [
      "Vault opens with the 6 folders visible in the file explorer",
      "Daily Notes plugin enabled and pointing at 00-Daily-Notes",
      "You can press Ctrl+P → 'Open today's daily note' and it creates a new file",
    ],
    resources: [
      { title: "Obsidian (download)", url: "https://obsidian.md/", type: "tool" },
      { title: "Obsidian Help — Getting started", url: "https://help.obsidian.md/Getting+started/Create+a+vault", type: "docs" },
      { title: "Linking Your Thinking — Nick Milo", url: "https://www.linkingyourthinking.com/", type: "article", note: "Optional, the canonical 'how to actually use Obsidian for learning' resource" },
    ],
  },

  {
    id: "first-daily-note",
    category: "Knowledge Mgmt",
    title: "Write your first daily note",
    description: "In Obsidian: 'Day 0 - Pre-Flight Complete'. Establish the ritual.",
    estimatedMinutes: 15,
    goal: "Establish the 5-minute daily learning ritual you'll repeat ~280 times across the next 40 weeks.",
    note: `**Why this matters more than it looks.**

The single highest-leverage habit for the entire 40-week journey is the **daily note ritual**. Not because any one entry is brilliant — most will be 4 lines. It matters because:

1. **It enforces a "what I learned today" reflection.** Without writing it down, 80% of what you study evaporates within 48 hours. With even 2 bullet points, you 4x retention.

2. **It compounds into your personal corpus.** By Week 20 you'll have ~140 daily notes. By Week 40, ~280. That's a searchable, linkable record of every Aha moment, every working prompt, every bug + fix. You will pull from it for years.

3. **It builds the streak.** The tracker rewards streaks with XP and badges. Daily note = daily check-in.

4. **It's the foundation for "chat with your notes" (Phase 5).** When you build a RAG pipeline over your vault in W22, the daily notes will be the most useful corpus to query against. Without daily notes you'll have nothing meaningful to RAG over.

**The structure (memorize this).** Every daily note is the same 5 sections. Same names. Same order. Boring is good — rituals work because they're identical every time. You should be able to write one in 4-7 minutes when you're tired.

The 5 sections are: **🎯 Today**, **⚡ Did**, **🧠 Learned**, **🤖 Prompts**, **🌱 Tomorrow**. That's it. No section is required to have content — leave it empty if you didn't touch it.

**For Day 0**, your first entry has only one job: prove the ritual works. Open Obsidian, paste the template below, fill it in honestly even if half the sections are short, save it. Tomorrow do it again. By Day 7 you won't think about it; by Day 30 it'll feel weird NOT to.`,
    steps: [
      "In Obsidian, press `Ctrl+P` → type 'Open today's daily note' → press Enter. A file like `2026-05-11.md` appears in `00-Daily-Notes/`.",
      "Paste the **Daily Note Template** below into the empty file.",
      "Fill in TODAY's entry honestly. For Day 0, the Did section is 'Pre-Flight setup complete'. The Learned section is whatever clicked for you while setting up.",
      "Save (Ctrl+S). That's it — the ritual is alive.",
      "Optional power move: open Settings → Templates → set the Template folder to `99-Archive/Templates` and save the template below as `99-Archive/Templates/daily-note.md`. Then in Daily Notes settings, point the template option at this file so each new day auto-loads it.",
    ],
    successCriteria: [
      "One daily note file exists in 00-Daily-Notes named YYYY-MM-DD.md",
      "All 5 sections are present (even if some are empty)",
      "At least 1 bullet in 'Learned' and 1 prompt in 'Prompts' (Day 0 setup counts)",
    ],
    template: `# {{date:YYYY-MM-DD}} — Day {{N}}

> **Phase:** _0–6_  |  **Week:** _1–40_  |  **Streak:** _N days_  |  **Focus:** _one sentence_

---

## 🎯 Today — what I'm trying to learn or build
- _One concrete outcome. Not "study AI" — "finish Karpathy lecture 1 + take notes on attention"._

## ⚡ Did — what actually happened
- _3–5 bullets. Tasks completed from the tracker. Stuff I shipped. Time spent._
- _Be honest: "Watched 20 min of Karpathy, got distracted, came back" is more useful than fake productivity theater._

## 🧠 Learned — the most useful 1–3 ideas
- _The "if I forgot everything else, I'd want to remember this" list._
- _Link to deeper notes with [[Concept Name]] — e.g. [[Attention]], [[Tokens]], [[RAG]]._
- _If you learned nothing, write that. Honest empty days are data._

## 🤖 Prompts — anything I wrote that worked (or didn't)
- _Paste the prompt + 1-line note on what worked / what to fix next time._
- _These become your private prompt library. By Week 10 you'll have 50+ tested patterns._

\`\`\`text
[Paste prompt here]
\`\`\`

## 🌱 Tomorrow — the first thing I'll do
- _One sentence. Not a to-do list. The single first action when I open the laptop tomorrow._
- _Example: "Open VS Code and run the Ollama Python script from W19-ollama-py."_

---

**Tags:** #daily #phase-{{phase}} #week-{{week}}
**Vibes:** _1–5_  |  **Energy:** _1–5_  |  **Sleep:** _hours_
`,
    templateLanguage: "markdown",
    resources: [
      { title: "Obsidian Daily Notes (docs)", url: "https://help.obsidian.md/Plugins/Daily+notes", type: "docs" },
      { title: "Templater plugin", url: "https://github.com/SilentVoid13/Templater", type: "tool", note: "Optional: auto-fill {{date}} / {{N}} variables in templates" },
    ],
  },

  // 6. AI Desktop Apps
  { id: "install-chatgpt-app", category: "AI Desktop Apps", title: "Install ChatGPT Desktop", description: "Native app, faster than browser.", url: "https://openai.com/chatgpt/download/", estimatedMinutes: 5 },
  { id: "install-claude-app", category: "AI Desktop Apps", title: "Install Claude Desktop", description: "Native app with project memory.", url: "https://claude.ai/download", estimatedMinutes: 5 },
  { id: "install-lmstudio", category: "AI Desktop Apps", title: "Install LM Studio", description: "GUI local LLM runner. Try downloading a small model after install.", url: "https://lmstudio.ai/", estimatedMinutes: 15 },

  // 7. Folder Structure
  { id: "folder-structure", category: "Workspace", title: "Create C:\\AI folder structure", description: "Folders: 00-Notes, 01-Courses, 02-Prompts, 03-Projects, 04-Models, 05-Datasets, 06-Outputs (image/video/audio), 99-Archive.", estimatedMinutes: 10 },

  // 8. Bookmarks
  { id: "bookmarks", category: "Workspace", title: "Set up browser bookmark folders", description: "01-Daily, 02-Active-Courses, 03-Build, 04-Image, 05-Video, 06-Audio, 07-Reference, 08-Communities.", estimatedMinutes: 15 },

  // 9. Communities — Discord
  { id: "discord-dair", category: "Communities", title: "Join Discord: DAIR.AI", description: "Prompt engineering community.", url: "https://discord.gg/dair-ai", estimatedMinutes: 3 },
  { id: "discord-hf", category: "Communities", title: "Join Discord: Hugging Face", description: "Open-source AI hub.", url: "https://discord.gg/hugging-face", estimatedMinutes: 3 },
  { id: "discord-langchain", category: "Communities", title: "Join Discord: LangChain", description: "Agents & LLM apps.", url: "https://discord.gg/langchain", estimatedMinutes: 3 },
  { id: "discord-comfyui", category: "Communities", title: "Join Discord: ComfyUI", description: "Local image generation.", url: "https://github.com/comfyanonymous/ComfyUI", estimatedMinutes: 3 },
  { id: "discord-buildclub", category: "Communities", title: "Join Build Club", description: "Active AI builder community.", url: "https://buildclub.ai", estimatedMinutes: 3 },

  // 10. Subreddits
  { id: "reddit-subs", category: "Communities", title: "Subscribe: r/LocalLLaMA, r/MachineLearning, r/StableDiffusion, r/aivideo, r/SunoAI", description: "5 essential subreddits.", url: "https://reddit.com", estimatedMinutes: 5 },

  // 11. Newsletters
  { id: "news-rundown", category: "Newsletters", title: "Subscribe: The Rundown AI", description: "Daily AI news digest.", url: "https://www.therundown.ai", estimatedMinutes: 2 },
  { id: "news-batch", category: "Newsletters", title: "Subscribe: The Batch (DeepLearning.AI)", description: "Weekly, Andrew Ng's editorial.", url: "https://www.deeplearning.ai/the-batch", estimatedMinutes: 2 },
  { id: "news-alphasignal", category: "Newsletters", title: "Subscribe: AlphaSignal", description: "Daily ML research summary.", url: "https://alphasignal.ai", estimatedMinutes: 2 },
  { id: "news-tldr", category: "Newsletters", title: "Subscribe: TLDR AI", description: "Daily, 5-min read.", url: "https://tldr.tech/ai", estimatedMinutes: 2 },

  // 12. YouTube
  { id: "yt-channels", category: "Newsletters", title: "Subscribe to 10+ YouTube channels", description: "3Blue1Brown, Andrej Karpathy, DeepLearning.AI, Hugging Face, MIT 6.S191, Yannic Kilcher, AI Explained, Matt Wolfe, Matthew Berman, Lex Fridman.", url: "https://youtube.com", estimatedMinutes: 10 },

  // 13. Final
  { id: "tracker-bookmark", category: "Final", title: "Bookmark this tracker as #1 in your Daily folder", description: "It's your command center. Open every morning.", estimatedMinutes: 1 },
  { id: "preflight-complete", category: "Final", title: "🎉 Pre-flight complete — earn your first badge!", description: "Click to claim 'Pre-Flight Complete' badge and unlock the roadmap.", estimatedMinutes: 1 },
];

export const SETUP_CATEGORIES = [
  "Identity",
  "AI Assistants",
  "Cloud & Dev",
  "Software",
  "Knowledge Mgmt",
  "AI Desktop Apps",
  "Workspace",
  "Communities",
  "Newsletters",
  "Final",
];
