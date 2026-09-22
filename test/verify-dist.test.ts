import { afterAll, beforeEach, expect, test } from 'bun:test';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { profile } from '../src/data/profile';

const fixtureRoot = join(process.cwd(), '.temp', 'verify-dist-test');
const distRoot = join(fixtureRoot, 'dist');
const contentRoot = join(fixtureRoot, 'content');
const siteOrigin = 'https://jhl.idv.hk';
const locales = ['en', 'ja', 'zh'] as const;

async function write(relativePath: string, content: string): Promise<void> {
	const path = join(fixtureRoot, relativePath);
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, content);
}

function homeHtml(locale: (typeof locales)[number]): string {
	const profileCopy = profile.copy[locale];
	return `<!doctype html><html lang="${locale}"><head>
		<title>Janyue Aosugi</title>
		<link rel="canonical" href="${siteOrigin}/${locale}/">
		${locales.map((target) => `<link rel="alternate" hreflang="${target}" href="${siteOrigin}/${target}/">`).join('')}
		<link rel="alternate" hreflang="x-default" href="${siteOrigin}/en/">
	</head><body><p>${profileCopy.role} · ${profileCopy.location}</p></body></html>`;
}

function rss(locale: (typeof locales)[number], slug: string): string {
	return `<?xml version="1.0"?><rss><channel><title>${locale} feed</title><description>${locale} description</description><link>${siteOrigin}/${locale}/</link><item><title>${locale} post</title><link>${siteOrigin}/${locale}/blog/${slug}/</link></item></channel></rss>`;
}

async function createValidFixture(): Promise<void> {
	await rm(fixtureRoot, { recursive: true, force: true });

	const expectedHtml = [
		'en/blog/index.html',
		'ja/blog/index.html',
		'zh/blog/index.html',
		'en/projects/index.html',
		'ja/projects/index.html',
		'zh/projects/index.html',
		'en/about/index.html',
		'ja/about/index.html',
		'zh/about/index.html',
		'404.html',
	];
	for (const path of expectedHtml) await write(`dist/${path}`, '<!doctype html>');
	for (const locale of locales) {
		await write(`dist/${locale}/index.html`, homeHtml(locale));
		await write(
			`dist/${locale}/about/index.html`,
			`<!doctype html><p>${profile.copy[locale].role} · ${profile.copy[locale].location}</p>`,
		);
		await write(`dist/${locale}/rss.xml`, rss(locale, `${locale}-post`));
		await write(
			`content/${locale}-post.md`,
			`---\ntitle: '${locale} post'\ndescription: '${locale} description'\npubDate: '2026-09-22'\nlang: ${locale}\nsample: ${locale === 'en'}\ndraft: false\n---\n`,
		);
	}

	await write(
		'dist/en/blog/en-post/index.html',
		'<!doctype html><html lang="en"><head><meta property="og:type" content="article"></head><body><span>Sample</span></body></html>',
	);
	await write('dist/en/blog/index.html', '<a href="/en/blog/en-post/">en post</a>');
	await write('dist/ja/blog/index.html', '<a href="/ja/blog/ja-post/">ja post</a>');
	await write('dist/zh/blog/index.html', '<a href="/zh/blog/zh-post/">zh post</a>');
	await write(
		'dist/sitemap-0.xml',
		`<?xml version="1.0"?><urlset>${locales.map((locale) => `<url><loc>${siteOrigin}/${locale}/</loc></url>`).join('')}</urlset>`,
	);
	await write(
		'dist/sitemap-index.xml',
		`<?xml version="1.0"?><sitemapindex><sitemap><loc>${siteOrigin}/sitemap-0.xml</loc></sitemap></sitemapindex>`,
	);
}

async function runVerifier() {
	const childProcess = Bun.spawn(['bun', 'scripts/verify-dist.ts', distRoot, contentRoot], {
		cwd: process.cwd(),
		stderr: 'pipe',
		stdout: 'pipe',
	});
	const [exitCode, stderr, stdout] = await Promise.all([
		childProcess.exited,
		new Response(childProcess.stderr).text(),
		new Response(childProcess.stdout).text(),
	]);
	return { exitCode, stderr, stdout };
}

beforeEach(createValidFixture);
afterAll(() => rm(fixtureRoot, { recursive: true, force: true }));

test('accepts complete localized generated output', async () => {
	const result = await runVerifier();
	expect(result.exitCode, result.stderr).toBe(0);
	expect(result.stdout).toContain('Generated site output verified.');
});

test('rejects Home output whose canonical locale disagrees with its route', async () => {
	await write('dist/ja/index.html', homeHtml('ja').replace(`${siteOrigin}/ja/`, `${siteOrigin}/en/`));
	const result = await runVerifier();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr).toContain('Home canonical for ja');
});

test('rejects an English sample article leaked into another locale index', async () => {
	await write('dist/ja/blog/index.html', '<a href="/en/blog/en-post/">en post</a>');
	const result = await runVerifier();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr).toContain('English sample article leaked into ja Blog index');
});

test('rejects generated output with no declared published English sample article', async () => {
	await write(
		'content/en-post.md',
		"---\ntitle: 'en post'\ndescription: 'en description'\npubDate: '2026-09-22'\nlang: en\nsample: false\ndraft: false\n---\n",
	);
	const result = await runVerifier();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr).toContain('No declared published English sample article');
});

test('rejects an RSS feed containing another locale entry', async () => {
	await write(
		'dist/en/rss.xml',
		rss('en', 'en-post').replace('</channel>', `<item><link>${siteOrigin}/ja/blog/ja-post/</link></item></channel>`),
	);
	const result = await runVerifier();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr).toContain('Unexpected RSS entry for en');
});

test('rejects a global RSS feed left beside the localized feeds', async () => {
	await write('dist/rss.xml', rss('en', 'en-post'));
	const result = await runVerifier();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr).toContain('Global RSS output must not exist');
});

test('rejects a sitemap without every locale root', async () => {
	await write(
		'dist/sitemap-0.xml',
		`<?xml version="1.0"?><urlset><url><loc>${siteOrigin}/en/</loc></url><url><loc>${siteOrigin}/ja/</loc></url></urlset>`,
	);
	const result = await runVerifier();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr).toContain('Sitemap locale root for zh');
});

test('rejects redirect-only legacy URLs in the sitemap', async () => {
	await write(
		'dist/sitemap-0.xml',
		`<?xml version="1.0"?><urlset>${locales.map((locale) => `<url><loc>${siteOrigin}/${locale}/</loc></url>`).join('')}<url><loc>${siteOrigin}/blog/</loc></url></urlset>`,
	);
	const result = await runVerifier();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr).toContain('Non-canonical sitemap location');
});

test('rejects duplicate locale alternates in a sitemap entry', async () => {
	await write(
		'dist/sitemap-0.xml',
		`<?xml version="1.0"?><urlset>${locales.map((locale) => `<url><loc>${siteOrigin}/${locale}/</loc>${locale === 'en' ? `<xhtml:link hreflang="en-GB" href="${siteOrigin}/en/"/><xhtml:link hreflang="en-GB" href="${siteOrigin}/"/>` : ''}</url>`).join('')}</urlset>`,
	);
	const result = await runVerifier();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr).toContain('Duplicate sitemap alternate');
});

test('rejects English-only profile role and location on localized pages', async () => {
	await write(
		'dist/ja/index.html',
		homeHtml('ja')
			.replace(profile.copy.ja.role, profile.copy.en.role)
			.replace(profile.copy.ja.location, profile.copy.en.location),
	);
	await write('dist/zh/about/index.html', `<p>${profile.copy.en.role} · ${profile.copy.en.location}</p>`);
	const result = await runVerifier();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr).toMatch(/Profile copy for (ja Home|zh About)/);
});

test('rejects the placeholder origin anywhere in feeds or sitemaps', async () => {
	await write('dist/en/rss.xml', rss('en', 'en-post').replace(`${siteOrigin}/en/</link>`, 'https://example.com/en/</link>'));
	const result = await runVerifier();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr).toContain('Placeholder origin in generated feed or sitemap');
});

test('rejects an RSS channel that does not link to its locale root', async () => {
	await write('dist/ja/rss.xml', rss('ja', 'ja-post').replace(`${siteOrigin}/ja/</link>`, `${siteOrigin}/</link>`));
	const result = await runVerifier();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr).toContain('RSS channel link for ja');
});

test('uses frontmatter slug overrides for sample output and RSS routes', async () => {
	await write(
		'content/en-post.md',
		"---\ntitle: 'en post'\ndescription: 'en description'\npubDate: '2026-09-22'\nlang: en\nslug: guides/custom-sample\nsample: true\ndraft: false\n---\n",
	);
	await rm(join(distRoot, 'en', 'blog', 'en-post'), { recursive: true, force: true });
	await write(
		'dist/en/blog/guides/custom-sample/index.html',
		'<!doctype html><html lang="en"><head><meta property="og:type" content="article"></head><body><span>Sample</span></body></html>',
	);
	await write('dist/en/rss.xml', rss('en', 'guides/custom-sample'));

	const result = await runVerifier();
	expect(result.exitCode, result.stderr).toBe(0);
});
