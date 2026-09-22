import { afterAll, beforeAll, expect, test } from 'bun:test';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { readDeclaredArticles } from '../scripts/verify-blog-output';

const fixtureRoot = join(process.cwd(), '.temp', 'blog-manifest-test');

async function write(relativePath: string, frontmatter: string): Promise<void> {
	const path = join(fixtureRoot, relativePath);
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, `---\nlang: en\n${frontmatter}---\n`);
}

beforeAll(async () => {
	await rm(fixtureRoot, { recursive: true, force: true });
	await write('My Notes.md', 'topics: []\n');
	await write('guides/index.md', 'topics: []\n');
	await write('source.md', 'slug: editorial/custom-route\ntopics: []\n');
});

afterAll(() => rm(fixtureRoot, { recursive: true, force: true }));

test('derives verifier routes from Astro-normalized content IDs', async () => {
	const articles = await readDeclaredArticles(fixtureRoot);
	const routes = articles
		.map(({ id, slug }) => ({ id, slug }))
		.sort((a, b) => a.id.localeCompare(b.id));

	expect(routes).toEqual([
		{ id: 'editorial/custom-route', slug: 'editorial/custom-route' },
		{ id: 'guides', slug: 'guides' },
		{ id: 'my-notes', slug: 'my-notes' },
	]);
});
