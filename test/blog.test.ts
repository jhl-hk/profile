import { describe, expect, test } from 'bun:test';
import { matchesPostFilter, normalizeFilterValue } from '../src/lib/blog-filter';
import { assertBlogOutput, type BlogOutputExpectations } from '../scripts/verify-blog-output';

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
		expect(matchesPostFilter(post, 'useful', '')).toBe(true);
		expect(matchesPostFilter(post, '東京', '')).toBe(true);
		expect(matchesPostFilter(post, 'astro', '')).toBe(true);
		expect(matchesPostFilter(post, 'missing', '')).toBe(false);
	});

	test('combines search and exact topic selection', () => {
		expect(matchesPostFilter(post, 'accessible', 'design systems')).toBe(true);
		expect(matchesPostFilter(post, 'accessible', 'astro')).toBe(true);
		expect(matchesPostFilter(post, 'useful', 'writing')).toBe(false);
		expect(matchesPostFilter(post, 'missing', 'astro')).toBe(false);
		expect(matchesPostFilter(post, '', '')).toBe(true);
	});
});

describe('generated blog output verification', () => {
	const expectations: BlogOutputExpectations = {
		tocPaths: ['en/blog/with-toc/index.html'],
		withoutTocPaths: ['en/blog/plain/index.html'],
	};

	const article = (slug: string, toc = false) => `
		<html lang="en">
		<link rel="canonical" href="https://jhl.idv.hk/en/blog/${slug}/">
		<a href="/ja/blog/" aria-label="Translation unavailable; view the blog in 日本語" data-fallback>JA</a>
		<a href="/zh/blog/" aria-label="Translation unavailable; view the blog in 简体中文" data-fallback>ZH</a>
		${toc ? '<aside class="table-of-contents"><h2 id="toc-title">On this page</h2></aside>' : ''}
	`;

	const validOutput = {
		'blog/index.html': '<meta http-equiv="refresh" content="2;url=/en/blog/">',
		'blog/plain/index.html': '<meta http-equiv="refresh" content="2;url=/en/blog/plain/">',
		'blog/with-toc/index.html': '<meta http-equiv="refresh" content="2;url=/en/blog/with-toc/">',
		'en/blog/index.html': '<article data-post-row data-title="plain" data-description="notes" data-topics="astro"></article><p aria-live="polite"></p><button aria-pressed="true"></button>',
		'ja/blog/index.html': '<p>まだ投稿はありません。</p>',
		'zh/blog/index.html': '<p>暂时没有文章。</p>',
		'en/blog/plain/index.html': article('plain'),
		'en/blog/with-toc/index.html': article('with-toc', true),
	};

	test('accepts localized routes, redirects, fallbacks, filters, and TOC output', () => {
		expect(() => assertBlogOutput(validOutput, expectations)).not.toThrow();
	});

	test('rejects duplicate legacy article HTML and missing TOC output', () => {
		expect(() => assertBlogOutput({
			...validOutput,
			'blog/plain/index.html': '<article>duplicate article</article>',
		}, expectations)).toThrow(/legacy redirect/i);

		expect(() => assertBlogOutput({
			...validOutput,
			'en/blog/with-toc/index.html': article('with-toc'),
		}, expectations)).toThrow(/table of contents/i);
	});
});
