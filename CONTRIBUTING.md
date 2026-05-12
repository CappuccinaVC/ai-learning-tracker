# Contributing

Thanks for your interest in improving AI Learning Tracker.

## Ground rules

- Keep changes focused and small.
- Prefer simple, readable solutions over clever ones.
- Do not include secrets, tokens, or private data in commits.
- Preserve local-first behavior (no forced login flows).

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Before opening a PR

```bash
npm run build
```

A PR should include:

- A clear summary of what changed and why.
- Screenshots or short clips for UI changes.
- Notes on any breaking changes.

## Suggested scope for issues/PRs

- UX polish for roadmap/task flow
- Better ranking sources and transparency
- Mobile responsiveness improvements
- Documentation fixes and onboarding clarity

## Coding style

- Follow existing TypeScript + Tailwind patterns.
- Reuse existing UI primitives in `components/ui`.
- Keep naming and structure consistent with nearby code.
