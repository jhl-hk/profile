import type { Locale } from '../lib/i18n';

interface ProjectCopy {
  description: string;
}

interface Project {
  id: string;
  name: string;
  url: string;
  tags: readonly string[];
  status: 'active';
  copy: Record<Locale, ProjectCopy>;
}

export const projects = [
  {
    id: 'jianyuelab-ltd',
    name: 'JianyueLab Ltd.',
    url: 'https://jianyuelab.co',
    tags: ['Startup', 'Web development', 'TypeScript'],
    status: 'active',
    copy: {
      en: { description: 'A technology company working on web development, domain management, and application development.' },
      ja: { description: 'Web 開発、ドメイン管理、アプリケーション開発を手がけるテクノロジー企業。' },
      zh: { description: '从事 Web 开发、域名管理和应用开发的科技公司。' },
    },
  },
  {
    id: 'postal-wiki',
    name: 'Postal Wiki',
    url: 'https://postal.wiki',
    tags: ['Wiki', 'Community', 'Postal'],
    status: 'active',
    copy: {
      en: { description: 'A wiki project about postal systems and postcards, running since 2023.' },
      ja: { description: '郵便システムやポストカードに特化した Wiki プロジェクト。2023 年から運営中。' },
      zh: { description: '专注于邮政系统和明信片的 Wiki 项目，自 2023 年起运营。' },
    },
  },
  {
    id: 'jianyuelab-org',
    name: 'JianyueLab Org.',
    url: 'https://jianyuelab.org',
    tags: ['Open source', 'Community'],
    status: 'active',
    copy: {
      en: { description: 'An open-source community project of JianyueLab Ltd.' },
      ja: { description: 'JianyueLab Ltd. のオープンソース・コミュニティプロジェクト。' },
      zh: { description: 'JianyueLab Ltd. 的开源社区项目。' },
    },
  },
] as const satisfies readonly Project[];
