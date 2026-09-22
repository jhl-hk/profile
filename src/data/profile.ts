import type { Locale } from '../lib/i18n';

type Localized<T> = Record<Locale, T>;

interface TimelineCopy {
  title: string;
  description: string;
  location: string;
}

interface TimelineEntry {
  id: string;
  organisation: string;
  start: string;
  end: string | null;
  copy: Localized<TimelineCopy>;
}

interface Skill {
  id: string;
  category: 'business' | 'technical' | 'language';
  copy: Localized<{ label: string; proficiency?: string }>;
}

interface Certification {
  id: string;
  issuer: string;
  copy: Localized<{ name: string }>;
}

export const profile = {
  name: 'Janyue Aosugi',
  legalName: 'Janyue Aosugi, a.k.a. Jianyue Hugo Liang',
  email: 'mailto:ja@jhl.hk',
  socials: {
    github: 'https://github.com/jhl-hk',
    linkedin: 'https://www.linkedin.com/in/jhl-hk/',
  },
  copy: {
    en: {
      role: 'Founder & CEO @ JianyueLab Ltd.',
      location: 'Tokyo, Japan',
      bio: 'Founder and web developer based in Tokyo, building JianyueLab while studying the International Baccalaureate.',
      contact: 'Open to thoughtful conversations about software, infrastructure, and new projects.',
    },
    ja: {
      role: 'JianyueLab Ltd. 創業者・CEO',
      location: '日本・東京',
      bio: '東京を拠点に、国際バカロレアを学びながら JianyueLab を運営する起業家・Web 開発者です。',
      contact: 'ソフトウェア、インフラ、新しいプロジェクトについてのご相談を歓迎します。',
    },
    zh: {
      role: 'JianyueLab Ltd. 创始人兼 CEO',
      location: '日本东京',
      bio: '常驻东京，在学习国际文凭课程的同时经营 JianyueLab，并从事 Web 开发。',
      contact: '欢迎交流软件、基础设施以及新的项目合作。',
    },
  },
  experience: [
    {
      id: 'jianyuelab-ltd',
      organisation: 'JianyueLab Ltd.',
      start: '2025-12',
      end: null,
      copy: {
        en: { title: 'Founder & CEO', location: 'United Kingdom', description: 'Founded a technology company working on web development, domain management, and application development.' },
        ja: { title: 'Founder & CEO', location: 'イギリス', description: 'Web 開発、ドメイン管理、アプリケーション開発を行うテクノロジー企業を設立。' },
        zh: { title: '创始人兼 CEO', location: '英国', description: '创办从事 Web 开发、域名管理和应用开发的科技公司。' },
      },
    },
    {
      id: 'betamajor',
      organisation: 'BetaMajor',
      start: '2025-11',
      end: '2025-12',
      copy: {
        en: { title: 'Web Developer', location: 'Birmingham, United Kingdom', description: 'Developed a website for the Chinese Basketball Association in the United Kingdom.' },
        ja: { title: 'Web Developer', location: 'バーミンガム', description: '英国の中国人バスケットボール協会の Web サイト開発を担当。' },
        zh: { title: 'Web 开发者', location: '英国伯明翰', description: '负责开发英国华人篮球协会的网站。' },
      },
    },
    {
      id: 'postal-wiki',
      organisation: 'Postal Wiki',
      start: '2023-09',
      end: null,
      copy: {
        en: { title: 'Founder', location: 'Tokyo, Japan', description: 'Founded and run a wiki project focused on postal systems and postcards.' },
        ja: { title: 'Founder', location: '東京', description: '郵便システムやポストカードに特化した Wiki プロジェクトを立ち上げ、運営。' },
        zh: { title: '创始人', location: '日本东京', description: '创办并运营专注于邮政系统和明信片的 Wiki 项目。' },
      },
    },
    {
      id: 'jianyuelab-homelab',
      organisation: 'JianyueLab',
      start: '2022-12',
      end: '2025-12',
      copy: {
        en: { title: 'Owner', location: 'Chiyoda, Tokyo, Japan', description: 'Ran a personal homelab focused on virtual servers, domain management, and application development.' },
        ja: { title: 'Owner', location: '千代田', description: '仮想サーバー、ドメイン管理、アプリケーション開発に取り組む個人ホームラボを運営。' },
        zh: { title: '所有者', location: '日本东京千代田', description: '运营专注于虚拟服务器、域名管理和应用开发的个人家庭实验室。' },
      },
    },
  ] satisfies readonly TimelineEntry[],
  education: [
    {
      id: 'nucb-ibdp',
      organisation: 'NUCB International College',
      start: '2024-04',
      end: '2027-06',
      copy: {
        en: { title: 'International Baccalaureate Diploma Programme', location: 'Tokyo, Japan', description: 'Studying in the IBDP programme.' },
        ja: { title: '国際バカロレア・ディプロマ・プログラム', location: '東京', description: 'IBDP プログラムで学習中。' },
        zh: { title: '国际文凭大学预科课程', location: '日本东京', description: '正在学习 IBDP 课程。' },
      },
    },
    {
      id: 'usc-marshall-gylp',
      organisation: 'USC Marshall School of Business',
      start: '2024-08',
      end: '2024-08',
      copy: {
        en: { title: 'Global Youth Leadership Program', location: 'Los Angeles, United States', description: 'Attended a summer programme on global leadership.' },
        ja: { title: 'Global Youth Leadership Program', location: 'ロサンゼルス', description: 'グローバルリーダーシップについて学ぶサマープログラムに参加。' },
        zh: { title: '全球青年领导力项目', location: '美国洛杉矶', description: '参加学习全球领导力的暑期项目。' },
      },
    },
  ] satisfies readonly TimelineEntry[],
  skills: [
    { id: 'startup-operations', category: 'business', copy: { en: { label: 'Startup operations' }, ja: { label: 'スタートアップ経営' }, zh: { label: '创业运营' } } },
    { id: 'business-development', category: 'business', copy: { en: { label: 'Business development' }, ja: { label: '事業開発' }, zh: { label: '业务开发' } } },
    { id: 'project-management', category: 'business', copy: { en: { label: 'Project management' }, ja: { label: 'プロジェクト管理' }, zh: { label: '项目管理' } } },
    { id: 'typescript', category: 'technical', copy: { en: { label: 'TypeScript' }, ja: { label: 'TypeScript' }, zh: { label: 'TypeScript' } } },
    { id: 'web-development', category: 'technical', copy: { en: { label: 'Web development' }, ja: { label: 'Web 開発' }, zh: { label: 'Web 开发' } } },
    { id: 'server-management', category: 'technical', copy: { en: { label: 'Server management' }, ja: { label: 'サーバー管理' }, zh: { label: '服务器管理' } } },
    { id: 'domain-management', category: 'technical', copy: { en: { label: 'Domain management' }, ja: { label: 'ドメイン管理' }, zh: { label: '域名管理' } } },
    { id: 'chinese', category: 'language', copy: { en: { label: 'Chinese', proficiency: 'Native' }, ja: { label: '中国語', proficiency: 'ネイティブ' }, zh: { label: '中文', proficiency: '母语' } } },
    { id: 'english', category: 'language', copy: { en: { label: 'English', proficiency: 'Business' }, ja: { label: '英語', proficiency: 'ビジネス' }, zh: { label: '英语', proficiency: '商务' } } },
    { id: 'japanese', category: 'language', copy: { en: { label: 'Japanese', proficiency: 'Conversational' }, ja: { label: '日本語', proficiency: '日常会話' }, zh: { label: '日语', proficiency: '日常会话' } } },
  ] satisfies readonly Skill[],
  certifications: [
    {
      id: 'padi-open-water-diver',
      issuer: 'PADI',
      copy: { en: { name: 'Open Water Diver' }, ja: { name: 'オープン・ウォーター・ダイバー' }, zh: { name: '开放水域潜水员' } },
    },
  ] satisfies readonly Certification[],
} as const;
