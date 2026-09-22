import { describe, expect, test } from 'bun:test';
import {
	adjacentPosts,
	estimateReadingMinutes,
	postSlug,
	publishedPosts,
	translationTargets,
	type PostLike,
} from '../src/lib/content';

const posts: PostLike[] = [
	{ id: 'shared', data: { lang: 'en', pubDate: new Date('2026-09-20'), translationKey: 'shared' } },
	{ id: 'shared-ja', data: { lang: 'ja', pubDate: new Date('2026-09-19'), translationKey: 'shared' } },
	{ id: 'standalone', data: { lang: 'zh', pubDate: new Date('2026-09-18') } },
	{ id: 'draft', data: { lang: 'en', pubDate: new Date('2026-09-22'), draft: true } },
];

describe('blog content helpers', () => {
	test('filters drafts and languages', () => {
		expect(publishedPosts(posts, 'en').map((post) => post.id)).toEqual(['shared']);
	});

	test('links translations but keeps standalone posts independent', () => {
		expect(translationTargets(posts, posts[0])).toEqual({ en: '/en/blog/shared/', ja: '/ja/blog/shared-ja/' });
		expect(translationTargets(posts, posts[2])).toEqual({ zh: '/zh/blog/standalone/' });
	});

	test('derives slugs, adjacency, and reading time', () => {
		expect(postSlug(posts[1])).toBe('shared-ja');
		expect(adjacentPosts(posts, posts[0], 'en')).toEqual({ previous: undefined, next: undefined });
		expect(estimateReadingMinutes('word '.repeat(220))).toBe(1);
		expect(estimateReadingMinutes('文'.repeat(501))).toBe(2);
	});
});
