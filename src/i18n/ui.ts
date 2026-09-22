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
    blog: { title: 'Notes on building useful things.', empty: 'No posts yet.' },
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
    blog: { title: '役に立つものをつくるための記録。', empty: 'まだ投稿はありません。' },
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
    blog: { title: '关于创造有用事物的笔记。', empty: '暂时没有文章。' },
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
