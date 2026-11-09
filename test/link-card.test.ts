import { describe, expect, test } from 'bun:test';
import { markdownToHtml } from 'satteri';
import { createResolver, formatCount, githubRepo, linkCard, parsePageMeta, type LinkCardOptions } from '../src/lib/link-card';

const repoJson = {
	full_name: 'owner/tool',
	description: 'A <small> & useful tool.',
	language: 'Go',
	stargazers_count: 1234,
};

const pageHtml = `<!doctype html><html><head>
<title>Fallback title</title>
<meta property="og:title" content="Page &amp; Title">
<meta content='Short summary.' name='description'>
<meta property="og:site_name" content="Example Docs">
</head><body><meta property="og:title" content="Ignored"></body></html>`;

const fakeFetch = (calls: string[] = []) =>
	(async (input: string | URL | Request) => {
		const url = String(input);
		calls.push(url);
		if (url === 'https://api.github.com/repos/owner/tool') return Response.json(repoJson);
		if (url === 'https://example.com/doc') return new Response(pageHtml, { headers: { 'content-type': 'text/html; charset=utf-8' } });
		if (url === 'https://example.com/file.zip') return new Response('PK', { headers: { 'content-type': 'application/zip' } });
		throw new Error(`offline: ${url}`);
	}) as typeof fetch;

const render = async (markdown: string, options: LinkCardOptions = {}) => {
	const result = await markdownToHtml(markdown, {
		mdastPlugins: [linkCard({ fetch: fakeFetch(), cacheFile: null, ...options })],
	});
	return result.html;
};

describe('link card', () => {
	test('renders a GitHub repository URL on its own line as a card', async () => {
		const html = await render('https://github.com/owner/tool\n');
		expect(html).toContain('<div class="embed-card"><a class="embed-card-link" href="https://github.com/owner/tool" data-embed="github">');
		expect(html).toContain('<span class="embed-card-title">owner/tool</span>');
		expect(html).toContain('A &lt;small&gt; &amp; useful tool.');
		expect(html).toContain('<span class="embed-card-fact">Go</span>');
		expect(html).toContain('1.2k<span class="sr-only"> stars</span>');
		expect(html).not.toContain('<p>');
	});

	test('renders other pages from Open Graph and meta tags', async () => {
		const html = await render('<https://example.com/doc>\n');
		expect(html).toContain('data-embed="page"');
		expect(html).toContain('<span class="embed-card-host">Example Docs</span>');
		expect(html).toContain('<span class="embed-card-title">Page &amp; Title</span>');
		expect(html).toContain('<span class="embed-card-description">Short summary.</span>');
	});

	test('leaves inline, labelled, and unresolvable links untouched', async () => {
		const html = await render(
			[
				'See https://github.com/owner/tool for details.',
				'[the tool](https://github.com/owner/tool)',
				'https://offline.example/page',
				'https://example.com/file.zip',
			].join('\n\n'),
		);
		expect(html).not.toContain('embed-card');
		expect(html).toContain('<a href="https://offline.example/page">https://offline.example/page</a>');
	});

	test('only treats bare repository roots as GitHub repositories', () => {
		expect(githubRepo('https://github.com/owner/tool')).toEqual({ owner: 'owner', repo: 'tool' });
		expect(githubRepo('https://github.com/owner/tool.git')).toEqual({ owner: 'owner', repo: 'tool' });
		expect(githubRepo('https://github.com/owner/tool/releases')).toBeNull();
		expect(githubRepo('https://github.com/owner')).toBeNull();
	});

	test('reads head metadata only and falls back to the title tag', () => {
		expect(parsePageMeta(pageHtml, 'https://www.example.com/')?.title).toBe('Page & Title');
		expect(parsePageMeta('<head><title> Plain </title></head>', 'https://www.example.com/')).toEqual({
			kind: 'page',
			url: 'https://www.example.com/',
			host: 'example.com',
			title: 'Plain',
			description: undefined,
		});
		expect(parsePageMeta('<head></head>', 'https://example.com/')).toBeNull();
	});

	test('formats star counts compactly', () => {
		expect(formatCount(999)).toBe('999');
		expect(formatCount(1000)).toBe('1k');
		expect(formatCount(1234)).toBe('1.2k');
		expect(formatCount(63830)).toBe('64k');
		expect(formatCount(2_500_000)).toBe('2.5M');
	});

	test('reuses fresh cache entries and falls back to stale ones when offline', async () => {
		const calls: string[] = [];
		let now = 0;
		const online = createResolver({ fetch: fakeFetch(calls), cacheFile: null, now: () => now, maxAgeMs: 100 });
		await Promise.all([online('https://github.com/owner/tool'), online('https://github.com/owner/tool')]);
		await online('https://github.com/owner/tool');
		expect(calls).toHaveLength(1);

		now = 1000;
		const failing = (async () => {
			throw new Error('offline');
		}) as unknown as typeof fetch;
		const cacheFile = `.temp/link-card-test-${process.pid}.json`;
		const first = createResolver({ fetch: fakeFetch(), cacheFile, now: () => 0, maxAgeMs: 100 });
		await first('https://github.com/owner/tool');
		const second = createResolver({ fetch: failing, cacheFile, now: () => now, maxAgeMs: 100 });
		expect((await second('https://github.com/owner/tool'))?.title).toBe('owner/tool');
		await Bun.file(cacheFile).delete();
	});
});
