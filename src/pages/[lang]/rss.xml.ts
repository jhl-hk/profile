import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_ORIGIN, SITE_TITLE } from '../../consts';
import { getUiCopy } from '../../i18n/ui';
import { publishedPosts, postSlug } from '../../lib/content';
import { locales, type Locale } from '../../lib/i18n';

export function getStaticPaths() {
	return locales.map((locale) => ({ params: { lang: locale }, props: { locale } }));
}

export async function GET(context: { props: { locale: Locale }; site: URL | undefined }) {
	const { locale } = context.props;
	const copy = getUiCopy(locale);
	const posts = publishedPosts(await getCollection('blog'), locale);

	return rss({
		title: `${SITE_TITLE} — ${copy.nav.blog}`,
		description: copy.blog.title,
		site: new URL(`/${locale}/`, context.site ?? SITE_ORIGIN),
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/${locale}/blog/${postSlug(post)}/`,
		})),
	});
}
