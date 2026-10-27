import { defaultLocale, getLocaleFromPath, locales, localizedPath, type Locale } from './i18n';

export interface SitemapAlternate {
	lang: string;
	url: string;
}

export interface SitemapArticle {
	lang: Locale;
	slug: string;
	translationKey?: string;
}

export const sitemapLocaleTags: Record<Locale, string> = {
	en: 'en-GB',
	ja: 'ja-JP',
	zh: 'zh-CN',
};

const staticPageSuffixes = ['/', '/about/', '/blog/', '/projects/', '/links/'] as const;

export function includeInSitemap(page: string): boolean {
	const pathname = new URL(page).pathname;
	const [firstSegment] = pathname.split('/').filter(Boolean);
	return firstSegment !== defaultLocale
		&& locales.includes(getLocaleFromPath(pathname))
		&& !/^\/(?:(?:en|ja|zh)\/)?(?:404|500)(?:\.html|\/)?$/.test(pathname);
}

function localizedUrl(origin: string, locale: Locale, suffix: string): string {
	return new URL(localizedPath(locale, suffix), origin).href;
}

function articleUrl(origin: string, article: SitemapArticle): string {
	return new URL(localizedPath(article.lang, `/blog/${article.slug}/`), origin).href;
}

export function sitemapAlternateMap(
	articles: SitemapArticle[],
	origin: string,
	targetLocales: readonly Locale[] = locales,
): Map<string, SitemapAlternate[]> {
	const alternateMap = new Map<string, SitemapAlternate[]>();

	for (const suffix of staticPageSuffixes) {
		const links = targetLocales.map((locale) => ({
			lang: sitemapLocaleTags[locale],
			url: localizedUrl(origin, locale, suffix),
		}));
		for (const locale of targetLocales) alternateMap.set(localizedUrl(origin, locale, suffix), links);
	}

	const translationGroups = new Map<string, SitemapArticle[]>();
	for (const article of articles) {
		if (!article.translationKey || !targetLocales.includes(article.lang)) continue;
		const group = translationGroups.get(article.translationKey) ?? [];
		group.push(article);
		translationGroups.set(article.translationKey, group);
	}

	for (const group of translationGroups.values()) {
		if (group.length < 2) continue;
		const links = group.map((article) => ({
			lang: sitemapLocaleTags[article.lang],
			url: articleUrl(origin, article),
		}));
		for (const article of group) alternateMap.set(articleUrl(origin, article), links);
	}

	return alternateMap;
}
