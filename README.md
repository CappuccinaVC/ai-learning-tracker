# AI Learning Tracker

A modern, gamified Next.js dashboard that turns your 4 AI mastery markdown files into an interactive progress tracker.

## Why this project

- Learn AI with a structured roadmap instead of random tutorials.
- Track progress with XP, levels, streaks, and weekly focus.
- Stay local-first with no required login.

## Public demo

- [![Live Demo](https://img.shields.io/badge/Live-Demo-22c55e?style=for-the-badge)](https://ai-learning-tracker-smoky.vercel.app/)

## Screenshots

Add 2-4 screenshots before or after first publish (you can update anytime):

```md
![Dashboard](./screenshots/dashboard.png)
![Roadmap](./screenshots/roadmap.png)
![Rankings](./screenshots/rankings.png)
```

Recommended folder: `./screenshots/`

## Features

- **Pre-Flight Setup** — Interactive checklist for browser workspace/profile, dedicated email, accounts, and software installs
- **Main Roadmap** — All 40 weeks of `AI_Mastery_Roadmap.md` as expandable phases
- **Image / Video / Audio Tracks** — 12-week parallel specialization tracks with JSON prompting tips
- **Tools Inventory** — Filterable catalog of 70+ tools with install status
- **Courses Library** — All courses filtered by track, phase, cost
- **Achievements** — 26 badges across 4 rarities + 10-level XP progression
- **Gamification** — XP per task, level-up with custom titles ("Curious Beginner" → "Elite AI Operator"), daily streak fire, weekly capstone bonuses
- **Local-first** — Works instantly via localStorage. Export/import JSON anytime
- **Cloud sync (optional)** — Plug in Supabase env vars for cross-device sync via auth

## No-login by default

- Users can start immediately without accounts.
- Progress is saved per-browser using localStorage.
- Export/import is available for backups.

## Quick start (local)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Progress auto-saves to your browser's localStorage.

### Easy commands (Windows + Linux)

```bash
npm run setup
npm run dev
```

Or use one command to install + run locally:

```bash
npm run local
```

If you ever get a stale Next.js chunk error like `Cannot find module './276.js'`, run:

```bash
npm run dev:clean
```

For a pre-publish check:

```bash
npm run check
```

## Enable Supabase cross-device sync (optional but recommended)

### 1. Create a free Supabase project
- Go to https://supabase.com → New Project (free tier: 500 MB DB, unlimited auth)
- Copy your **Project URL** and **anon public key** from Project Settings → API

### 2. Set up the database
In the Supabase SQL editor, run:

```sql
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "Users read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users upsert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);
```

### 3. Configure env vars
Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_GITHUB_REPO_URL=https://github.com/YOUR_USERNAME/ai-learning-tracker
```

Restart `npm run dev`.

## Publish to GitHub (Web + Desktop, beginner-safe)

1. On GitHub Web, create a new repository:
   - Name: `ai-learning-tracker` (or your preferred name)
   - Visibility: `Public`
   - Leave `README`, `.gitignore`, and `License` unchecked (because this project already has files)
2. In GitHub Desktop:
   - `File` -> `Add Local Repository...`
   - Select this project folder (the folder containing `package.json`)
3. If prompted, initialize git for this folder.
4. In Desktop, set/publish remote to your GitHub repo URL.
5. Commit all files with message: `Initial public release`.
6. Click `Push origin`.
7. Refresh GitHub Web and verify files are visible.

Tip: Repo description on GitHub is edited separately in the GitHub Web UI (About section). README content appears on the repo homepage below that description.

## Deploy to Netlify

```bash
npm run build
```

Then:
- Connect your GitHub repo (recommended): push to GitHub, then "Add new site" -> "Import from Git" on Netlify
- Add your Supabase env vars in Netlify -> Site Settings -> Environment Variables

## Deploy to Vercel (recommended for Next.js)

1. Push this repo to GitHub
2. Import the repo in Vercel
3. Add optional env vars from `.env.local.example`
4. Deploy

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **React 19**
- **TailwindCSS** + shadcn/ui patterns + Lucide icons
- **Framer Motion** for animations
- **Zustand** + localStorage persistence
- **Supabase** (optional) for auth + sync
- **Sonner** for toasts

## File structure

```
project-root/
├── app/
│   ├── layout.tsx           # Root with sidebar, topbar, providers
│   ├── page.tsx             # Dashboard
│   ├── setup/page.tsx       # Pre-flight checklist
│   ├── roadmap/page.tsx     # Main 40-week roadmap
│   ├── image/page.tsx       # Image track
│   ├── video/page.tsx       # Video track
│   ├── audio/page.tsx       # Audio track
│   ├── tools/page.tsx       # Tools inventory
│   ├── courses/page.tsx     # Courses library
│   ├── achievements/page.tsx # Badges + levels
│   ├── settings/page.tsx    # Export/import/reset
│   └── track-page.tsx       # Shared track template
├── components/
│   ├── ui/                  # Button, Card, Badge, Progress, Tabs, Dialog, etc.
│   ├── sidebar.tsx
│   ├── topbar.tsx
│   ├── mobile-nav.tsx
│   ├── task-item.tsx        # Task with status/notes/XP
│   ├── xp-ring.tsx          # Animated circular XP progress
│   ├── theme-provider.tsx
│   └── hydration-guard.tsx
└── lib/
    ├── store.ts             # Zustand store with persist
    ├── xp-engine.ts         # Levels + XP values
    ├── supabase.ts          # Supabase client (optional)
    ├── utils.ts
    └── data/
        ├── types.ts
        ├── phases.ts        # 7 phases
        ├── plan.ts          # 40 weeks + 12 weeks * 3 tracks
        ├── setup.ts         # Pre-flight items
        ├── tools.ts         # 70+ tools
        ├── courses.ts       # ~30 courses
        └── badges.ts        # 26 badges
```

## Adding more content

All content lives in `lib/data/*.ts` as plain TypeScript arrays. Add tasks, tools, or courses by editing those files. No CMS needed.

## Backup

Go to Settings → Export JSON. Save the file. Re-import anytime.

## Contributing

Please read `CONTRIBUTING.md` before opening a PR.

## Security

Please read `SECURITY.md` for vulnerability reporting.

## License

MIT — see `LICENSE`.
