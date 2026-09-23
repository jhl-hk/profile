# Multilingual Yohaku Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Yohaku-inspired personal site and blog in English, Japanese, and Simplified Chinese, with English as the default and support for translated or language-specific posts.

**Architecture:** Keep Astro as a static site. Put locale, content-selection, and SEO rules in pure TypeScript modules; render them through shared Astro layouts and components; generate every locale route with `getStaticPaths()`. Use Bun's test runner for pure logic and a post-build script for generated route and metadata checks.

**Tech Stack:** Astro 7, Astro Content Collections, MDX, TypeScript, Bun test, plain CSS, `@astrojs/rss`, `@astrojs/sitemap`

**Spec:** `docs/superpowers/specs/2026-09-22-multilingual-yohaku-redesign-design.md`

## Global Constraints

- Generate English, Japanese, and Simplified Chinese pages under `/en/`, `/ja/`, and `/zh/`.
- Redirect `/` to `/en/`.
- Support linked translations through an optional `translationKey` and independent posts without one.
- Keep the site statically generated.
- Do not add a frontend framework or large UI dependency.
- Use Yohaku Editorial styling: warm paper surfaces, warm dark neutrals, restrained ume/rose accent, pill navigation, wide margins, and a 720px article column.
- Support light and dark themes, keyboard navigation, visible focus, mobile layouts, and `prefers-reduced-motion`.
- Do not restore or edit the deleted Nuxt application files.
- Preserve unrelated worktree changes.
- Use `bun` and `bunx` for JavaScript and TypeScript commands.

---

### Task 1: Locale and Route Foundation

**Files:**

- Modify: `package.json`
- Create: `src/lib/i18n.ts`
- Create: `test/i18n.test.ts`

**Interfaces:**

- Produces: `Locale`, `locales`, `defaultLocale`, `isLocale()`, `getLocaleFromPath()`, `localizedPath()`, `formatDate()`, and `formatReadingTime()`.
- Consumers: every localized route, the header, the language switcher, content selectors, and SEO helpers.

- [ ] **Step 1: Write the failing locale tests**

```ts
import { describe, expect, test } from 'bun:test';
import {
  defaultLocale,
  formatDate,
  formatReadingTime,
  getLocaleFromPath,
  isLocale,
  localizedPath,
  locales,
} from '../src/lib/i18n';

describe('locale configuration', () => {
  test('exposes the supported locales and English default', () => {
    expect(locales).toEqual(['en', 'ja', 'zh']);
    expect(defaultLocale).toBe('en');
    expect(isLocale('ja')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });

  test('reads and replaces locale path segments', () => {
    expect(getLocaleFromPath('/ja/blog/post/')).toBe('ja');
    expect(getLocaleFromPath('/blog/post/')).toBe('en');
    expect(localizedPath('zh', '/ja/blog/post/')).toBe('/zh/blog/post/');
    expect(localizedPath('en', '/')).toBe('/en/');
  });

  test('formats reading time by locale', () => {
    expect(formatReadingTime(4, 'en')).toBe('4 min read');
    expect(formatReadingTime(4, 'ja')).toBe('読了 4 分');
    expect(formatReadingTime(4, 'zh')).toBe('阅读约 4 分钟');
    expect(formatDate(new Date('2026-09-22T00:00:00Z'), 'en')).toContain('2026');
  });
});
```

Run: `bun test test/i18n.test.ts`

Expected: FAIL because `src/lib/i18n.ts` does not exist.

- [ ] **Step 2: Implement the locale helpers**

```ts
export const locales = ['en', 'ja', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  zh: '简体中文',
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromPath(pathname: string): Locale {
  const locale = pathname.split('/').filter(Boolean)[0];
  return isLocale(locale) ? locale : defaultLocale;
}

export function localizedPath(locale: Locale, pathname = '/'): string {
  const segments = pathname.split('/').filter(Boolean);
  if (isLocale(segments[0])) segments.shift();
  const suffix = segments.length > 0 ? `${segments.join('/')}/` : '';
  return `/${locale}/${suffix}`;
}

const dateLocales: Record<Locale, string> = {
  en: 'en-GB',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(dateLocales[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatReadingTime(minutes: number, locale: Locale): string {
  if (locale === 'ja') return `読了 ${minutes} 分`;
  if (locale === 'zh') return `阅读约 ${minutes} 分钟`;
  return `${minutes} min read`;
}
```

- [ ] **Step 3: Add test and verification scripts**

Add to `package.json`:

```json
{
  "test": "bun test",
  "verify": "bun test && bun run build && bun scripts/verify-dist.ts"
}
```

- [ ] **Step 4: Verify and commit**

Run: `bun test test/i18n.test.ts`

Expected: PASS.

```bash
git add package.json src/lib/i18n.ts test/i18n.test.ts
git commit -m "Add locale routing foundation"
```

---

### Task 2: Blog Schema and Content Selectors

**Files:**

- Modify: `src/content.config.ts`
- Modify: all files under `src/content/blog/`
- Create: `src/lib/content.ts`
- Create: `test/content.test.ts`

**Interfaces:**

- Consumes: `Locale`.
- Produces: `PostLike`, `postSlug()`, `publishedPosts()`, `translationTargets()`, `adjacentPosts()`, and `estimateReadingMinutes()`.
- Consumers: Home, Blog index, Blog article, language switcher, RSS, and verification.

- [ ] **Step 1: Write selector tests**

```ts
import { describe, expect, test } from 'bun:test';
import {
  adjacentPosts,
  estimateReadingMinutes,
  postSlug,
  publishedPosts,
  translationTargets,
  type PostLike,
} from '../src/lib/content';

const posts: PostLike[] = [
  { id: 'en/shared', data: { lang: 'en', pubDate: new Date('2026-09-20'), translationKey: 'shared' } },
  { id: 'ja/shared-ja', data: { lang: 'ja', pubDate: new Date('2026-09-19'), translationKey: 'shared' } },
  { id: 'zh/standalone', data: { lang: 'zh', pubDate: new Date('2026-09-18') } },
  { id: 'en/draft', data: { lang: 'en', pubDate: new Date('2026-09-22'), draft: true } },
];

describe('blog content helpers', () => {
  test('filters drafts and languages', () => {
    expect(publishedPosts(posts, 'en').map((post) => post.id)).toEqual(['en/shared']);
  });

  test('links translations but keeps standalone posts independent', () => {
    expect(translationTargets(posts, posts[0])).toEqual({ en: '/en/blog/shared/', ja: '/ja/blog/shared-ja/' });
    expect(translationTargets(posts, posts[2])).toEqual({ zh: '/zh/blog/standalone/' });
  });

  test('derives slugs, adjacency, and reading time', () => {
    expect(postSlug(posts[1])).toBe('shared-ja');
    expect(adjacentPosts(posts, posts[0], 'en')).toEqual({ previous: undefined, next: undefined });
    expect(estimateReadingMinutes('word '.repeat(220))).toBe(1);
    expect(estimateReadingMinutes('文'.repeat(501))).toBe(2);
  });
});
```

Run: `bun test test/content.test.ts`

Expected: FAIL because `src/lib/content.ts` does not exist.

- [ ] **Step 2: Expand the Blog schema and migrate samples**

Add these fields to `src/content.config.ts`:

```ts
lang: z.enum(['en', 'ja', 'zh']),
translationKey: z.string().min(1).optional(),
topics: z.array(z.string().min(1)).default([]),
featured: z.boolean().default(false),
draft: z.boolean().default(false),
sample: z.boolean().default(false),
```

Add this frontmatter to all five starter posts:

```yaml
lang: en
topics:
  - Sample
featured: false
draft: false
sample: true
```

Set `featured: true` only on `markdown-style-guide.md`. Do not add `translationKey` to starter posts.

- [ ] **Step 3: Implement the selectors**

```ts
import type { Locale } from './i18n';

export interface PostLike {
  id: string;
  body?: string;
  data: {
    lang: Locale;
    pubDate: Date;
    translationKey?: string;
    draft?: boolean;
    featured?: boolean;
  };
}

export function postSlug(post: PostLike): string {
  return post.id.split('/').filter(Boolean).at(-1) ?? post.id;
}

export function publishedPosts<T extends PostLike>(posts: T[], locale: Locale): T[] {
  return posts
    .filter((post) => post.data.lang === locale && !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function translationTargets<T extends PostLike>(posts: T[], current: T): Partial<Record<Locale, string>> {
  const related = current.data.translationKey
    ? posts.filter((post) => !post.data.draft && post.data.translationKey === current.data.translationKey)
    : [current];
  return Object.fromEntries(related.map((post) => [post.data.lang, `/${post.data.lang}/blog/${postSlug(post)}/`]));
}

export function adjacentPosts<T extends PostLike>(posts: T[], current: T, locale: Locale) {
  const localized = publishedPosts(posts, locale);
  const index = localized.findIndex((post) => post.id === current.id);
  return {
    previous: index >= 0 ? localized[index + 1] : undefined,
    next: index > 0 ? localized[index - 1] : undefined,
  };
}

export function estimateReadingMinutes(body = ''): number {
  const cjkPattern = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/g;
  const cjk = body.match(cjkPattern)?.length ?? 0;
  const latin = body.replace(cjkPattern, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(cjk / 500 + latin / 220));
}
```

- [ ] **Step 4: Verify and commit**

Run: `bun test test/content.test.ts && bun run build`

Expected: tests PASS and Astro validates all migrated content.

```bash
git add src/content.config.ts src/content/blog src/lib/content.ts test/content.test.ts
git commit -m "Add multilingual blog content model"
```

---

### Task 3: Localized Copy, Profile, and Project Data

**Files:**

- Modify: `src/consts.ts`
- Create: `src/i18n/ui.ts`
- Create: `src/data/profile.ts`
- Create: `src/data/projects.ts`
- Create: `test/data.test.ts`

**Interfaces:**

- Produces: `SITE_ORIGIN`, `SITE_NAME`, `getUiCopy()`, `profile`, and `projects`.
- Consumers: SEO, navigation, Home, Projects, About, Blog, 404, and Footer.

- [ ] **Step 1: Write copy-completeness tests**

```ts
import { describe, expect, test } from 'bun:test';
import { profile } from '../src/data/profile';
import { projects } from '../src/data/projects';
import { getUiCopy } from '../src/i18n/ui';
import { locales } from '../src/lib/i18n';

describe('localized site data', () => {
  test('provides UI, profile, and project copy for every locale', () => {
    for (const locale of locales) {
      expect(getUiCopy(locale).nav.blog.length).toBeGreaterThan(0);
      expect(profile.copy[locale].bio.length).toBeGreaterThan(20);
      for (const project of projects) {
        expect(project.copy[locale].description.length).toBeGreaterThan(10);
      }
    }
  });
});
```

Run: `bun test test/data.test.ts`

Expected: FAIL because the data modules do not exist.

- [ ] **Step 2: Replace placeholder constants and create UI copy**

Set:

```ts
export const SITE_ORIGIN = 'https://jhl.idv.hk';
export const SITE_NAME = 'Janyue Aosugi';
export const SITE_LEGAL_NAME = 'Janyue Aosugi, a.k.a. Jianyue Hugo Liang';
export const SITE_EMAIL = 'ja@jhl.hk';
```

Define `UiCopy` in `src/i18n/ui.ts` with localized navigation, actions, Home, Blog, Projects, About, 404, and Footer labels. Use these page titles:

- English Blog: `Notes on building useful things.`
- Japanese Blog: `役に立つものをつくるための記録。`
- Chinese Blog: `关于创造有用事物的笔记。`
- English Projects: `Selected work and long-running ideas.`
- Japanese Projects: `取り組んできた仕事と、育て続けている構想。`
- Chinese Projects: `持续投入的项目与长期构想。`
- English About: `Founder, developer, and student in Tokyo.`
- Japanese About: `東京で学び、つくり、事業を育てています。`
- Chinese About: `在东京学习、创造并经营事业。`

Export `getUiCopy(locale: Locale): UiCopy`.

- [ ] **Step 3: Create profile data**

Use this shared identity:

```ts
export const profile = {
  name: 'Janyue Aosugi',
  legalName: 'Janyue Aosugi, a.k.a. Jianyue Hugo Liang',
  role: 'Founder & CEO @ JianyueLab Ltd.',
  location: 'Tokyo, Japan',
  email: 'mailto:ja@jhl.hk',
  socials: {
    github: 'https://github.com/jhl-hk',
    linkedin: 'https://www.linkedin.com/in/jhl-hk/',
  },
  copy: {
    en: {
      bio: 'Founder and web developer based in Tokyo, building JianyueLab while studying the International Baccalaureate.',
      contact: 'Open to thoughtful conversations about software, infrastructure, and new projects.',
    },
    ja: {
      bio: '東京を拠点に、国際バカロレアを学びながら JianyueLab を運営する起業家・Web 開発者です。',
      contact: 'ソフトウェア、インフラ、新しいプロジェクトについてのご相談を歓迎します。',
    },
    zh: {
      bio: '常驻东京，在学习国际文凭课程的同时经营 JianyueLab，并从事 Web 开发。',
      contact: '欢迎交流软件、基础设施以及新的项目合作。',
    },
  },
} as const;
```

Add typed localized records for: JianyueLab Ltd. Founder & CEO; BetaMajor Web Developer; Postal Wiki Founder; JianyueLab homelab Owner; NUCB International College IBDP; USC Marshall Global Youth Leadership Program; startup operations; business development; project management; TypeScript; web development; server management; domain management; Chinese, English, and Japanese language ability; PADI Open Water Diver.

Use `git show HEAD:app/pages/about.vue` only as a read-only source for existing dates and Japanese facts. Do not restore the Nuxt file.

- [ ] **Step 4: Create project data**

Create entries with shared IDs, URLs, tags, and status plus direct three-language descriptions:

- JianyueLab Ltd. — `https://jianyuelab.co`
- Postal Wiki — `https://postal.wiki`
- JianyueLab Org. — `https://jianyuelab.org`

Use `git show HEAD:app/pages/index.vue` as the factual Japanese source. Keep the English and Chinese copy plain and factual.

- [ ] **Step 5: Verify and commit**

Run: `bun test test/data.test.ts`

Expected: PASS for every locale and project.

```bash
git add src/consts.ts src/i18n/ui.ts src/data/profile.ts src/data/projects.ts test/data.test.ts
git commit -m "Add localized profile and project data"
```

---

### Task 4: SEO Helpers and Yohaku Site Shell

**Files:**

- Create: `src/lib/seo.ts`
- Create: `test/seo.test.ts`
- Modify: `src/styles/global.css`
- Modify: `src/components/BaseHead.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/HeaderLink.astro`
- Modify: `src/components/Footer.astro`
- Create: `src/components/LanguageSwitcher.astro`
- Create: `src/components/ThemeSwitcher.astro`
- Create: `src/components/SocialLinks.astro`
- Create: `src/layouts/SiteLayout.astro`

**Interfaces:**

- Produces: `buildSeoLinks()`, `LanguageTargets`, `SiteLayout`, and the shared document shell.
- Consumers: every route and the Blog article layout.

- [ ] **Step 1: Write and run failing SEO tests**

```ts
import { describe, expect, test } from 'bun:test';
import { buildSeoLinks } from '../src/lib/seo';

test('creates canonical, hreflang, and x-default URLs', () => {
  const result = buildSeoLinks('https://jhl.idv.hk', 'ja', {
    en: '/en/blog/shared/',
    ja: '/ja/blog/shared-ja/',
    zh: '/zh/blog/shared-zh/',
  });
  expect(result.canonical).toBe('https://jhl.idv.hk/ja/blog/shared-ja/');
  expect(result.alternates).toContainEqual({ lang: 'en', href: 'https://jhl.idv.hk/en/blog/shared/' });
  expect(result.alternates).toContainEqual({ lang: 'x-default', href: 'https://jhl.idv.hk/en/blog/shared/' });
});
```

Run: `bun test test/seo.test.ts`

Expected: FAIL because `src/lib/seo.ts` does not exist.

- [ ] **Step 2: Implement SEO links**

```ts
import { defaultLocale, type Locale } from './i18n';

export type LanguageTargets = Partial<Record<Locale, string>>;

export function buildSeoLinks(origin: string, locale: Locale, targets: LanguageTargets) {
  const canonicalPath = targets[locale] ?? `/${locale}/`;
  const alternates = Object.entries(targets).map(([lang, path]) => ({
    lang,
    href: new URL(path, origin).href,
  }));
  const defaultPath = targets[defaultLocale];
  if (defaultPath) alternates.push({ lang: 'x-default', href: new URL(defaultPath, origin).href });
  return { canonical: new URL(canonicalPath, origin).href, alternates };
}
```

- [ ] **Step 3: Replace global design tokens and base rules**

Rewrite `src/styles/global.css` around:

```css
:root {
  --surface: #f5f0e8;
  --surface-raised: rgba(255, 255, 255, 0.58);
  --surface-muted: rgba(57, 48, 41, 0.05);
  --text: #292724;
  --text-muted: #706a63;
  --text-faint: #989087;
  --border: rgba(48, 43, 38, 0.12);
  --accent: #b95f6e;
  --accent-strong: #91414f;
  --focus: #b95f6e;
  --font-ui: var(--font-atkinson), "Noto Sans", "Noto Sans JP", "Noto Sans SC", sans-serif;
  --font-reading: "Iowan Old Style", "Yu Mincho", "Noto Serif JP", "Noto Serif SC", serif;
  --page-width: 1080px;
  --reading-width: 720px;
  color-scheme: light;
}

:root[data-theme='dark'] {
  --surface: #191817;
  --surface-raised: rgba(255, 255, 255, 0.045);
  --surface-muted: rgba(255, 255, 255, 0.035);
  --text: #eeeae4;
  --text-muted: #aaa49c;
  --text-faint: #77726c;
  --border: rgba(255, 255, 255, 0.1);
  --accent: #df8f9e;
  --accent-strong: #f0a7b4;
  color-scheme: dark;
}
```

Add the global reset, body typography, links, headings, form controls, `.page-shell`, `.reading-column`, `.eyebrow`, `.surface`, `.pill-nav`, `.meta`, `.sr-only`, focus-visible styles, a 720px mobile breakpoint, and reduced-motion rules. Limit transitions to transform and opacity at 300ms or less.

- [ ] **Step 4: Rebuild metadata and shared shell**

`BaseHead.astro` accepts `locale`, `title`, `description`, optional `image`, `type`, and `languageTargets`. Emit one canonical URL, available `hreflang` links, `x-default`, localized Open Graph locale, `/${locale}/rss.xml`, favicon, sitemap, generator, and Twitter metadata.

`LanguageSwitcher.astro` accepts `locale`, `targets`, and `fallbackPath`. It links to a translation when present, otherwise to the requested locale's Blog index with localized missing-translation context.

`ThemeSwitcher.astro` stores light/dark choice in `localStorage`; an inline head script applies the saved or system theme before paint.

Rewrite `Header.astro` as the Yohaku pill navigation and `Footer.astro` with GitHub, LinkedIn, email, RSS, and `萌ICP备20260331号`. Keep `HeaderLink.astro` responsible for `aria-current="page"`.

Create `SiteLayout.astro` with `locale`, `title`, `description`, `pathname`, `languageTargets`, optional `image`, `type`, and `mainClass`. Render `<html lang>`, skip link, metadata, theme bootstrap, Header, `<main id="content">`, and Footer.

Keep the new component props backward-compatible with English defaults during this task so the starter routes continue to build. Tasks 5 and 6 remove those defaults from route call sites by passing explicit locale and language targets.

- [ ] **Step 5: Verify and commit**

Run: `bun test test/seo.test.ts && bun run build`

Expected: SEO tests PASS and the starter routes still compile through the temporary English defaults.

```bash
git add src/lib/seo.ts test/seo.test.ts src/styles/global.css src/components src/layouts/SiteLayout.astro
git commit -m "Build Yohaku editorial site shell"
```

---

### Task 5: Localized Home, Projects, About, and 404 Pages

**Files:**

- Modify: `src/pages/index.astro`
- Modify: `src/pages/about.astro`
- Create: `src/components/PageIntro.astro`
- Create: `src/components/ProjectRow.astro`
- Create: `src/components/ProfileTimeline.astro`
- Create: `src/components/PostRow.astro`
- Create: `src/pages/[lang]/index.astro`
- Create: `src/pages/[lang]/projects/index.astro`
- Create: `src/pages/[lang]/about/index.astro`
- Create: `src/pages/[lang]/404.astro`
- Create: `src/pages/404.astro`

**Interfaces:**

- Consumes: locale helpers, localized data, `SiteLayout`, and Blog selectors.
- Produces: localized static pages and English legacy redirects.

- [ ] **Step 1: Create editorial content components**

Create:

- `PageIntro.astro` with `eyebrow`, `title`, and `description` props.
- `ProjectRow.astro` with `project` and `locale`; render localized title/description, status, tags, and accessible external link.
- `ProfileTimeline.astro` with `locale`, `title`, and records; render a semantic ordered list with `<time>`, organization, location, and localized description.
- `PostRow.astro` with `post`, `locale`, and `readingMinutes`; render title, description, topics, formatted date, reading time, and an explicit sample badge.

- [ ] **Step 2: Generate Home, Projects, and About routes**

Each `[lang]` page uses:

```ts
export function getStaticPaths() {
  return locales.map((locale) => ({ params: { lang: locale }, props: { locale } }));
}
```

Home renders localized profile copy, current role/location, two selected projects, three latest posts through `PostRow`, and contact links.

Projects renders `PageIntro` and all projects through `ProjectRow`.

About renders biography, role, monogram portrait fallback, experience, education, skills, languages, certification, and social links. Do not restore the deleted Nuxt portrait.

Set language targets to the equivalent route in all three locales.

- [ ] **Step 3: Add not-found pages and redirects**

Create `src/pages/[lang]/404.astro` with localized copy and a locale Home link. Create `src/pages/404.astro` as the English production fallback.

Replace `src/pages/index.astro` with:

```astro
---
return Astro.redirect('/en/', 302);
---
```

Replace `src/pages/about.astro` with a redirect to `/en/about/`.

- [ ] **Step 4: Verify and commit**

Run: `bun run build`

Expected output includes all three Home, Projects, and About paths plus `dist/404.html`.

```bash
git add src/pages src/components/PageIntro.astro src/components/ProjectRow.astro src/components/ProfileTimeline.astro src/components/PostRow.astro
git commit -m "Add localized profile pages"
```

---

### Task 6: Blog Index, Articles, and Translation Behavior

**Files:**

- Modify: `src/layouts/BlogPost.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[...slug].astro`
- Modify: `src/components/PostRow.astro`
- Create: `src/components/FeaturedPost.astro`
- Create: `src/components/TopicList.astro`
- Create: `src/components/PostSearch.astro`
- Create: `src/pages/[lang]/blog/index.astro`
- Create: `src/pages/[lang]/blog/[slug].astro`

**Interfaces:**

- Consumes: collection entries, content selectors, locale formatting, UI copy, `SiteLayout`, and `LanguageTargets`.
- Produces: localized Blog indexes, article routes, filters, TOC, translation links, and adjacent navigation.

- [ ] **Step 1: Create post presentation and filtering components**

`FeaturedPost.astro` uses the same `post`, `locale`, and `readingMinutes` interface as `PostRow.astro`. Extend `PostRow` with the Blog filter data attributes, and render title, description, topics, formatted date, reading time, and an explicit sample badge in both components.

`TopicList.astro` renders topic filter buttons with `aria-pressed`.

`PostSearch.astro` filters `[data-post-row]` by normalized title, description, and topics. Search and topic selection work together and update an `aria-live="polite"` result count.

- [ ] **Step 2: Build localized Blog indexes**

Generate each locale route, call `publishedPosts()`, feature the first entry with `featured: true`, list remaining entries chronologically, collect unique topics, and render the desktop search/topic rail. Use one column below 900px.

- [ ] **Step 3: Rebuild article layout and routes**

`BlogPost.astro` accepts:

```ts
interface Props {
  post: CollectionEntry<'blog'>;
  locale: Locale;
  headings: MarkdownHeading[];
  readingMinutes: number;
  languageTargets: LanguageTargets;
  previous?: CollectionEntry<'blog'>;
  next?: CollectionEntry<'blog'>;
}
```

Render article metadata, optional hero, sample status, optional TOC when at least two headings exist, serif reading column, translation links, and previous/next navigation through `SiteLayout`.

Generate article paths with:

```ts
export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { lang: post.data.lang, slug: postSlug(post) },
    props: { post },
  }));
}
```

Use `render(post)` headings, `estimateReadingMinutes(post.body)`, `translationTargets()`, and `adjacentPosts()`.

When a translation is missing, the language switcher links to the requested locale's Blog index and includes localized missing-translation context.

- [ ] **Step 4: Replace unprefixed Blog output with redirects**

Redirect `/blog/` to `/en/blog/`. Keep `src/pages/blog/[...slug].astro` only as a legacy redirect generator from current English slugs to `/en/blog/{slug}/`; do not render duplicate article HTML.

- [ ] **Step 5: Verify and commit**

Run: `bun test && bun run build`

Expected: all tests PASS and every non-draft article builds only under its declared locale.

```bash
git add src/components src/layouts/BlogPost.astro src/pages/blog src/pages/\[lang\]/blog
git commit -m "Build multilingual editorial blog"
```

---

### Task 7: Feeds, Sitemap, and Generated-Output Verification

**Files:**

- Modify: `astro.config.mjs`
- Delete: `src/pages/rss.xml.js`
- Create: `src/pages/[lang]/rss.xml.ts`
- Create: `scripts/verify-dist.ts`

**Interfaces:**

- Consumes: localized posts, route helpers, site constants, and generated HTML.
- Produces: three RSS feeds, localized sitemap metadata, and `bun run verify`.

- [ ] **Step 1: Configure the production origin and sitemap locales**

Set `site: 'https://jhl.idv.hk'`. Configure:

```ts
sitemap({
  i18n: {
    defaultLocale: 'en',
    locales: { en: 'en-GB', ja: 'ja-JP', zh: 'zh-CN' },
  },
})
```

Keep MDX and the local Atkinson provider unless target-environment verification proves it cannot build.

- [ ] **Step 2: Generate localized RSS**

Delete `src/pages/rss.xml.js`. Create `src/pages/[lang]/rss.xml.ts` with locale `getStaticPaths()`, `publishedPosts()`, localized feed title/description, and links formatted as `/${locale}/blog/${postSlug(post)}/`.

- [ ] **Step 3: Create post-build assertions**

Create `scripts/verify-dist.ts` using `node:assert/strict` and `Bun.file`. Assert these files exist:

```ts
const expectedFiles = [
  'dist/en/index.html',
  'dist/ja/index.html',
  'dist/zh/index.html',
  'dist/en/blog/index.html',
  'dist/ja/blog/index.html',
  'dist/zh/blog/index.html',
  'dist/en/projects/index.html',
  'dist/ja/projects/index.html',
  'dist/zh/projects/index.html',
  'dist/en/about/index.html',
  'dist/ja/about/index.html',
  'dist/zh/about/index.html',
  'dist/en/rss.xml',
  'dist/ja/rss.xml',
  'dist/zh/rss.xml',
  'dist/404.html',
];
```

Assert each Home page has matching `<html lang>`, canonical, localized title, and `hreflang`. Assert an English sample article has article metadata and sample labeling, and does not appear in Japanese or Chinese Blog indexes. Assert each RSS contains only its locale's entries. Assert a sitemap contains `/en/`, `/ja/`, and `/zh/`.

- [ ] **Step 4: Run automated and browser-facing verification**

Run: `bun run verify`

Then start the server with `bunx astro dev --background` and check:

```bash
curl -I http://localhost:4321/
curl -s http://localhost:4321/en/ | rg -m 8 'lang="en"|canonical|hreflang'
curl -s http://localhost:4321/ja/blog/ | rg -m 8 'lang="ja"|役に立つもの'
curl -s http://localhost:4321/zh/projects/ | rg -m 8 'lang="zh"|持续投入'
bunx astro dev status
bunx astro dev stop
```

Manually check keyboard navigation, visible focus, language fallback, theme persistence, 390px mobile layout, 1280px Blog rail, 720px reading column, and reduced motion.

- [ ] **Step 5: Commit feeds and verification**

```bash
git add astro.config.mjs src/pages/\[lang\]/rss.xml.ts scripts/verify-dist.ts
git add -u src/pages/rss.xml.js
git commit -m "Add localized feeds and site verification"
```

---

### Task 8: Final Review and Cleanup

**Files:**

- Review: all files changed by Tasks 1-7
- Modify: only files required to resolve review or verification findings

**Interfaces:**

- Consumes: the complete implementation and approved specification.
- Produces: a verified implementation without scratch artifacts or unrelated staged changes.

- [ ] **Step 1: Review against the specification**

Check every section of `docs/superpowers/specs/2026-09-22-multilingual-yohaku-redesign-design.md` against the implemented routes, content behavior, SEO, accessibility, and verification output.

- [ ] **Step 2: Inspect the scoped diff**

```bash
git status --short
git diff --check
git diff --stat
```

Confirm no deleted Nuxt file was restored, no unrelated worktree change was staged, and no task scratch directory remains.

- [ ] **Step 3: Run final verification**

Run: `bun run verify`

Expected: unit tests, build, and generated-output assertions PASS.

- [ ] **Step 4: Commit review fixes only when present**

```bash
git commit -m "Polish multilingual site redesign"
```

Do not create an empty commit when review produces no changes.
