import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { readBlogManifest, type BlogManifestEntry } from './blog-manifest';
import { normalizeFilterValue } from '../src/lib/blog-filter';
import { locales, type Locale } from '../src/lib/i18n';

export type BlogOutput = Record<string, string>;

export type DeclaredArticle = Omit<BlogManifestEntry, 'sample' | 'sourcePath'> &
	Partial<Pick<BlogManifestEntry, 'sample' | 'sourcePath'>>;

function requireOutput(output: BlogOutput, path: string): string {
	const html = output[path];
	if (html === undefined) throw new Error(`Missing generated Blog output: ${path}`);
	return html;
}

function requireText(html: string, expected: string, context: string): void {
	if (!html.includes(expected)) throw new Error(`${context} is missing ${expected}`);
}

function classBlock(html: string, element: string, className: string): string | undefined {
	const pattern = new RegExp(`<${element}\\b[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/${element}>`);
	return html.match(pattern)?.[0];
}

function openingTags(html: string, element: string): string[] {
	return html.match(new RegExp(`<${element}\\b[^>]*>`, 'g')) ?? [];
}

function attribute(tag: string, name: string): string | undefined {
	const value = tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
	return value?.replace(/&(?:#(\d+)|#x([\da-f]+)|(amp|apos|gt|lt|quot));/gi, (entity, decimal, hexadecimal, named) => {
		if (decimal) return String.fromCodePoint(Number(decimal));
		if (hexadecimal) return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
		return { amp: '&', apos: "'", gt: '>', lt: '<', quot: '"' }[named.toLowerCase() as 'amp'];
	});
}

function hasAttribute(tag: string, name: string): boolean {
	return new RegExp(`(?:\\s|<)${name}(?:\\s|=|>)`).test(tag);
}

function articleOutputPath(article: DeclaredArticle): string {
	return `${article.lang}/blog/${article.slug}/index.html`;
}

function articleHref(article: DeclaredArticle): string {
	return `/${article.lang}/blog/${article.slug}/`;
}

function validateDeclarations(declared: DeclaredArticle[]): void {
	const routes = new Set<string>();
	const translations = new Set<string>();

	for (const article of declared) {
		const route = articleOutputPath(article);
		if (routes.has(route)) throw new Error(`Duplicate declared article route: ${route}`);
		routes.add(route);

		if (article.translationKey) {
			const translation = `${article.translationKey}:${article.lang}`;
			if (translations.has(translation)) {
				throw new Error(`Duplicate ${article.lang} translation for ${article.translationKey}`);
			}
			translations.add(translation);
		}
	}
}

function validateTopicButtons(html: string, locale: Locale, declared: DeclaredArticle[]): void {
	const topics = [...new Set(
		declared
			.filter((article) => article.lang === locale)
			.flatMap((article) => article.topics)
			.map((topic) => normalizeFilterValue(topic, locale)),
	)];
	if (topics.length === 0) return;

	const buttons = openingTags(html, 'button').filter((button) => hasAttribute(button, 'data-topic-filter'));
	for (const button of buttons) {
		const pressed = attribute(button, 'aria-pressed');
		if (pressed !== 'true' && pressed !== 'false') {
			throw new Error(`Topic button has missing or invalid aria-pressed state in ${locale} Blog index`);
		}
	}

	const selected = buttons.filter((button) => attribute(button, 'aria-pressed') === 'true');
	if (selected.length !== 1 || attribute(selected[0], 'data-topic-filter') !== '') {
		throw new Error(`Initial all-topics aria-pressed state is invalid in ${locale} Blog index`);
	}

	for (const topic of topics) {
		const button = buttons.find((candidate) => attribute(candidate, 'data-topic-filter') === topic);
		if (!button || attribute(button, 'aria-pressed') !== 'false') {
			throw new Error(`Topic ${topic} has invalid aria-pressed state in ${locale} Blog index`);
		}
	}
}

function validateLanguageTargets(
	html: string,
	article: DeclaredArticle,
	declared: DeclaredArticle[],
	path: string,
): void {
	const switcher = classBlock(html, 'nav', 'language-switcher');
	if (!switcher) throw new Error(`Language switcher is missing from ${path}`);
	const switcherLinks = openingTags(switcher, 'a');
	const related = article.translationKey
		? declared.filter((candidate) => candidate.translationKey === article.translationKey)
		: [article];

	for (const targetLocale of locales) {
		const link = switcherLinks.find((candidate) => attribute(candidate, 'hreflang') === targetLocale);
		if (!link) throw new Error(`Language switcher is missing ${targetLocale} in ${path}`);
		const translation = related.find((candidate) => candidate.lang === targetLocale);
		const fallback = hasAttribute(link, 'data-fallback');

		if (translation) {
			if (fallback) throw new Error(`Real ${targetLocale} translation is marked as a fallback in ${path}`);
			if (attribute(link, 'href') !== articleHref(translation)) {
				throw new Error(`Real ${targetLocale} translation has the wrong target in ${path}`);
			}
		} else {
			if (!fallback) throw new Error(`Missing ${targetLocale} translation is not marked as a fallback in ${path}`);
			if (attribute(link, 'href') !== `/${targetLocale}/blog/`) {
				throw new Error(`Fallback ${targetLocale} translation has the wrong target in ${path}`);
			}
			if (!attribute(link, 'aria-label') || !attribute(link, 'title')) {
				throw new Error(`Fallback ${targetLocale} translation lacks accessible context in ${path}`);
			}
		}
	}

	const translationSection = classBlock(html, 'section', 'translations');
	if (!translationSection) throw new Error(`Translation links are missing from ${path}`);
	const translationLinks = openingTags(translationSection, 'a');
	for (const translation of related) {
		const link = translationLinks.find((candidate) => attribute(candidate, 'hreflang') === translation.lang);
		if (!link || attribute(link, 'href') !== articleHref(translation)) {
			throw new Error(`Real ${translation.lang} translation link is missing from ${path}`);
		}
	}
}

function validateTableOfContents(html: string, path: string): void {
	const headingIds = (html.match(/<h[1-6]\b[^>]*>/g) ?? [])
		.map((heading) => attribute(heading, 'id'))
		.filter((id): id is string => Boolean(id) && id !== 'toc-title' && id !== 'translations-title');
	const toc = classBlock(html, 'aside', 'table-of-contents');

	if (headingIds.length >= 2 && !toc) throw new Error(`Table of contents is missing from ${path}`);
	if (headingIds.length < 2 && toc) throw new Error(`Table of contents should not render in ${path}`);
	if (!toc) return;

	if (attribute(openingTags(toc, 'aside')[0] ?? '', 'aria-labelledby') !== 'toc-title') {
		throw new Error(`Table of contents is not labelled in ${path}`);
	}
	requireText(toc, 'id="toc-title"', `Table of contents in ${path}`);
	const tocTargets = openingTags(toc, 'a')
		.map((link) => attribute(link, 'href'))
		.filter((href): href is string => Boolean(href?.startsWith('#')))
		.map((href) => href.slice(1));

	if (tocTargets.length !== headingIds.length || tocTargets.some((target, index) => target !== headingIds[index])) {
		throw new Error(`Table of contents does not match article headings in ${path}`);
	}
}

export function assertBlogOutput(output: BlogOutput, declared: DeclaredArticle[]): void {
	validateDeclarations(declared);
	for (const locale of locales) requireOutput(output, `${locale}/blog/index.html`);

	const indexRedirect = requireOutput(output, 'blog/index.html');
	requireText(indexRedirect, 'http-equiv="refresh"', 'Blog index redirect');
	requireText(indexRedirect, 'url=/en/blog/', 'Blog index redirect');
	if (/<article\b/i.test(indexRedirect)) throw new Error('Legacy redirect contains duplicate article HTML');

	for (const locale of locales) {
		if (!declared.some((article) => article.lang === locale)) continue;
		const index = requireOutput(output, `${locale}/blog/index.html`);
		for (const marker of ['data-post-row', 'data-title=', 'data-description=', 'data-topics=', 'aria-live="polite"']) {
			requireText(index, marker, `${locale} Blog index`);
		}
		validateTopicButtons(index, locale, declared);
	}

	const expectedArticlePaths = new Set(declared.map(articleOutputPath));
	const generatedArticlePaths = Object.keys(output).filter((path) => /^(en|ja|zh)\/blog\/.+\/index\.html$/.test(path));
	for (const path of expectedArticlePaths) requireOutput(output, path);
	for (const path of generatedArticlePaths) {
		if (!expectedArticlePaths.has(path)) throw new Error(`Unexpected or cross-locale Blog article output: ${path}`);
	}
	if (generatedArticlePaths.length !== expectedArticlePaths.size) {
		throw new Error('Generated Blog article routes do not match declared content locales');
	}

	const expectedLegacyPaths = new Set(
		declared.filter((article) => article.lang === 'en').map((article) => `blog/${article.slug}/index.html`),
	);
	const generatedLegacyPaths = Object.keys(output).filter((path) => /^blog\/.+\/index\.html$/.test(path));
	for (const path of generatedLegacyPaths) {
		if (!expectedLegacyPaths.has(path)) throw new Error(`Unexpected legacy Blog redirect: ${path}`);
	}

	for (const article of declared) {
		const path = articleOutputPath(article);
		const html = requireOutput(output, path);
		requireText(html, `<html lang="${article.lang}"`, `Article language for ${path}`);
		requireText(html, `href="https://jhl.idv.hk${articleHref(article)}"`, `Canonical locale for ${path}`);
		validateLanguageTargets(html, article, declared, path);
		validateTableOfContents(html, path);

		if (article.lang === 'en') {
			const legacyPath = `blog/${article.slug}/index.html`;
			const legacy = requireOutput(output, legacyPath);
			requireText(legacy, 'http-equiv="refresh"', `Legacy redirect ${legacyPath}`);
			requireText(legacy, `url=${articleHref(article)}`, `Legacy redirect ${legacyPath}`);
			if (/<article\b/i.test(legacy)) throw new Error(`Legacy redirect contains duplicate article HTML: ${legacyPath}`);
		}
	}
}

export async function readGeneratedBlogOutput(distDirectory: string): Promise<BlogOutput> {
	const output: BlogOutput = {};

	async function visit(directory: string, relative = ''): Promise<void> {
		for (const entry of await readdir(directory, { withFileTypes: true })) {
			const entryRelative = relative ? `${relative}/${entry.name}` : entry.name;
			const entryPath = join(directory, entry.name);
			if (entry.isDirectory()) await visit(entryPath, entryRelative);
			else if (entry.isFile() && entry.name.endsWith('.html')) output[entryRelative] = await readFile(entryPath, 'utf8');
		}
	}

	await visit(distDirectory);
	return output;
}

export async function readDeclaredArticles(contentDirectory: string): Promise<DeclaredArticle[]> {
	return readBlogManifest(contentDirectory);
}

if (import.meta.main) {
	const [output, declared] = await Promise.all([
		readGeneratedBlogOutput(join(process.cwd(), 'dist')),
		readDeclaredArticles(join(process.cwd(), 'src/content/blog')),
	]);
	assertBlogOutput(output, declared);
	console.log('Generated Blog output verified.');
}
