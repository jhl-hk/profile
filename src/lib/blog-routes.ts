import { slug as githubSlug } from 'github-slugger';

export interface BlogContentIdInput {
	entry: string;
	data: { slug?: unknown };
}

export function blogContentId({ entry, data }: BlogContentIdInput): string {
	if (data.slug) return String(data.slug);

	const normalizedEntry = entry.replaceAll('\\', '/');
	const withoutExtension = normalizedEntry.replace(/\.[^/.]+$/, '');
	return withoutExtension
		.split('/')
		.map((segment) => githubSlug(segment))
		.join('/')
		.replace(/\/index$/, '');
}
