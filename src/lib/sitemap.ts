import { locales, type Locale } from './i18n';

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

const staticPageSuffixes = ['/', '/about/', '/blog/', '/projects/'] as const;

export function includeInSitemap(page: string): boolean {
	const pathname = new URL(page).pathname;
	return locales.some((locale) => pathname.startsWith(`/${locale}/`))
		&& !/^\/(?:en|ja|zh)\/(?:404|500)\/?$/.test(pathname);
}

function localizedUrl(origin: string, locale: Locale, suffix: string): string {
	return new URL(`/${locale}${suffix}`, origin).href;
}

function articleUrl(origin: string, article: SitemapArticle): string {
	return new URL(`/${article.lang}/blog/${article.slug}/`, origin).href;
}

export function sitemapAlternateMap(
	articles: SitemapArticle[],
	origin: string,
): Map<string, SitemapAlternate[]> {
	const alternateMap = new Map<string, SitemapAlternate[]>();

	for (const suffix of staticPageSuffixes) {
		const links = locales.map((locale) => ({
			lang: sitemapLocaleTags[locale],
			url: localizedUrl(origin, locale, suffix),
		}));
		for (const locale of locales) alternateMap.set(localizedUrl(origin, locale, suffix), links);
	}

	const translationGroups = new Map<string, SitemapArticle[]>();
	for (const article of articles) {
		if (!article.translationKey) continue;
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
