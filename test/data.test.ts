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
      expect(getUiCopy(locale).about.interests.length).toBeGreaterThan(0);
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

  test('provides localized profile facts with stable identifiers', () => {
    expect(profile.interests.map((interest) => interest.id)).toEqual([
      'server-network-programming',
      'aviation',
    ]);

    expect(profile.skills.filter((skill) => skill.category === 'technical').map((skill) => skill.id)).toEqual(expect.arrayContaining([
      'javascript',
      'python',
      'go',
      'java',
      'svelte',
      'vue',
      'nextjs',
    ]));

    const airwaySimulationNetwork = profile.experience.find((record) => record.id === 'airway-simulation-network');
    const mcsManager = profile.experience.find((record) => record.id === 'mcsmanager');

    expect(airwaySimulationNetwork).toBeDefined();
    expect(mcsManager).toBeDefined();

    for (const record of [airwaySimulationNetwork, mcsManager]) {
      expect(record?.start).toBeUndefined();
      expect(record?.end).toBeUndefined();
      for (const locale of locales) {
        expect(record?.copy[locale].title.length).toBeGreaterThan(0);
        expect(record?.copy[locale].description.length).toBeGreaterThan(0);
        expect(record?.copy[locale].location).toBeUndefined();
      }
    }

    for (const locale of locales) {
      for (const interest of profile.interests) {
        expect(interest.copy[locale].label.length).toBeGreaterThan(0);
      }
      for (const skill of profile.skills.filter((skill) => ['javascript', 'python', 'go', 'java', 'svelte', 'vue', 'nextjs'].includes(skill.id))) {
        expect(skill.copy[locale].label.length).toBeGreaterThan(0);
      }
    }

    expect(profile.socials.github).toBe('https://github.com/jhl-hk');
    expect(profile.socials.linkedin).toBe('https://www.linkedin.com/in/jhl-hk/');
    expect(profile.email).toBe('mailto:ja@jhl.hk');
  });
});
