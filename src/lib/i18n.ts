export const locales = ['en', 'ja', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  zh: '简体中文',
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromPath(pathname: string): Locale {
  const locale = pathname.split('/').filter(Boolean)[0];
  return isLocale(locale) ? locale : defaultLocale;
}

export function localizedPath(locale: Locale, pathname = '/'): string {
  const segments = pathname.split('/').filter(Boolean);
  if (isLocale(segments[0])) segments.shift();
  const suffix = segments.length > 0 ? `${segments.join('/')}/` : '';
  return `/${locale}/${suffix}`;
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
