import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { matchesPostFilter, setPostFilterVisibility } from '../src/lib/blog-filter';
import { getUiCopy } from '../src/i18n/ui';
import { applyThemeSelection } from '../src/lib/theme';

describe('final accessibility polish', () => {
	test('uses readable text colour for inactive language links', async () => {
		const source = await readFile('src/components/LanguageSwitcher.astro', 'utf8');
		expect(source).toContain('color: var(--text-muted);');
		expect(source).not.toContain('color: var(--text-faint);');
	});

	test('keeps the theme button state current when the storage accessor fails', async () => {
		const root = { dataset: { theme: 'light' as string } };
		const attributes = new Map<string, string>();
		const button = {
			dataset: { lightLabel: 'Use light theme', darkLabel: 'Use dark theme' },
			setAttribute(name: string, value: string) {
				attributes.set(name, value);
			},
		};
		let storageAccesses = 0;
		const getStorage = () => {
			storageAccesses += 1;
			throw new Error('Storage unavailable');
		};

		expect(() => applyThemeSelection(root, button, 'dark', getStorage)).not.toThrow();
		expect(storageAccesses).toBe(1);
		expect(root.dataset.theme).toBe('dark');
		expect(attributes.get('aria-pressed')).toBe('true');
		expect(attributes.get('aria-label')).toBe('Use light theme');

		const source = await readFile('src/components/ThemeSwitcher.astro', 'utf8');
		expect(source).toContain('applyThemeSelection(document.documentElement, button, theme, () => localStorage);');
	});

	test('provides and consumes localized project tag labels', async () => {
		expect(getUiCopy('en').projects.tags).toBe('Tags');
		expect(getUiCopy('ja').projects.tags).toBe('タグ');
		expect(getUiCopy('zh').projects.tags).toBe('标签');

		const source = await readFile('src/components/ProjectRow.astro', 'utf8');
		expect(source).toContain('aria-label={copy.tags}');
		expect(source).not.toContain('aria-label="Tags"');
	});

	test('consumes localized labels only from the typed UI dictionary', async () => {
		const sources = await Promise.all([
			readFile('src/components/ProjectRow.astro', 'utf8'),
			readFile('src/components/ProfileTimeline.astro', 'utf8'),
			readFile('src/pages/[lang]/index.astro', 'utf8'),
			readFile('src/pages/[lang]/about/index.astro', 'utf8'),
		]);
		for (const source of sources) {
			expect(source).not.toMatch(/const (?:labels|present) = \{/);
		}
	});
});

describe('final Blog filter polish', () => {
	test('hides the featured wrapper together with a nonmatching featured post', async () => {
		const wrapper = { hidden: false };
		const row = {
			hidden: false,
			closest(selector: string) {
				expect(selector).toBe('[data-featured-wrap]');
				return wrapper;
			},
		};

		setPostFilterVisibility(row, false);
		expect(row.hidden).toBe(true);
		expect(wrapper.hidden).toBe(true);

		setPostFilterVisibility(row, true);
		expect(row.hidden).toBe(false);
		expect(wrapper.hidden).toBe(false);

		const [page, search] = await Promise.all([
			readFile('src/pages/[lang]/blog/index.astro', 'utf8'),
			readFile('src/components/PostSearch.astro', 'utf8'),
		]);
		expect(page).toContain('data-featured-wrap');
		expect(search).toContain('setPostFilterVisibility(row, matchesPost);');
	});

	test('normalizes indexed text and query with the same page locale', async () => {
		const post = { title: 'I', description: '', topics: [] };
		expect(matchesPostFilter(post, 'ı', '', 'tr')).toBe(true);

		const source = await readFile('src/components/PostSearch.astro', 'utf8');
		expect(source).toContain('data-locale={locale}');
		expect(source).toContain('query, selectedTopic, locale');
	});
});

test('production feeds and sitemap reject the placeholder origin', async () => {
	const [config, verifier] = await Promise.all([
		readFile('astro.config.mjs', 'utf8'),
		readFile('scripts/verify-dist.ts', 'utf8'),
	]);
	expect(config).toContain("const site = 'https://jhl.idv.hk'");
	expect(config).not.toContain('example.com');
	expect(verifier).toContain("document.includes('example.com')");
});
