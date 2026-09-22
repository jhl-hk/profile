export interface FilterablePost {
	title: string;
	description: string;
	topics: string[];
}

interface FilterablePostElement {
	hidden: boolean;
	closest(selector: string): { hidden: boolean } | null;
}

export function normalizeFilterValue(value: string, locale?: string): string {
	const normalized = value.normalize('NFKC');
	return (locale ? normalized.toLocaleLowerCase(locale) : normalized.toLocaleLowerCase()).trim();
}

export function matchesPostFilter(
	post: FilterablePost,
	query: string,
	selectedTopic: string,
	locale: string,
): boolean {
	const normalizedPost = {
		title: normalizeFilterValue(post.title, locale),
		description: normalizeFilterValue(post.description, locale),
		topics: post.topics.map((topic) => normalizeFilterValue(topic, locale)),
	};
	const normalizedQuery = normalizeFilterValue(query, locale);
	const normalizedTopic = normalizeFilterValue(selectedTopic, locale);
	const matchesSearch = !normalizedQuery
		|| `${normalizedPost.title} ${normalizedPost.description} ${normalizedPost.topics.join(' ')}`.includes(normalizedQuery);
	const matchesTopic = !normalizedTopic || normalizedPost.topics.includes(normalizedTopic);
	return matchesSearch && matchesTopic;
}

export function setPostFilterVisibility(row: FilterablePostElement, visible: boolean): void {
	row.hidden = !visible;
	const featuredWrapper = row.closest('[data-featured-wrap]');
	if (featuredWrapper) featuredWrapper.hidden = !visible;
}
