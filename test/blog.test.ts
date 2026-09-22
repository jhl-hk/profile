import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

describe('blog presentation contracts', () => {
	test('post presentations expose localized metadata and filter attributes', async () => {
		const [row, featured] = await Promise.all([
			source('src/components/PostRow.astro'),
			source('src/components/FeaturedPost.astro'),
		]);

		for (const component of [row, featured]) {
			expect(component).toContain("post: CollectionEntry<'blog'>");
			expect(component).toContain('locale: Locale');
			expect(component).toContain('readingMinutes: number');
			expect(component).toContain('data-post-row');
			expect(component).toContain('data-title=');
			expect(component).toContain('data-description=');
			expect(component).toContain('data-topics=');
			expect(component).toContain('sample-badge');
		}

		expect(row).not.toContain('aria-label="Topics"');
	});

	test('search and topic controls expose combined filtering state', async () => {
		const [search, topics] = await Promise.all([
			source('src/components/PostSearch.astro'),
			source('src/components/TopicList.astro'),
		]);

		expect(search).toContain("querySelectorAll<HTMLElement>('[data-post-row]')");
		expect(search).toContain('dataset.title');
		expect(search).toContain('dataset.description');
		expect(search).toContain('dataset.topics');
		expect(search).toContain("aria-live=\"polite\"");
		expect(topics).toContain('data-topic-filter');
		expect(topics).toContain('aria-pressed');
	});
});

describe('blog route contracts', () => {
	test('localized index selects published and featured posts', async () => {
		const index = await source('src/pages/[lang]/blog/index.astro');

		expect(index).toContain('publishedPosts(');
		expect(index).toContain('post.data.featured');
		expect(index).toContain('<FeaturedPost');
		expect(index).toContain('<PostSearch');
		expect(index).toContain('<TopicList');
		expect(index).toContain('@media (max-width: 900px)');
	});

	test('localized articles use rendered headings, translations, and adjacency', async () => {
		const [route, layout] = await Promise.all([
			source('src/pages/[lang]/blog/[slug].astro'),
			source('src/layouts/BlogPost.astro'),
		]);

		expect(route).toContain("getCollection('blog', ({ data }) => !data.draft)");
		expect(route).toContain('params: { lang: post.data.lang, slug: postSlug(post) }');
		expect(route).toContain('const { Content, headings } = await render(post)');
		expect(route).toContain('translationTargets(');
		expect(route).toContain('adjacentPosts(');

		expect(layout).toContain("headings: MarkdownHeading[]");
		expect(layout).toContain('languageTargets: LanguageTargets');
		expect(layout).toContain('headings.length >= 2');
		expect(layout).toContain('<SiteLayout');
		expect(layout).toContain('class="reading-column prose"');
		expect(layout).toContain('previous');
		expect(layout).toContain('next');
	});

	test('legacy blog pages only redirect to English canonical routes', async () => {
		const [index, article] = await Promise.all([
			source('src/pages/blog/index.astro'),
			source('src/pages/blog/[...slug].astro'),
		]);

		expect(index).toContain("Astro.redirect('/en/blog/'");
		expect(article).toContain("data.lang === 'en'");
		expect(article).toContain('Astro.redirect(`/en/blog/${slug}/`');
		expect(article).not.toContain('<BlogPost');
	});
});
