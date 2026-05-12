# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Rankings page with category tabs for chat, local, image, video, and audio models
- Hybrid rankings data strategy with API + fallback external leaderboards
- 24-hour cache refresh for rankings API payload
- Manual refresh action on Rankings page
- Per-category source selectors (Arena / Hugging Face / Hybrid where supported)
- Expanded external leaderboard links (Arena AI, Artificial Analysis, OpenRouter, Open LLM Leaderboard, Papers with Code)
- Today Focus mode on Home dashboard
- Improved task card visual hierarchy
- In-context Cookbook side panel from task cards

### Fixed

- Recurrent Next.js stale `.next` chunk/cache issues by clean restart workflow
