import assert from 'node:assert/strict';
import { basename, extname, join } from 'node:path';
import { parseFrontmatter } from 'astro/markdown';
import { SITE_ORIGIN } from '../src/consts';
import { profile } from '../src/data/profile';
import { getUiCopy } from '../src/i18n/ui';
import { locales, type Locale } from '../src/lib/i18n';

interface PublishedArticle {
	lang: Locale;
	slug: string;
	sample: boolean;
}

function includesHtmlText(html: string, text: string): boolean {
	return html.includes(text) || html.includes(text.replaceAll('&', '&amp;'));
}

export const expectedFiles = [
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
] as const;

async function readPublishedArticles(contentDirectory: string): Promise<PublishedArticle[]> {
	const articles: PublishedArticle[] = [];
	const glob = new Bun.Glob('**/*.{md,mdx}');

	for await (const relativePath of glob.scan({ cwd: contentDirectory, onlyFiles: true })) {
		const { frontmatter } = parseFrontmatter(await Bun.file(join(contentDirectory, relativePath)).text());
		if (frontmatter.draft === true) continue;
		assert(locales.includes(frontmatter.lang), `Invalid Blog locale in ${relativePath}`);
		articles.push({
			lang: frontmatter.lang,
			slug: basename(relativePath, extname(relativePath)),
			sample: frontmatter.sample === true,
		});
	}

	return articles;
}

export async function assertDistOutput(distDirectory: string, contentDirectory: string): Promise<void> {
	const projectDirectory = join(distDirectory, '..');
	for (const relativePath of expectedFiles) {
		assert(await Bun.file(join(projectDirectory, relativePath)).exists(), `Missing generated output: ${relativePath}`);
	}

	for (const locale of locales) {
		const html = await Bun.file(join(distDirectory, locale, 'index.html')).text();
		const profileCopy = profile.copy[locale];
		assert(html.includes(`<html lang="${locale}"`), `Home language for ${locale}`);
		assert(
			html.includes(`<link rel="canonical" href="${SITE_ORIGIN}/${locale}/">`),
			`Home canonical for ${locale}`,
		);
		assert(html.includes(`<title>${profile.name}</title>`), `Home title for ${locale}`);
		for (const targetLocale of locales) {
			assert(
				html.includes(`rel="alternate" hreflang="${targetLocale}" href="${SITE_ORIGIN}/${targetLocale}/"`),
				`Home hreflang ${targetLocale} for ${locale}`,
			);
		}
		assert(
			html.includes(`rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/en/"`),
			`Home x-default hreflang for ${locale}`,
		);
		assert(
			includesHtmlText(html, profileCopy.role) && includesHtmlText(html, profileCopy.location),
			`Profile copy for ${locale} Home`,
		);
		const aboutHtml = await Bun.file(join(distDirectory, locale, 'about', 'index.html')).text();
		assert(
			includesHtmlText(aboutHtml, profileCopy.role) && includesHtmlText(aboutHtml, profileCopy.location),
			`Profile copy for ${locale} About`,
		);
	}

	const articles = await readPublishedArticles(contentDirectory);
	const sampleArticles = articles.filter((article) => article.lang === 'en' && article.sample);
	assert(sampleArticles.length > 0, 'No declared published English sample article');
	const otherLocaleIndexes = await Promise.all(
		locales.filter((locale) => locale !== 'en').map(async (locale) => ({
			locale,
			html: await Bun.file(join(distDirectory, locale, 'blog', 'index.html')).text(),
		})),
	);

	for (const article of sampleArticles) {
		const href = `/en/blog/${article.slug}/`;
		const html = await Bun.file(join(distDirectory, 'en', 'blog', article.slug, 'index.html')).text();
		assert(html.includes('<meta property="og:type" content="article">'), `Article metadata for ${href}`);
		assert(html.includes(getUiCopy('en').blog.sample), `Sample label for ${href}`);
		for (const index of otherLocaleIndexes) {
			assert(!index.html.includes(href), `English sample article leaked into ${index.locale} Blog index`);
		}
	}

	const feedDocuments: string[] = [];
	for (const locale of locales) {
		const xml = await Bun.file(join(distDirectory, locale, 'rss.xml')).text();
		feedDocuments.push(xml);
		assert(!xml.includes('example.com'), 'Placeholder origin in generated feed or sitemap');
		assert(
			xml.match(/<channel>[\s\S]*?<link>([^<]+)<\/link>/)?.[1] === `${SITE_ORIGIN}/${locale}/`,
			`RSS channel link for ${locale}`,
		);
		const expectedLinks = new Set(
			articles.filter((article) => article.lang === locale).map((article) => `${SITE_ORIGIN}/${locale}/blog/${article.slug}/`),
		);
		const itemLinks = (xml.match(/<item>[\s\S]*?<\/item>/g) ?? []).map((item) => item.match(/<link>([^<]+)<\/link>/)?.[1]);
		for (const link of itemLinks) {
			assert(link && expectedLinks.has(link), `Unexpected RSS entry for ${locale}: ${link ?? 'missing link'}`);
		}
		for (const link of expectedLinks) {
			assert(itemLinks.includes(link), `Missing RSS entry for ${locale}: ${link}`);
		}
	}
	assert(!(await Bun.file(join(distDirectory, 'rss.xml')).exists()), 'Global RSS output must not exist');

	const sitemapFiles: string[] = [];
	for await (const relativePath of new Bun.Glob('sitemap-*.xml').scan({ cwd: distDirectory, onlyFiles: true })) {
		if (relativePath !== 'sitemap-index.xml') sitemapFiles.push(relativePath);
	}
	assert(sitemapFiles.length > 0, 'Missing generated sitemap');
	const sitemap = (await Promise.all(sitemapFiles.map((path) => Bun.file(join(distDirectory, path)).text()))).join('\n');
	for (const locale of locales) {
		assert(sitemap.includes(`<loc>${SITE_ORIGIN}/${locale}/</loc>`), `Sitemap locale root for ${locale}`);
	}
	const sitemapEntries = sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? [];
	for (const entry of sitemapEntries) {
		const location = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
		assert(location, 'Sitemap entry is missing a location');
		const locationUrl = new URL(location);
		assert(
			locationUrl.origin === SITE_ORIGIN && locales.some((locale) => locationUrl.pathname.startsWith(`/${locale}/`)),
			`Non-canonical sitemap location: ${location}`,
		);

		const alternateTags = entry.match(/<xhtml:link\b[^>]*>/g) ?? [];
		const alternateLocales = alternateTags.map((tag) => tag.match(/hreflang="([^"]+)"/)?.[1]);
		assert(
			new Set(alternateLocales).size === alternateLocales.length,
			`Duplicate sitemap alternate for ${location}`,
		);
		for (const tag of alternateTags) {
			const href = tag.match(/href="([^"]+)"/)?.[1];
			assert(href, `Sitemap alternate is missing an href for ${location}`);
			const alternateUrl = new URL(href);
			assert(
				alternateUrl.origin === SITE_ORIGIN && locales.some((locale) => alternateUrl.pathname.startsWith(`/${locale}/`)),
				`Non-canonical sitemap alternate: ${href}`,
			);
		}
	}
	assert(
		![...feedDocuments, sitemap].some((document) => document.includes('example.com')),
		'Placeholder origin in generated feed or sitemap',
	);
}

if (import.meta.main) {
	const distDirectory = process.argv[2] ?? join(process.cwd(), 'dist');
	const contentDirectory = process.argv[3] ?? join(process.cwd(), 'src', 'content', 'blog');
	await assertDistOutput(distDirectory, contentDirectory);
	console.log('Generated site output verified.');
}
