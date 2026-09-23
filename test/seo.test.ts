import { expect, test } from 'bun:test';
import { buildSeoLinks, staticLanguageTargets } from '../src/lib/seo';

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
