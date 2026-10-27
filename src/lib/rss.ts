import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_ORIGIN, SITE_TITLE } from '../consts';
import { getUiCopy } from '../i18n/ui';
import { postPath, publishedPosts } from './content';
import { localizedPath, type Locale } from './i18n';

export async function localeFeed(locale: Locale, site: URL | undefined) {
	const copy = getUiCopy(locale);
	const posts = publishedPosts(await getCollection('blog'), locale);

	return rss({
		title: `${SITE_TITLE} — ${copy.nav.blog}`,
		description: copy.blog.title,
		site: new URL(localizedPath(locale), site ?? SITE_ORIGIN),
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: postPath(post),
		})),
	});
}
