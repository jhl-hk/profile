import { SITE_EMAIL, SITE_NAME, SITE_ORIGIN } from '../consts';

export type LinkGroupId = 'bffs' | 'friends';

interface FriendLink {
  id: string;
  name: string;
  url: string;
  description?: string;
}

interface LinkGroup {
  id: LinkGroupId;
  links: readonly FriendLink[];
}

export const linkGroups = [
  {
    id: 'bffs',
    links: [
      {
        id: 'homelabproject',
        name: 'HomeLabProject',
        url: 'https://www.homelabproject.cc',
        description: '一个捡垃圾的家里云用户',
      },
      {
        id: 'ian-lau',
        name: 'Ian Lau',
        url: 'https://ianl.au',
        description: 'Full-Stack Developer!!!',
      },
      {
        id: 'r9',
        name: 'ミルクねこのブログ',
        url: 'https://r9.do',
      },
    ],
  },
  {
    id: 'friends',
    links: [
      {
        id: 'hanyuxin',
        name: '寒雨馨的个人博客',
        url: 'https://www.hanyuxin.cn/',
      },
      {
        id: 'kusi-guanmu',
        name: '枯死的灌木',
        url: 'https://12520.net',
        description: '灌木鼓捣乱七八糟技术的小破站',
      },
      {
        id: 'lazy-blog',
        name: "Lazy's Blog",
        url: 'https://blog.imlazy.ink:233/',
        description: 'Share somethings with you',
      },
    ],
  },
] as const satisfies readonly LinkGroup[];

export const siteLinkCard = {
  name: SITE_NAME,
  url: SITE_ORIGIN,
  avatar: `${SITE_ORIGIN}/apple-touch-icon.png`,
  email: SITE_EMAIL,
} as const;

export function linkHost(url: string): string {
  const { host } = new URL(url);
  return host.replace(/^www\./, '');
}
