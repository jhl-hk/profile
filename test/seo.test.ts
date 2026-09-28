import { expect, test } from 'bun:test';
import { buildSeoLinks, staticLanguageTargets } from '../src/lib/seo';
import { sitemapAlternateMap } from '../src/lib/sitemap';

test('creates canonical, hreflang, and x-default URLs', () => {
	const result = buildSeoLinks('https://jhl.idv.hk', 'ja', {
		en: '/en/blog/shared/',
		ja: '/ja/blog/shared-ja/',
		zh: '/zh/blog/shared-zh/',
	});

	expect(result.canonical).toBe('https://jhl.idv.hk/ja/blog/shared-ja/');
	expect(result.alternates).toContainEqual({
		lang: 'en',
		href: 'https://jhl.idv.hk/en/blog/shared/',
	});
	expect(result.alternates).toContainEqual({
		lang: 'x-default',
		href: 'https://jhl.idv.hk/en/blog/shared/',
	});
});

test('maps a static page to the equivalent route in every locale', () => {
	expect(staticLanguageTargets('/projects/')).toEqual({
		en: '/en/projects/',
		ja: '/ja/projects/',
		zh: '/zh/projects/',
	});
});

test('groups every locale of the Links page as sitemap alternates', () => {
	const alternates = sitemapAlternateMap([], 'https://jhl.idv.hk');
	expect(alternates.get('https://jhl.idv.hk/ja/links/')).toEqual([
		{ lang: 'en-GB', url: 'https://jhl.idv.hk/en/links/' },
		{ lang: 'ja-JP', url: 'https://jhl.idv.hk/ja/links/' },
		{ lang: 'zh-CN', url: 'https://jhl.idv.hk/zh/links/' },
	]);
});
