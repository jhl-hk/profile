import { defaultLocale, type Locale } from './i18n';

export type LanguageTargets = Partial<Record<Locale, string>>;

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
