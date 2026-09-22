import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export type BlogOutput = Record<string, string>;

export interface BlogOutputExpectations {
	tocPaths: string[];
	withoutTocPaths: string[];
}

const defaultExpectations: BlogOutputExpectations = {
	tocPaths: [
		'en/blog/markdown-style-guide/index.html',
		'en/blog/using-mdx/index.html',
	],
	withoutTocPaths: [
		'en/blog/first-post/index.html',
		'en/blog/second-post/index.html',
		'en/blog/third-post/index.html',
	],
};

function requireOutput(output: BlogOutput, path: string): string {
	const html = output[path];
	if (html === undefined) throw new Error(`Missing generated Blog output: ${path}`);
	return html;
}

function requireText(html: string, expected: string, context: string): void {
	if (!html.includes(expected)) throw new Error(`${context} is missing ${expected}`);
}

export function assertBlogOutput(
	output: BlogOutput,
	expectations: BlogOutputExpectations = defaultExpectations,
): void {
	for (const locale of ['en', 'ja', 'zh']) {
		requireOutput(output, `${locale}/blog/index.html`);
	}

	const indexRedirect = requireOutput(output, 'blog/index.html');
	requireText(indexRedirect, 'http-equiv="refresh"', 'Blog index redirect');
	requireText(indexRedirect, 'url=/en/blog/', 'Blog index redirect');
	if (/<article\b/i.test(indexRedirect)) throw new Error('Legacy redirect contains duplicate article HTML');

	const englishIndex = requireOutput(output, 'en/blog/index.html');
	for (const marker of [
		'data-post-row',
		'data-title=',
		'data-description=',
		'data-topics=',
		'aria-live="polite"',
		'aria-pressed="true"',
	]) {
		requireText(englishIndex, marker, 'English Blog index');
	}

	const articlePaths = Object.keys(output).filter((path) => /^(en|ja|zh)\/blog\/[^/]+\/index\.html$/.test(path));
	if (articlePaths.length === 0) throw new Error('No localized Blog article routes were generated');

	for (const path of articlePaths) {
		const [, locale, slug] = path.match(/^(en|ja|zh)\/blog\/([^/]+)\/index\.html$/) ?? [];
		if (!locale || !slug) continue;
		const html = requireOutput(output, path);
		requireText(html, `<html lang="${locale}"`, `Localized article ${path}`);
		requireText(html, `href="https://jhl.idv.hk/${locale}/blog/${slug}/"`, `Localized article ${path}`);

		if (locale === 'en') {
			requireText(html, 'href="/ja/blog/"', `Japanese fallback for ${path}`);
			requireText(html, 'aria-label="Translation unavailable; view the blog in 日本語"', `Japanese fallback for ${path}`);
			requireText(html, 'href="/zh/blog/"', `Chinese fallback for ${path}`);
			requireText(html, 'aria-label="Translation unavailable; view the blog in 简体中文"', `Chinese fallback for ${path}`);
			if ((html.match(/data-fallback/g) ?? []).length < 2) {
				throw new Error(`Translation fallback links are not exposed accessibly for ${path}`);
			}

			const legacyPath = `blog/${slug}/index.html`;
			const legacy = requireOutput(output, legacyPath);
			requireText(legacy, 'http-equiv="refresh"', `Legacy redirect ${legacyPath}`);
			requireText(legacy, `url=/en/blog/${slug}/`, `Legacy redirect ${legacyPath}`);
			if (/<article\b/i.test(legacy)) throw new Error(`Legacy redirect contains duplicate article HTML: ${legacyPath}`);
		}
	}

	for (const path of expectations.tocPaths) {
		const html = requireOutput(output, path);
		if (!html.includes('class="table-of-contents"') || !html.includes('id="toc-title"')) {
			throw new Error(`Table of contents is missing from ${path}`);
		}
	}

	for (const path of expectations.withoutTocPaths) {
		const html = requireOutput(output, path);
		if (html.includes('class="table-of-contents"') || html.includes('id="toc-title"')) {
			throw new Error(`Table of contents should not render in ${path}`);
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

if (import.meta.main) {
	const output = await readGeneratedBlogOutput(join(process.cwd(), 'dist'));
	assertBlogOutput(output);
	console.log('Generated Blog output verified.');
}
