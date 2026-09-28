# jhl.idv.hk

Personal site and blog of Jianyue Hugo Liang. Built with Astro.

Locales: `en` (default), `ja`, `zh`. Routes are prefixed with the locale, e.g. `/en/blog/`.

## Commands

| Command | Action |
| :-- | :-- |
| `bun install` | Install dependencies |
| `bun run dev` | Start the dev server at `localhost:4321` |
| `bun run build` | Build to `dist/` and verify Blog output |
| `bun run test` | Run unit tests |
| `bun run verify` | Run tests, build, and verify `dist/` |

## Layout

- `src/content/blog/` — posts, one file per language.
- `src/assets/blog/` — post images.
- `src/data/profile.ts`, `src/data/projects.ts` — profile and project data.
- `src/i18n/ui.ts` — interface copy per locale.
- `scripts/` — build output verifiers.

## Writing a post

```yaml
---
title: 'Post title'
description: 'One-sentence summary.'
pubDate: 2026-09-28
lang: en            # en | ja | zh
translationKey: post-slug
topics: [Network]
featured: false
draft: false
---
```

- Translations of one post share `translationKey`.
- `heroImage` is a path relative to the post, under `src/assets/`.
- `slug` overrides the route ID derived from the file path.
- `draft: true` hides the post.
