import { describe, expect, test } from 'bun:test';
import { profile } from '../src/data/profile';
import { projects } from '../src/data/projects';
import { getUiCopy } from '../src/i18n/ui';
import { locales } from '../src/lib/i18n';

describe('localized site data', () => {
  test('provides UI, profile, and project copy for every locale', () => {
    for (const locale of locales) {
      expect(getUiCopy(locale).nav.blog.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).accessibility.skipToContent.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).accessibility.primaryNavigation.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).accessibility.languageSwitcher.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).accessibility.socialLinks.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).accessibility.translationUnavailable.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).home.currentRole.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).home.basedIn.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).home.recentWriting.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).projects.active.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).projects.externalProject.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).about.biography.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).about.business.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).about.technical.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).about.languages.length).toBeGreaterThan(0);
      expect(getUiCopy(locale).about.present.length).toBeGreaterThan(0);
      expect(profile.copy[locale].bio.length).toBeGreaterThan(20);
      expect(profile.copy[locale].role.length).toBeGreaterThan(0);
      expect(profile.copy[locale].location.length).toBeGreaterThan(0);
      for (const project of projects) {
        expect(project.copy[locale].description.length).toBeGreaterThan(10);
      }
    }

    expect(profile.copy.ja.role).not.toBe(profile.copy.en.role);
    expect(profile.copy.ja.location).not.toBe(profile.copy.en.location);
    expect(profile.copy.zh.role).not.toBe(profile.copy.en.role);
    expect(profile.copy.zh.location).not.toBe(profile.copy.en.location);
  });
});
