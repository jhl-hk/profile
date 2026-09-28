import type { Locale } from '../lib/i18n';

type Localized<T> = Record<Locale, T>;

interface TimelineCopy {
  title: string;
  description?: string;
  location?: string;
}

interface TimelineEntry {
  id: string;
  organisation: string;
  start?: string;
  end?: string | null;
  copy: Localized<TimelineCopy>;
}

interface Interest {
  id: string;
  copy: Localized<{ label: string }>;
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
  name: 'Jianyue Hugo Liang',
  legalName: 'Jianyue Hugo Liang, a.k.a. Janyue Aosugi',
  email: 'mailto:ja@jhl.hk',
  socials: {
    github: 'https://github.com/jhl-hk',
    linkedin: 'https://www.linkedin.com/in/jhl-hk/',
  },
  copy: {
    en: {
      role: 'Co-Founder & CEO @ JianyueLab Ltd',
      location: 'Tokyo, Japan',
      bio: 'Developer, translator, and student in Japan, building JianyueLab while studying the International Baccalaureate. Interested in server and network programming, and aviation.',
      contact: 'Open to thoughtful conversations about software, infrastructure, and new projects.',
    },
    ja: {
      role: 'JianyueLab Ltd 共同創業者・CEO',
      location: '日本・東京',
      bio: '日本で国際バカロレアを学びながら JianyueLab を運営する、開発者・翻訳者・学生です。サーバー・ネットワークプログラミングと航空に関心があります。',
      contact: 'ソフトウェア、インフラ、新しいプロジェクトについてのご相談を歓迎します。',
    },
    zh: {
      role: 'JianyueLab Ltd 联合创始人兼 CEO',
      location: '日本东京',
      bio: '在日本学习国际文凭课程，同时经营 JianyueLab 的开发者、翻译者和学生。关注服务器与网络编程，以及航空。',
      contact: '欢迎交流软件、基础设施以及新的项目合作。',
    },
  },
  experience: [
    {
      id: 'hangzhou-silicon-based-agile-technology',
      organisation: 'Hangzhou Silicon-based Agile Technology Limited',
      start: '2026-04',
      end: null,
      copy: {
        en: { title: 'Director', location: 'Hangzhou' },
        ja: { title: '取締役', location: '杭州' },
        zh: { title: '董事', location: '杭州' },
      },
    },
    {
      id: 'kyouyuu-shanghai-commercial',
      organisation: 'Kyouyuu (Shanghai) Commercial Co., Ltd',
      start: '2026-01',
      end: null,
      copy: {
        en: { title: 'Information Technology Administrator', location: 'Shanghai, China' },
        ja: { title: '情報技術管理者', location: '中国・上海' },
        zh: { title: '信息技术管理员', location: '中国上海' },
      },
    },
    {
      id: 'jianyuelab-ltd',
      organisation: 'JianyueLab Ltd',
      start: '2025-12',
      end: null,
      copy: {
        en: { title: 'Co-Founder & CEO', location: 'United Kingdom', description: 'Network infrastructure and cloud-computing startup; a RIPE NCC Local Internet Registry and ARIN member.' },
        ja: { title: '共同創業者・CEO', location: 'イギリス', description: 'ネットワークインフラとクラウドコンピューティングのスタートアップ。RIPE NCC の Local Internet Registry であり、ARIN の会員。' },
        zh: { title: '联合创始人兼 CEO', location: '英国', description: '网络基础设施与云计算初创企业；RIPE NCC 本地互联网注册机构（LIR）及 ARIN 会员。' },
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
    {
      id: 'cerulean-aviation-network',
      organisation: 'Airway Simulation Network',
      start: '2025-03',
      end: null,
      copy: {
        en: { title: 'Co-founder', description: 'Co-founded Airway Simulation Network and contributed to its server infrastructure.' },
        ja: { title: '共同創設者', description: 'Airway Simulation Network を共同設立し、サーバーインフラに貢献。' },
        zh: { title: '联合创始人', description: '联合创办 Airway Simulation Network，并为其服务器基础设施作出贡献。' },
      },
    },
    {
      id: 'mcsmanager',
      organisation: 'MCSManager',
      start: '2023-05',
      end: null,
      copy: {
        en: { title: 'Translator & Community Moderator', description: 'Translated MCSManager and moderated its community.' },
        ja: { title: '翻訳者・コミュニティモデレーター', description: 'MCSManager の翻訳とコミュニティモデレーションを担当。' },
        zh: { title: '翻译者兼社区管理员', description: '参与 MCSManager 翻译并担任社区管理员。' },
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
  interests: [
    { id: 'server-network-programming', copy: { en: { label: 'Server and network programming' }, ja: { label: 'サーバー・ネットワークプログラミング' }, zh: { label: '服务器与网络编程' } } },
    { id: 'aviation', copy: { en: { label: 'Aviation' }, ja: { label: '航空' }, zh: { label: '航空' } } },
  ] satisfies readonly Interest[],
  skills: [
    { id: 'startup-operations', category: 'business', copy: { en: { label: 'Startup operations' }, ja: { label: 'スタートアップ経営' }, zh: { label: '创业运营' } } },
    { id: 'business-development', category: 'business', copy: { en: { label: 'Business development' }, ja: { label: '事業開発' }, zh: { label: '业务开发' } } },
    { id: 'project-management', category: 'business', copy: { en: { label: 'Project management' }, ja: { label: 'プロジェクト管理' }, zh: { label: '项目管理' } } },
    { id: 'typescript', category: 'technical', copy: { en: { label: 'TypeScript' }, ja: { label: 'TypeScript' }, zh: { label: 'TypeScript' } } },
    { id: 'web-development', category: 'technical', copy: { en: { label: 'Web development' }, ja: { label: 'Web 開発' }, zh: { label: 'Web 开发' } } },
    { id: 'server-management', category: 'technical', copy: { en: { label: 'Server management' }, ja: { label: 'サーバー管理' }, zh: { label: '服务器管理' } } },
    { id: 'domain-management', category: 'technical', copy: { en: { label: 'Domain management' }, ja: { label: 'ドメイン管理' }, zh: { label: '域名管理' } } },
    { id: 'javascript', category: 'technical', copy: { en: { label: 'JavaScript' }, ja: { label: 'JavaScript' }, zh: { label: 'JavaScript' } } },
    { id: 'python', category: 'technical', copy: { en: { label: 'Python' }, ja: { label: 'Python' }, zh: { label: 'Python' } } },
    { id: 'go', category: 'technical', copy: { en: { label: 'Go' }, ja: { label: 'Go' }, zh: { label: 'Go' } } },
    { id: 'java', category: 'technical', copy: { en: { label: 'Java' }, ja: { label: 'Java' }, zh: { label: 'Java' } } },
    { id: 'svelte', category: 'technical', copy: { en: { label: 'Svelte' }, ja: { label: 'Svelte' }, zh: { label: 'Svelte' } } },
    { id: 'vue', category: 'technical', copy: { en: { label: 'Vue' }, ja: { label: 'Vue' }, zh: { label: 'Vue' } } },
    { id: 'nextjs', category: 'technical', copy: { en: { label: 'Next.js' }, ja: { label: 'Next.js' }, zh: { label: 'Next.js' } } },
    { id: 'mikrotik', category: 'technical', copy: { en: { label: 'MikroTik' }, ja: { label: 'MikroTik' }, zh: { label: 'MikroTik' } } },
    { id: 'mediawiki', category: 'technical', copy: { en: { label: 'MediaWiki' }, ja: { label: 'MediaWiki' }, zh: { label: 'MediaWiki' } } },
    { id: 'system-administration', category: 'technical', copy: { en: { label: 'System administration' }, ja: { label: 'システム管理' }, zh: { label: '系统管理' } } },
    { id: 'chinese', category: 'language', copy: { en: { label: 'Chinese', proficiency: 'Native or bilingual' }, ja: { label: '中国語', proficiency: 'ネイティブまたはバイリンガル' }, zh: { label: '中文', proficiency: '母语或双语' } } },
    { id: 'english', category: 'language', copy: { en: { label: 'English', proficiency: 'Professional working' }, ja: { label: '英語', proficiency: '業務上の使用が可能' }, zh: { label: '英语', proficiency: '专业工作能力' } } },
    { id: 'japanese', category: 'language', copy: { en: { label: 'Japanese', proficiency: 'Limited working' }, ja: { label: '日本語', proficiency: '限定的な業務使用' }, zh: { label: '日语', proficiency: '有限工作能力' } } },
  ] satisfies readonly Skill[],
  certifications: [
    {
      id: 'padi-open-water-diver',
      issuer: 'PADI',
      copy: { en: { name: 'Open Water Diver' }, ja: { name: 'オープン・ウォーター・ダイバー' }, zh: { name: '开放水域潜水员' } },
    },
  ] satisfies readonly Certification[],
} as const;
