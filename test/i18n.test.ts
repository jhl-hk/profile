import { describe, expect, test } from 'bun:test';
import {
  defaultLocale,
  formatDate,
  formatReadingTime,
  getLocaleFromPath,
  isLocale,
  localizedPath,
  locales,
} from '../src/lib/i18n';

describe('locale configuration', () => {
  test('exposes the supported locales and English default', () => {
    expect(locales).toEqual(['en', 'ja', 'zh']);
    expect(defaultLocale).toBe('en');
    expect(isLocale('ja')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });

  test('reads and replaces locale path segments', () => {
    expect(getLocaleFromPath('/ja/blog/post/')).toBe('ja');
    expect(getLocaleFromPath('/blog/post/')).toBe('en');
    expect(localizedPath('zh', '/ja/blog/post/')).toBe('/zh/blog/post/');
    expect(localizedPath('en', '/')).toBe('/en/');
  });

  test('formats reading time by locale', () => {
    expect(formatReadingTime(4, 'en')).toBe('4 min read');
    expect(formatReadingTime(4, 'ja')).toBe('読了 4 分');
    expect(formatReadingTime(4, 'zh')).toBe('阅读约 4 分钟');
    expect(formatDate(new Date('2026-09-22T00:00:00Z'), 'en')).toContain('2026');
  });
});
