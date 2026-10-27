import assert from 'node:assert/strict';
import { join } from 'node:path';
import { readBlogManifest } from './blog-manifest';
import { SITE_ORIGIN } from '../src/consts';
import { profile } from '../src/data/profile';
import { getUiCopy } from '../src/i18n/ui';
import { defaultLocale, getLocaleFromPath, isLocale, locales, localizedPath, type Locale } from '../src/lib/i18n';
import { sitemapAlternateMap } from '../src/lib/sitemap';

interface PublishedArticle {
	lang: Locale;
	slug: string;
	sample: boolean;
	translationKey?: string;
}

function includesHtmlText(html: string, text: string): boolean {
	return html.includes(text) || html.includes(text.replaceAll('&', '&amp;'));
}

const staticPages = ['/', '/blog/', '/projects/', '/about/', '/links/'];

function outputPath(pathname: string): string {
	return pathname.endsWith('/') ? `${pathname.slice(1)}index.html` : pathname.slice(1);
}

function isCanonicalUrl(url: URL, targetLocales: readonly Locale[]): boolean {
	const [firstSegment] = url.pathname.split('/').filter(Boolean);
	return url.origin === SITE_ORIGIN && firstSegment !== defaultLocale && targetLocales.includes(getLocaleFromPath(url.pathname));
}

export function expectedFiles(targetLocales: readonly Locale[] = locales): string[] {
	const pages = [...staticPages.map((page) => outputPath(page)), 'rss.xml'];
	const localized = pages.flatMap((page) => targetLocales.map((locale) => `${localizedPath(locale).slice(1)}${page}`));
	const legacy = pages.map((page) => `${defaultLocale}/${page}`);
	return [...localized, ...legacy, '404.html'].map((path) => `dist/${path}`);
}

async function readPublishedArticles(
	contentDirectory: string,
	targetLocales: readonly Locale[],
): Promise<PublishedArticle[]> {
	return (await readBlogManifest(contentDirectory)).filter((article) => targetLocales.includes(article.lang));
}

export async function assertDistOutput(
	distDirectory: string,
	contentDirectory: string,
	targetLocales: readonly Locale[] = locales,
): Promise<void> {
	const projectDirectory = join(distDirectory, '..');
	for (const relativePath of expectedFiles(targetLocales)) {
		assert(await Bun.file(join(projectDirectory, relativePath)).exists(), `Missing generated output: ${relativePath}`);
	}

	for (const locale of targetLocales) {
		const html = await Bun.file(join(distDirectory, outputPath(localizedPath(locale)))).text();
		const profileCopy = profile.copy[locale];
		assert(html.includes(`<html lang="${locale}"`), `Home language for ${locale}`);
		assert(
			html.includes(`<link rel="canonical" href="${SITE_ORIGIN}${localizedPath(locale)}">`),
			`Home canonical for ${locale}`,
		);
		assert(html.includes(`<title>${profile.name}</title>`), `Home title for ${locale}`);
		for (const targetLocale of targetLocales) {
			assert(
				html.includes(`rel="alternate" hreflang="${targetLocale}" href="${SITE_ORIGIN}${localizedPath(targetLocale)}"`),
				`Home hreflang ${targetLocale} for ${locale}`,
			);
		}
		assert(
			html.includes(`rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${localizedPath(defaultLocale)}"`),
			`Home x-default hreflang for ${locale}`,
		);
		assert(
			includesHtmlText(html, profileCopy.role) && includesHtmlText(html, profileCopy.location),
			`Profile copy for ${locale} Home`,
		);
		const aboutHtml = await Bun.file(join(distDirectory, outputPath(localizedPath(locale, '/about/')))).text();
		assert(
			includesHtmlText(aboutHtml, profileCopy.role) && includesHtmlText(aboutHtml, profileCopy.location),
			`Profile copy for ${locale} About`,
		);
	}

	for (const page of staticPages) {
		const target = localizedPath(defaultLocale, page);
		const html = await Bun.file(join(distDirectory, defaultLocale, outputPath(page))).text();
		assert(
			html.includes(`content="0;url=${target}"`) && html.includes('name="robots" content="noindex"'),
			`Legacy redirect /${defaultLocale}${page} to ${target}`,
		);
	}

	const articles = await readPublishedArticles(contentDirectory, targetLocales);
	const sampleArticles = articles.filter((article) => article.lang === 'en' && article.sample);
	const otherLocaleIndexes = await Promise.all(
		targetLocales.filter((locale) => locale !== 'en').map(async (locale) => ({
			locale,
			html: await Bun.file(join(distDirectory, outputPath(localizedPath(locale, '/blog/')))).text(),
		})),
	);

	for (const article of sampleArticles) {
		const href = localizedPath('en', `/blog/${article.slug}/`);
		const html = await Bun.file(join(distDirectory, outputPath(href))).text();
		assert(html.includes('<meta property="og:type" content="article">'), `Article metadata for ${href}`);
		assert(html.includes(getUiCopy('en').blog.sample), `Sample label for ${href}`);
		for (const index of otherLocaleIndexes) {
			assert(!index.html.includes(href), `English sample article leaked into ${index.locale} Blog index`);
		}
	}

	const feedDocuments: string[] = [];
	for (const locale of targetLocales) {
		const xml = await Bun.file(join(distDirectory, `${localizedPath(locale).slice(1)}rss.xml`)).text();
		feedDocuments.push(xml);
		assert(!xml.includes('example.com'), 'Placeholder origin in generated feed or sitemap');
		assert(
			xml.match(/<channel>[\s\S]*?<link>([^<]+)<\/link>/)?.[1] === `${SITE_ORIGIN}${localizedPath(locale)}`,
			`RSS channel link for ${locale}`,
		);
		const expectedLinks = new Set(
			articles
				.filter((article) => article.lang === locale)
				.map((article) => `${SITE_ORIGIN}${localizedPath(locale, `/blog/${article.slug}/`)}`),
		);
		const itemLinks = (xml.match(/<item>[\s\S]*?<\/item>/g) ?? []).map((item) => item.match(/<link>([^<]+)<\/link>/)?.[1]);
		for (const link of itemLinks) {
			assert(link && expectedLinks.has(link), `Unexpected RSS entry for ${locale}: ${link ?? 'missing link'}`);
		}
		for (const link of expectedLinks) {
			assert(itemLinks.includes(link), `Missing RSS entry for ${locale}: ${link}`);
		}
	}
	assert(
		(await Bun.file(join(distDirectory, defaultLocale, 'rss.xml')).text()) === (await Bun.file(join(distDirectory, 'rss.xml')).text()),
		`Legacy /${defaultLocale}/rss.xml must match /rss.xml`,
	);

	const sitemapFiles: string[] = [];
	for await (const relativePath of new Bun.Glob('sitemap-*.xml').scan({ cwd: distDirectory, onlyFiles: true })) {
		if (relativePath !== 'sitemap-index.xml') sitemapFiles.push(relativePath);
	}
	assert(sitemapFiles.length > 0, 'Missing generated sitemap');
	const sitemap = (await Promise.all(sitemapFiles.map((path) => Bun.file(join(distDirectory, path)).text()))).join('\n');
	for (const locale of targetLocales) {
		assert(sitemap.includes(`<loc>${SITE_ORIGIN}${localizedPath(locale)}</loc>`), `Sitemap locale root for ${locale}`);
	}
	const sitemapEntries = sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? [];
	const expectedAlternates = sitemapAlternateMap(articles, SITE_ORIGIN, targetLocales);
	for (const entry of sitemapEntries) {
		const location = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
		assert(location, 'Sitemap entry is missing a location');
		const locationUrl = new URL(location);
		assert(!/^\/(?:(?:en|ja|zh)\/)?(?:404|500)(?:\.html|\/)?$/.test(locationUrl.pathname), `Status page in sitemap: ${location}`);
		assert(isCanonicalUrl(locationUrl, targetLocales), `Non-canonical sitemap location: ${location}`);

		const alternateTags = entry.match(/<xhtml:link\b[^>]*>/g) ?? [];
		const alternateLocales = alternateTags.map((tag) => tag.match(/hreflang="([^"]+)"/)?.[1]);
		assert(
			new Set(alternateLocales).size === alternateLocales.length,
			`Duplicate sitemap alternate for ${location}`,
		);
		for (const tag of alternateTags) {
			const href = tag.match(/href="([^"]+)"/)?.[1];
			assert(href, `Sitemap alternate is missing an href for ${location}`);
			assert(isCanonicalUrl(new URL(href), targetLocales), `Non-canonical sitemap alternate: ${href}`);
		}

		const actualLinks = alternateTags
			.map((tag) => ({
				lang: tag.match(/hreflang="([^"]+)"/)?.[1],
				url: tag.match(/href="([^"]+)"/)?.[1],
			}))
			.sort((a, b) => (a.lang ?? '').localeCompare(b.lang ?? ''));
		const wantedLinks = [...(expectedAlternates.get(location) ?? [])]
			.sort((a, b) => a.lang.localeCompare(b.lang));
		assert.deepEqual(actualLinks, wantedLinks, `Sitemap alternates for ${location}`);
	}
	assert(
		![...feedDocuments, sitemap].some((document) => document.includes('example.com')),
		'Placeholder origin in generated feed or sitemap',
	);
}

if (import.meta.main) {
	const distDirectory = process.argv[2] ?? join(process.cwd(), 'dist');
	const contentDirectory = process.argv[3] ?? join(process.cwd(), 'src', 'content', 'blog');
	const targetLocales = process.argv[4]?.split(',').filter(isLocale) ?? locales;
	await assertDistOutput(distDirectory, contentDirectory, targetLocales);
	console.log('Generated site output verified.');
}
