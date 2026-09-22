import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseFrontmatter } from 'astro/markdown';
import { blogContentId } from '../src/lib/blog-routes';
import { locales, type Locale } from '../src/lib/i18n';

export interface BlogManifestEntry {
	id: string;
	sourcePath: string;
	lang: Locale;
	slug: string;
	translationKey?: string;
	topics: string[];
	sample: boolean;
}

export async function readBlogManifest(contentDirectory: string): Promise<BlogManifestEntry[]> {
	const articles: BlogManifestEntry[] = [];

	async function visit(directory: string, relative = ''): Promise<void> {
		for (const entry of await readdir(directory, { withFileTypes: true })) {
			const entryRelative = relative ? `${relative}/${entry.name}` : entry.name;
			const entryPath = join(directory, entry.name);
			if (entry.isDirectory()) {
				await visit(entryPath, entryRelative);
				continue;
			}
			if (!entry.isFile() || !/\.mdx?$/.test(entry.name)) continue;

			const { frontmatter } = parseFrontmatter(await readFile(entryPath, 'utf8'));
			if (frontmatter.draft === true) continue;
			if (!locales.includes(frontmatter.lang)) throw new Error(`Invalid Blog locale in ${entryRelative}`);
			const id = blogContentId({ entry: entryRelative, data: frontmatter });
			articles.push({
				id,
				sourcePath: entryRelative,
				lang: frontmatter.lang,
				slug: id,
				translationKey: typeof frontmatter.translationKey === 'string' ? frontmatter.translationKey : undefined,
				topics: Array.isArray(frontmatter.topics)
					? frontmatter.topics.filter((topic): topic is string => typeof topic === 'string')
					: [],
				sample: frontmatter.sample === true,
			});
		}
	}

	await visit(contentDirectory);
	return articles;
}
