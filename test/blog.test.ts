import { describe, expect, test } from 'bun:test';
import { matchesPostFilter, normalizeFilterValue } from '../src/lib/blog-filter';
import { articlePaths, type PostLike } from '../src/lib/content';
import { assertBlogOutput, type DeclaredArticle } from '../scripts/verify-blog-output';

describe('blog filtering', () => {
	const post = {
		title: 'Building Useful Things',
		description: 'Notes from 東京 about accessible interfaces.',
		topics: ['Design Systems', 'Astro'],
	};

	test('normalizes case, width, and surrounding whitespace', () => {
		expect(normalizeFilterValue('  ＡＳＴＲＯ  ')).toBe('astro');
	});

	test('matches title, description, and topic text', () => {
		expect(matchesPostFilter(post, 'useful', '', 'en')).toBe(true);
		expect(matchesPostFilter(post, '東京', '', 'en')).toBe(true);
		expect(matchesPostFilter(post, 'astro', '', 'en')).toBe(true);
		expect(matchesPostFilter(post, 'missing', '', 'en')).toBe(false);
	});

	test('combines search and exact topic selection', () => {
		expect(matchesPostFilter(post, 'accessible', 'design systems', 'en')).toBe(true);
		expect(matchesPostFilter(post, 'accessible', 'astro', 'en')).toBe(true);
		expect(matchesPostFilter(post, 'useful', 'writing', 'en')).toBe(false);
		expect(matchesPostFilter(post, 'missing', 'astro', 'en')).toBe(false);
		expect(matchesPostFilter(post, '', '', 'en')).toBe(true);
	});
});

describe('article route generation', () => {
	const posts: PostLike[] = [
		{ id: 'shared', data: { lang: 'en', pubDate: new Date('2026-09-20'), translationKey: 'shared' } },
		{ id: 'shared-ja', data: { lang: 'ja', pubDate: new Date('2026-09-19'), translationKey: 'shared' } },
		{ id: 'standalone', data: { lang: 'zh', pubDate: new Date('2026-09-18') } },
		{ id: 'draft', data: { lang: 'en', pubDate: new Date('2026-09-21'), draft: true } },
	];

	test('emits each published post exactly once under its declared locale', () => {
		const paths = articlePaths(posts);
		expect(paths.map(({ params }) => params)).toEqual([
			{ lang: 'en', slug: 'shared' },
			{ lang: 'ja', slug: 'shared-ja' },
			{ lang: 'zh', slug: 'standalone' },
		]);
		expect(paths.map(({ props }) => props.post.id)).toEqual([
			'shared',
			'shared-ja',
			'standalone',
		]);
		expect(new Set(paths.map(({ params }) => `${params.lang}/${params.slug}`)).size).toBe(paths.length);
	});

	test('rejects two declarations that resolve to the same localized route', () => {
		expect(() => articlePaths([
			posts[0],
			{ id: 'shared', data: { lang: 'en', pubDate: new Date('2026-09-17') } },
		])).toThrow(/duplicate article route/i);
	});

	test('uses complete normalized content IDs for nested article routes', () => {
		const paths = articlePaths([
			{ id: 'guides/deep-dive', data: { lang: 'en', pubDate: new Date('2026-09-20') } },
		]);

		expect(paths[0]?.params).toEqual({ lang: 'en', slug: 'guides/deep-dive' });
	});
});

describe('generated blog output verification', () => {
	const declared: DeclaredArticle[] = [
		{ id: 'en/shared', lang: 'en', slug: 'shared', translationKey: 'shared', topics: ['Astro'] },
		{ id: 'ja/shared-ja', lang: 'ja', slug: 'shared-ja', translationKey: 'shared', topics: ['Astro'] },
		{ id: 'zh/standalone', lang: 'zh', slug: 'standalone', topics: ['设计'] },
	];
	const index = (topic: string) => `<article data-post-row data-title="post" data-description="notes" data-topics="${topic}"></article><p aria-live="polite"></p><button data-topic-filter="" aria-pressed="true">All</button><button data-topic-filter="${topic}" aria-pressed="false">${topic}</button>`;
	const switcherLink = (locale: string, href: string, fallback = false) => fallback
		? `<a href="${href}" hreflang="${locale}" aria-label="Translation unavailable: ${locale}" title="Translation unavailable: ${locale}" data-fallback>${locale}</a>`
		: `<a href="${href}" hreflang="${locale}">${locale}</a>`;
	const article = ({
		locale,
		slug,
		switcher,
		translations,
		headings = [],
		toc = false,
	}: {
		locale: string;
		slug: string;
		switcher: string;
		translations: string;
		headings?: string[];
		toc?: boolean;
	}) => `
		<html lang="${locale}">
		<link rel="canonical" href="https://jhl.idv.hk/${locale}/blog/${slug}/">
		<nav class="language-switcher">${switcher}</nav>
		${toc ? `<aside class="table-of-contents" aria-labelledby="toc-title"><h2 id="toc-title">Contents</h2>${headings.map((heading) => `<a href="#${heading}">${heading}</a>`).join('')}</aside>` : ''}
		<div class="reading-column prose">${headings.map((heading) => `<h2 id="${heading}">${heading}</h2>`).join('')}</div>
		<section class="translations">${translations}</section>
	`;

	const validOutput = {
		'blog/index.html': '<meta http-equiv="refresh" content="2;url=/en/blog/">',
		'blog/shared/index.html': '<meta http-equiv="refresh" content="2;url=/en/blog/shared/">',
		'en/blog/index.html': index('astro'),
		'ja/blog/index.html': index('astro'),
		'zh/blog/index.html': index('设计'),
		'en/blog/shared/index.html': article({
			locale: 'en',
			slug: 'shared',
			switcher: [
				switcherLink('en', '/en/blog/shared/'),
				switcherLink('ja', '/ja/blog/shared-ja/'),
				switcherLink('zh', '/zh/blog/', true),
			].join(''),
			translations: '<a href="/en/blog/shared/" hreflang="en">English</a><a href="/ja/blog/shared-ja/" hreflang="ja">日本語</a>',
			headings: ['start', 'finish'],
			toc: true,
		}),
		'ja/blog/shared-ja/index.html': article({
			locale: 'ja',
			slug: 'shared-ja',
			switcher: [
				switcherLink('en', '/en/blog/shared/'),
				switcherLink('ja', '/ja/blog/shared-ja/'),
				switcherLink('zh', '/zh/blog/', true),
			].join(''),
			translations: '<a href="/en/blog/shared/" hreflang="en">English</a><a href="/ja/blog/shared-ja/" hreflang="ja">日本語</a>',
			headings: ['overview'],
		}),
		'zh/blog/standalone/index.html': article({
			locale: 'zh',
			slug: 'standalone',
			switcher: [
				switcherLink('en', '/en/blog/', true),
				switcherLink('ja', '/ja/blog/', true),
				switcherLink('zh', '/zh/blog/standalone/'),
			].join(''),
			translations: '<a href="/zh/blog/standalone/" hreflang="zh">简体中文</a>',
		}),
	};

	test('accepts declared locale routes, translations, fallbacks, and structural TOCs', () => {
		expect(() => assertBlogOutput(validOutput, declared)).not.toThrow();
	});

	test('rejects unexpected cross-locale output and route metadata disagreement', () => {
		expect(() => assertBlogOutput({
			...validOutput,
			'ja/blog/shared/index.html': article({
				locale: 'ja',
				slug: 'shared',
				switcher: '',
				translations: '',
			}),
		}, declared)).toThrow(/unexpected|cross-locale/i);

		expect(() => assertBlogOutput({
			...validOutput,
			'ja/blog/shared-ja/index.html': validOutput['ja/blog/shared-ja/index.html'].replace('lang="ja"', 'lang="en"'),
		}, declared)).toThrow(/language/i);
	});

	test('rejects incorrect translation fallback and malformed TOC semantics', () => {
		expect(() => assertBlogOutput({
			...validOutput,
			'en/blog/shared/index.html': validOutput['en/blog/shared/index.html'].replace('/ja/blog/shared-ja/', '/ja/blog/').replace('hreflang="ja"', 'hreflang="ja" data-fallback'),
		}, declared)).toThrow(/translation/i);

		expect(() => assertBlogOutput({
			...validOutput,
			'en/blog/shared/index.html': validOutput['en/blog/shared/index.html'].replace('href="#finish"', 'href="#missing"'),
		}, declared)).toThrow(/table of contents/i);
	});

	test('rejects missing or invalid topic-button pressed state', () => {
		expect(() => assertBlogOutput({
			...validOutput,
			'en/blog/index.html': validOutput['en/blog/index.html'].replace(' aria-pressed="true"', ''),
		}, declared)).toThrow(/aria-pressed/i);

		expect(() => assertBlogOutput({
			...validOutput,
			'en/blog/index.html': validOutput['en/blog/index.html'].replace('aria-pressed="false"', 'aria-pressed="mixed"'),
		}, declared)).toThrow(/aria-pressed/i);
	});

	test('accepts HTML-escaped ampersands and quotes in topic filter attributes', () => {
		const escapedDeclared: DeclaredArticle[] = [
			{ id: 'en/escaped', lang: 'en', slug: 'escaped', topics: ['R&D', 'Say "Hi"'] },
		];
		const escapedIndex = index('r&amp;d').replace(
			'</article>',
			'</article><button data-topic-filter="say &quot;hi&quot;" aria-pressed="false">Say &quot;Hi&quot;</button>',
		);
		const escapedOutput = {
			'blog/index.html': '<meta http-equiv="refresh" content="2;url=/en/blog/">',
			'blog/escaped/index.html': '<meta http-equiv="refresh" content="2;url=/en/blog/escaped/">',
			'en/blog/index.html': escapedIndex,
			'ja/blog/index.html': index('astro'),
			'zh/blog/index.html': index('设计'),
			'en/blog/escaped/index.html': article({
				locale: 'en',
				slug: 'escaped',
				switcher: [
					switcherLink('en', '/en/blog/escaped/'),
					switcherLink('ja', '/ja/blog/', true),
					switcherLink('zh', '/zh/blog/', true),
				].join(''),
				translations: '<a href="/en/blog/escaped/" hreflang="en">English</a>',
			}),
		};

		expect(() => assertBlogOutput(escapedOutput, escapedDeclared)).not.toThrow();
	});
});
