export interface FilterablePost {
	title: string;
	description: string;
	topics: string[];
}

export function normalizeFilterValue(value: string, locale?: string): string {
	const normalized = value.normalize('NFKC');
	return (locale ? normalized.toLocaleLowerCase(locale) : normalized.toLocaleLowerCase()).trim();
}

export function matchesPostFilter(
	post: FilterablePost,
	query: string,
	selectedTopic: string,
): boolean {
	const normalizedPost = {
		title: normalizeFilterValue(post.title),
		description: normalizeFilterValue(post.description),
		topics: post.topics.map((topic) => normalizeFilterValue(topic)),
	};
	const normalizedQuery = normalizeFilterValue(query);
	const normalizedTopic = normalizeFilterValue(selectedTopic);
	const matchesSearch = !normalizedQuery
		|| `${normalizedPost.title} ${normalizedPost.description} ${normalizedPost.topics.join(' ')}`.includes(normalizedQuery);
	const matchesTopic = !normalizedTopic || normalizedPost.topics.includes(normalizedTopic);
	return matchesSearch && matchesTopic;
}
