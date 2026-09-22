import type { Locale } from '../lib/i18n';

export interface UiCopy {
  nav: {
    home: string;
    projects: string;
    about: string;
    blog: string;
  };
  actions: {
    viewProjects: string;
    viewAll: string;
    readMore: string;
    getInTouch: string;
    sendEmail: string;
    backHome: string;
  };
  home: {
    eyebrow: string;
    introduction: string;
    featuredProjects: string;
  };
  blog: {
    title: string;
    empty: string;
    featured: string;
    sample: string;
    search: string;
    searchPlaceholder: string;
    filters: string;
    topics: string;
    allTopics: string;
    resultCount: string;
    noResults: string;
    tableOfContents: string;
    translations: string;
    previous: string;
    next: string;
    updated: string;
  };
  projects: {
    title: string;
    introduction: string;
  };
  about: {
    title: string;
    experience: string;
    education: string;
    skills: string;
    certifications: string;
  };
  notFound: {
    title: string;
    description: string;
  };
  accessibility: {
    skipToContent: string;
    primaryNavigation: string;
    languageSwitcher: string;
    socialLinks: string;
    themeSwitcher: string;
    lightTheme: string;
    darkTheme: string;
    translationUnavailable: string;
  };
  footer: {
    copyright: string;
    builtWith: string;
  };
}

const uiCopy: Record<Locale, UiCopy> = {
  en: {
    nav: { home: 'Home', projects: 'Projects', about: 'About', blog: 'Blog' },
    actions: {
      viewProjects: 'View projects',
      viewAll: 'View all',
      readMore: 'Read more',
      getInTouch: 'Get in touch',
      sendEmail: 'Send an email',
      backHome: 'Back home',
    },
    home: {
      eyebrow: 'Hello, I am',
      introduction: 'A founder and web developer based in Tokyo.',
      featuredProjects: 'Featured projects',
    },
    blog: {
      title: 'Notes on building useful things.',
      empty: 'No posts yet.',
      featured: 'Featured',
      sample: 'Sample',
      search: 'Search posts',
      searchPlaceholder: 'Search by title, description, or topic',
      filters: 'Filter posts',
      topics: 'Topics',
      allTopics: 'All topics',
      resultCount: '{count} posts',
      noResults: 'No matching posts',
      tableOfContents: 'On this page',
      translations: 'Translations',
      previous: 'Previous post',
      next: 'Next post',
      updated: 'Updated',
    },
    projects: {
      title: 'Selected work and long-running ideas.',
      introduction: 'Projects and organisations I work on.',
    },
    about: {
      title: 'Founder, developer, and student in Tokyo.',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      certifications: 'Certifications',
    },
    notFound: { title: 'Page not found', description: 'The page you requested does not exist.' },
    accessibility: {
      skipToContent: 'Skip to content',
      primaryNavigation: 'Primary navigation',
      languageSwitcher: 'Choose language',
      socialLinks: 'Social links',
      themeSwitcher: 'Switch colour theme',
      lightTheme: 'Use light theme',
      darkTheme: 'Use dark theme',
      translationUnavailable: 'Translation unavailable; view the blog in',
    },
    footer: { copyright: 'All rights reserved.', builtWith: 'Built with Astro.' },
  },
  ja: {
    nav: { home: 'ホーム', projects: 'プロジェクト', about: 'プロフィール', blog: 'ブログ' },
    actions: {
      viewProjects: 'プロジェクトを見る',
      viewAll: 'すべて見る',
      readMore: '続きを読む',
      getInTouch: '問い合わせる',
      sendEmail: 'メールを送る',
      backHome: 'ホームに戻る',
    },
    home: {
      eyebrow: 'こんにちは、私は',
      introduction: '東京を拠点に活動する起業家・Web 開発者です。',
      featuredProjects: '注目のプロジェクト',
    },
    blog: {
      title: '役に立つものをつくるための記録。',
      empty: 'まだ投稿はありません。',
      featured: '注目の記事',
      sample: 'サンプル',
      search: '記事を検索',
      searchPlaceholder: 'タイトル、概要、トピックで検索',
      filters: '記事を絞り込む',
      topics: 'トピック',
      allTopics: 'すべて',
      resultCount: '{count}件の記事',
      noResults: '一致する記事はありません',
      tableOfContents: '目次',
      translations: '翻訳',
      previous: '前の記事',
      next: '次の記事',
      updated: '更新',
    },
    projects: {
      title: '取り組んできた仕事と、育て続けている構想。',
      introduction: '取り組んでいるプロジェクトと組織です。',
    },
    about: {
      title: '東京で学び、つくり、事業を育てています。',
      experience: '経験',
      education: '学歴',
      skills: 'スキル',
      certifications: '資格',
    },
    notFound: { title: 'ページが見つかりません', description: 'お探しのページは存在しません。' },
    accessibility: {
      skipToContent: '本文へ移動',
      primaryNavigation: 'メインナビゲーション',
      languageSwitcher: '言語を選択',
      socialLinks: 'ソーシャルリンク',
      themeSwitcher: 'カラーテーマを切り替え',
      lightTheme: 'ライトテーマを使用',
      darkTheme: 'ダークテーマを使用',
      translationUnavailable: '翻訳はありません。次の言語のブログを表示:',
    },
    footer: { copyright: 'All rights reserved.', builtWith: 'Astro で構築。' },
  },
  zh: {
    nav: { home: '首页', projects: '项目', about: '关于', blog: '博客' },
    actions: {
      viewProjects: '查看项目',
      viewAll: '查看全部',
      readMore: '阅读更多',
      getInTouch: '联系我',
      sendEmail: '发送邮件',
      backHome: '返回首页',
    },
    home: {
      eyebrow: '你好，我是',
      introduction: '一名常驻东京的创业者和 Web 开发者。',
      featuredProjects: '重点项目',
    },
    blog: {
      title: '关于创造有用事物的笔记。',
      empty: '暂时没有文章。',
      featured: '精选文章',
      sample: '示例',
      search: '搜索文章',
      searchPlaceholder: '按标题、摘要或主题搜索',
      filters: '筛选文章',
      topics: '主题',
      allTopics: '全部',
      resultCount: '{count} 篇文章',
      noResults: '没有匹配的文章',
      tableOfContents: '本文目录',
      translations: '翻译',
      previous: '上一篇',
      next: '下一篇',
      updated: '更新于',
    },
    projects: {
      title: '持续投入的项目与长期构想。',
      introduction: '我正在参与的项目和组织。',
    },
    about: {
      title: '在东京学习、创造并经营事业。',
      experience: '经历',
      education: '教育',
      skills: '技能',
      certifications: '认证',
    },
    notFound: { title: '页面未找到', description: '你访问的页面不存在。' },
    accessibility: {
      skipToContent: '跳到正文',
      primaryNavigation: '主导航',
      languageSwitcher: '选择语言',
      socialLinks: '社交链接',
      themeSwitcher: '切换颜色主题',
      lightTheme: '使用浅色主题',
      darkTheme: '使用深色主题',
      translationUnavailable: '暂无翻译；查看此语言的博客：',
    },
    footer: { copyright: '版权所有。', builtWith: '使用 Astro 构建。' },
  },
};

export function getUiCopy(locale: Locale): UiCopy {
  return uiCopy[locale];
}
