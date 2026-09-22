import { defaultLocale, locales, localizedPath, type Locale } from './i18n';

export type LanguageTargets = Partial<Record<Locale, string>>;

export function staticLanguageTargets(pathname: string): LanguageTargets {
	return Object.fromEntries(locales.map((locale) => [locale, localizedPath(locale, pathname)]));
}

export function buildSeoLinks(origin: string, locale: Locale, targets: LanguageTargets) {
	const canonicalPath = targets[locale] ?? `/${locale}/`;
	const alternates = Object.entries(targets).map(([lang, path]) => ({
		lang,
		href: new URL(path, origin).href,
	}));
	const defaultPath = targets[defaultLocale];

	if (defaultPath) {
		alternates.push({ lang: 'x-default', href: new URL(defaultPath, origin).href });
	}

	return { canonical: new URL(canonicalPath, origin).href, alternates };
}
