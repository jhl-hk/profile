# Multilingual Yohaku-Inspired Site Redesign

Date: 2026-09-22
Status: Approved

## Goal

Redesign the entire Astro site as a multilingual personal website and blog inspired by Yohaku's restrained editorial design system.

The site supports English, Japanese, and Simplified Chinese. English is the default language. Blog posts may be published as linked translations or as language-specific standalone posts.

## Scope

The redesign covers:

- Global layout, navigation, footer, typography, color, spacing, and responsive behavior.
- Home, Blog index, Blog article, Projects, About, and localized 404 pages.
- English, Japanese, and Simplified Chinese route generation.
- Localized metadata, canonical links, alternate-language links, RSS, and sitemap output.
- Light and dark themes.
- Accessible interaction and reduced-motion behavior.

The implementation remains an Astro static site. It does not introduce a client framework or a large UI dependency.

## Routes

All public pages use a language prefix:

- `/en/`, `/ja/`, `/zh/`
- `/en/blog/`, `/ja/blog/`, `/zh/blog/`
- `/en/blog/[slug]/`, `/ja/blog/[slug]/`, `/zh/blog/[slug]/`
- `/en/projects/`, `/ja/projects/`, `/zh/projects/`
- `/en/about/`, `/ja/about/`, `/zh/about/`
- Localized not-found pages for each language

`/` redirects to `/en/`.

The primary navigation contains Home, Posts, Projects, and About. The header also contains language and theme controls.

## Information Architecture

### Home

The home page introduces Janyue Aosugi / Jianyue Hugo Liang, current roles, selected projects, recent writing, location, and contact links.

The page uses editorial sections with whitespace and separators instead of a dashboard card grid.

### Blog Index

The Blog index contains:

- A small section eyebrow and concise introduction.
- One featured post when a post is marked `featured`.
- A flat chronological post list.
- Topic metadata and reading time.
- A desktop search and topic rail.
- A single-column mobile layout.

Search and topic filtering enhance the static post list without changing the canonical post URLs.

### Blog Article

The article layout contains:

- Localized title, description, dates, topics, and reading time.
- A restrained reading column of approximately 720 pixels.
- Optional hero media.
- Optional table of contents.
- Translation links when related versions exist.
- A clear fallback when the requested translation does not exist.
- Previous and next article navigation within the active language.

### Projects

The Projects page presents JianyueLab Ltd., Postal Wiki, JianyueLab Org., and future projects as editorial rows. Each row contains a localized description, status, tags, and external link.

### About

The About page contains a short biography, portrait, experience, education, skills, languages, certifications, and social links. Timelines and skill groups use separators and compact metadata instead of progress bars or dense cards.

## Visual System

The selected direction is **Yohaku Editorial**.

- Warm paper-like light background.
- Warm dark-neutral night theme.
- Deep neutral text with three contrast tiers.
- Muted ume/rose accent used on no more than a small portion of each surface.
- Centered pill navigation with a subtle active segment.
- Wide page margins and a maximum content width near 1080 pixels.
- Minimal borders, low-contrast fills, and whisper-level shadows.
- Sans-serif UI typography and serif long-form typography.
- Font stacks must render Chinese, Japanese, and English without synthetic bold or missing glyphs.

Motion is limited to route-state feedback, theme changes, control presses, and short content entrances. All motion respects `prefers-reduced-motion`.

## Shared Components

The implementation uses shared components with localized inputs:

- Site shell
- Localized SEO head
- Pill navigation
- Language switcher
- Theme switcher
- Page introduction
- Featured post
- Post row
- Topic list and search control
- Project row
- Experience and education timeline
- Social links
- Footer

Components do not contain duplicated translation text. UI labels come from a typed language dictionary.

## Content Model

The Blog collection extends the current schema with:

- `lang`: `en`, `ja`, or `zh`
- `translationKey`: optional stable identifier shared by translations
- `topics`: localized or language-neutral topic labels
- `featured`: optional boolean
- `draft`: optional boolean
- Existing title, description, publication date, update date, and hero image fields

Posts with the same `translationKey` are alternate-language versions of one article. Posts without a `translationKey` are standalone posts for their declared language.

Profile and project content separate shared data from localized copy. URLs, dates, identifiers, and technical tags remain shared. Names, descriptions, labels, and narrative text are localized.

Existing Astro starter posts remain development content until real articles replace them. They must not be presented as personal writing without clear sample status.

## Language Behavior

The language switcher keeps the user on the equivalent page whenever possible.

- Static pages switch to the same route in the target language.
- Translated posts switch to the related post using `translationKey`.
- A post without the requested translation shows a localized notice and links to the target-language Blog index.
- Invalid language segments resolve to the localized not-found behavior or the English entry point as appropriate.

Dates, reading-time labels, navigation labels, accessibility text, and metadata use the active locale.

## SEO and Feeds

Each page provides:

- A locale-specific title and description.
- One canonical URL.
- `hreflang` links for available translations.
- An `x-default` link to the English version where applicable.
- Localized Open Graph metadata.

RSS feeds and sitemap entries are generated per language. Standalone language-specific posts appear only in their own language feed.

## Accessibility and Responsive Behavior

- All interactive controls are keyboard accessible.
- Focus indicators use the accent color with sufficient contrast.
- Navigation exposes the active page to assistive technology.
- Language and theme controls have localized accessible names.
- Mobile layouts use one content column and preserve touch target size.
- Decorative motion is disabled when reduced motion is requested.
- Light and dark themes meet readable contrast targets.

## Error Handling

- Missing content returns an appropriate not-found page.
- Missing translations never produce a broken article URL.
- Missing optional images preserve layout without empty placeholders.
- Content schema failures stop the build with actionable validation errors.
- Draft posts are excluded from production output.

## Verification

Implementation verification includes:

- `bun run build`
- Generated routes for all three languages
- Root redirect to `/en/`
- Translation association and fallback behavior
- Localized canonical and alternate-language metadata
- Per-language RSS and sitemap output
- Keyboard navigation and focus visibility
- Mobile and desktop layout checks
- Light and dark theme checks
- Reduced-motion checks

## Change Boundaries

The implementation modifies the active Astro migration only. It does not restore or edit the deleted Nuxt application files. Existing unrelated worktree changes remain untouched.
