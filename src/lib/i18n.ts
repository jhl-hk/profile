export const allLocales = ['en', 'ja', 'zh'] as const;
export type Locale = (typeof allLocales)[number];

// Locales listed here are not built, linked or redirected to.
export const disabledLocales: readonly Locale[] = ['ja', 'zh'];
export const locales: readonly Locale[] = allLocales.filter((locale) => !disabledLocales.includes(locale));
export const defaultLocale: Locale = 'en';
export const prefixedLocales: readonly Locale[] = locales.filter((locale) => locale !== defaultLocale);

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  zh: '简体中文',
};

export function isLocale(value: string | undefined): value is Locale {
  return allLocales.includes(value as Locale);
}

export function getLocaleFromPath(pathname: string): Locale {
  const locale = pathname.split('/').filter(Boolean)[0];
  return isLocale(locale) ? locale : defaultLocale;
}

export function localizedPath(locale: Locale, pathname = '/'): string {
  const segments = pathname.split('/').filter(Boolean);
  if (isLocale(segments[0])) segments.shift();
  const suffix = segments.length > 0 ? `${segments.join('/')}/` : '';
  return locale === defaultLocale ? `/${suffix}` : `/${locale}/${suffix}`;
}

const dateLocales: Record<Locale, string> = {
  en: 'en-GB',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(dateLocales[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatReadingTime(minutes: number, locale: Locale): string {
  if (locale === 'ja') return `読了 ${minutes} 分`;
  if (locale === 'zh') return `阅读约 ${minutes} 分钟`;
  return `${minutes} min read`;
}
