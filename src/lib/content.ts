import type { Locale } from './i18n';

export interface PostLike {
	id: string;
	body?: string;
	data: {
		lang: Locale;
		pubDate: Date;
		translationKey?: string;
		draft?: boolean;
		featured?: boolean;
	};
}

export function postSlug(post: PostLike): string {
	return post.id.split('/').filter(Boolean).at(-1) ?? post.id;
}

export function articlePaths<T extends PostLike>(posts: T[]) {
	const routes = new Set<string>();
	return posts
		.filter((post) => !post.data.draft)
		.map((post) => {
			const params = { lang: post.data.lang, slug: postSlug(post) };
			const route = `${params.lang}/${params.slug}`;
			if (routes.has(route)) throw new Error(`Duplicate article route: /${route}/`);
			routes.add(route);
			return { params, props: { post } };
		});
}

export function publishedPosts<T extends PostLike>(posts: T[], locale: Locale): T[] {
	return posts
		.filter((post) => post.data.lang === locale && !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function translationTargets<T extends PostLike>(posts: T[], current: T): Partial<Record<Locale, string>> {
	const related = current.data.translationKey
		? posts.filter((post) => !post.data.draft && post.data.translationKey === current.data.translationKey)
		: [current];
	return Object.fromEntries(related.map((post) => [post.data.lang, `/${post.data.lang}/blog/${postSlug(post)}/`]));
}

export function adjacentPosts<T extends PostLike>(posts: T[], current: T, locale: Locale) {
	const localized = publishedPosts(posts, locale);
	const index = localized.findIndex((post) => post.id === current.id);
	return {
		previous: index >= 0 ? localized[index + 1] : undefined,
		next: index > 0 ? localized[index - 1] : undefined,
	};
}

export function estimateReadingMinutes(body = ''): number {
	const cjkPattern = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/g;
	const cjk = body.match(cjkPattern)?.length ?? 0;
	const latin = body.replace(cjkPattern, ' ').split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(cjk / 500 + latin / 220));
}
