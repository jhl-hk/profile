import { describe, expect, test } from 'bun:test';
import { profile } from '../src/data/profile';
import { projects } from '../src/data/projects';
import { getUiCopy } from '../src/i18n/ui';
import { locales } from '../src/lib/i18n';

describe('localized site data', () => {
  test('provides UI, profile, and project copy for every locale', () => {
    for (const locale of locales) {
      expect(getUiCopy(locale).nav.blog.length).toBeGreaterThan(0);
      expect(profile.copy[locale].bio.length).toBeGreaterThan(20);
      for (const project of projects) {
        expect(project.copy[locale].description.length).toBeGreaterThan(10);
      }
    }
  });
});
