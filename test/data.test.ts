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
        expect(record?.copy[locale].description?.length).toBeGreaterThan(0);
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

  test('provides current LinkedIn roles, skills, and language levels', () => {
    expect(profile.copy.en.role).toBe('Co-Founder & CEO @ JianyueLab Ltd.');
    expect(profile.copy.ja.role).toBe('JianyueLab Ltd. 共同創業者・CEO');
    expect(profile.copy.zh.role).toBe('JianyueLab Ltd. 联合创始人兼 CEO');

    const jianyueLab = profile.experience.find((record) => record.id === 'jianyuelab-ltd');
    const hangzhouSiliconBasedAgile = profile.experience.find((record) => record.id === 'hangzhou-silicon-based-agile-technology');
    const kyouyuuShanghai = profile.experience.find((record) => record.id === 'kyouyuu-shanghai-commercial');

    expect(jianyueLab).toMatchObject({ start: '2025-12', end: null });
    expect(jianyueLab?.copy).toMatchObject({
      en: { title: 'Co-Founder & CEO', location: 'United Kingdom' },
      ja: { title: '共同創業者・CEO', location: 'イギリス' },
      zh: { title: '联合创始人兼 CEO', location: '英国' },
    });
    expect(jianyueLab?.copy.en.description).toContain('RIPE NCC');
    expect(jianyueLab?.copy.en.description).toContain('ARIN');

    expect(hangzhouSiliconBasedAgile).toMatchObject({
      start: '2026-04',
      end: null,
      copy: {
        en: { title: 'Director', location: 'Hangzhou' },
        ja: { title: '取締役', location: '杭州' },
        zh: { title: '董事', location: '杭州' },
      },
    });
    expect(kyouyuuShanghai).toMatchObject({
      start: '2026-01',
      end: null,
      copy: {
        en: { title: 'Information Technology Administrator', location: 'Shanghai, China' },
        ja: { title: '情報技術管理者', location: '中国・上海' },
        zh: { title: '信息技术管理员', location: '中国上海' },
      },
    });

    for (const record of [hangzhouSiliconBasedAgile, kyouyuuShanghai]) {
      expect(record).toBeDefined();
      for (const locale of locales) {
        expect(record?.copy[locale].description).toBeUndefined();
      }
    }

    expect(profile.skills.filter((skill) => skill.category === 'technical').map((skill) => skill.id)).toEqual(expect.arrayContaining([
      'mikrotik',
      'mediawiki',
      'system-administration',
    ]));
    expect(profile.skills.find((skill) => skill.id === 'mikrotik')?.copy).toMatchObject({
      en: { label: 'MikroTik' }, ja: { label: 'MikroTik' }, zh: { label: 'MikroTik' },
    });
    expect(profile.skills.find((skill) => skill.id === 'mediawiki')?.copy).toMatchObject({
      en: { label: 'MediaWiki' }, ja: { label: 'MediaWiki' }, zh: { label: 'MediaWiki' },
    });
    expect(profile.skills.find((skill) => skill.id === 'system-administration')?.copy).toMatchObject({
      en: { label: 'System administration' }, ja: { label: 'システム管理' }, zh: { label: '系统管理' },
    });

    expect(profile.skills.find((skill) => skill.id === 'english')?.copy).toMatchObject({
      en: { proficiency: 'Professional working' }, ja: { proficiency: '業務上の使用が可能' }, zh: { proficiency: '专业工作能力' },
    });
    expect(profile.skills.find((skill) => skill.id === 'japanese')?.copy).toMatchObject({
      en: { proficiency: 'Limited working' }, ja: { proficiency: '限定的な業務使用' }, zh: { proficiency: '有限工作能力' },
    });
    expect(profile.skills.find((skill) => skill.id === 'chinese')?.copy).toMatchObject({
      en: { proficiency: 'Native or bilingual' }, ja: { proficiency: 'ネイティブまたはバイリンガル' }, zh: { proficiency: '母语或双语' },
    });
  });
});
