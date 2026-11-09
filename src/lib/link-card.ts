import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Paragraph } from 'mdast';

export interface LinkMeta {
	kind: 'github' | 'page';
	url: string;
	host: string;
	title: string;
	description?: string;
	language?: string;
	stars?: number;
}

interface CacheEntry {
	fetchedAt: number;
	meta: LinkMeta | null;
}

type Cache = Record<string, CacheEntry>;

export interface LinkCardOptions {
	fetch?: typeof fetch;
	cacheFile?: string | null;
	githubToken?: string;
	now?: () => number;
	/** Cached entries younger than this are reused without refetching. */
	maxAgeMs?: number;
	timeoutMs?: number;
}

const DAY = 24 * 60 * 60 * 1000;
const USER_AGENT = 'jhl.idv.hk link-card';

/** Matches `https://github.com/<owner>/<repo>` with nothing after the repo name. */
export const githubRepo = (url: string): { owner: string; repo: string } | null => {
	const match = /^https?:\/\/(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i.exec(url);
	return match ? { owner: match[1], repo: match[2] } : null;
};

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

const decodeEntities = (value: string) =>
	value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (entity, code: string) => {
		if (code[0] === '#') {
			const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
			return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
		}
		return ENTITIES[code.toLowerCase()] ?? entity;
	});

const clean = (value: string | undefined) => {
	const text = value && decodeEntities(value).replace(/\s+/g, ' ').trim();
	return text || undefined;
};

/** Reads Open Graph, Twitter and plain HTML metadata from a page's `<head>`. */
export const parsePageMeta = (html: string, url: string): LinkMeta | null => {
	const end = html.search(/<\/head>/i);
	const head = end === -1 ? html : html.slice(0, end);
	const meta = new Map<string, string>();
	for (const tag of head.match(/<meta\b[^>]*>/gi) ?? []) {
		const attr = (name: string) => new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i').exec(tag);
		const key = attr('property') ?? attr('name');
		const content = attr('content');
		if (key && content) {
			const name = (key[2] ?? key[3]).toLowerCase();
			if (!meta.has(name)) meta.set(name, content[2] ?? content[3]);
		}
	}
	const titleTag = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(head)?.[1];
	const title = clean(meta.get('og:title') ?? meta.get('twitter:title') ?? titleTag);
	if (!title) return null;
	const host = new URL(url).hostname.replace(/^www\./, '');
	return {
		kind: 'page',
		url,
		host: clean(meta.get('og:site_name')) ?? host,
		title,
		description: clean(meta.get('og:description') ?? meta.get('twitter:description') ?? meta.get('description')),
	};
};

const fetchMeta = async (url: string, options: Required<Pick<LinkCardOptions, 'fetch' | 'timeoutMs'>> & LinkCardOptions) => {
	const repo = githubRepo(url);
	if (repo) {
		const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': USER_AGENT };
		if (options.githubToken) headers.Authorization = `Bearer ${options.githubToken}`;
		const response = await options.fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, {
			headers,
			signal: AbortSignal.timeout(options.timeoutMs),
		});
		if (!response.ok) throw new Error(`GitHub API ${response.status} for ${url}`);
		const data = (await response.json()) as {
			full_name: string;
			description: string | null;
			language: string | null;
			stargazers_count: number;
		};
		return {
			kind: 'github',
			url,
			host: 'github.com',
			title: data.full_name,
			description: clean(data.description ?? undefined),
			language: data.language ?? undefined,
			stars: data.stargazers_count,
		} satisfies LinkMeta;
	}

	const response = await options.fetch(url, {
		headers: { Accept: 'text/html', 'User-Agent': USER_AGENT },
		redirect: 'follow',
		signal: AbortSignal.timeout(options.timeoutMs),
	});
	if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
	if (!(response.headers.get('content-type') ?? '').includes('html')) return null;
	return parsePageMeta(await response.text(), url);
};

export const formatCount = (count: number) => {
	if (count < 1000) return String(count);
	const scaled = count < 1_000_000 ? [count / 1000, 'k'] : [count / 1_000_000, 'M'];
	const value = scaled[0] as number;
	return `${value < 10 ? value.toFixed(1).replace(/\.0$/, '') : Math.round(value)}${scaled[1]}`;
};

const escapeHtml = (value: string) =>
	value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

const span = (className: string, text: string) => `<span class="${className}">${escapeHtml(text)}</span>`;

/** The card as one line of HTML, so Markdown re-parses it as a single HTML block. */
export const renderCard = (meta: LinkMeta): string => {
	const parts = [span('embed-card-host', meta.host), span('embed-card-title', meta.title)];
	if (meta.description) parts.push(span('embed-card-description', meta.description));
	const facts: string[] = [];
	if (meta.language) facts.push(span('embed-card-fact', meta.language));
	if (meta.stars !== undefined) {
		facts.push(
			`<span class="embed-card-fact"><span aria-hidden="true">★ </span>${formatCount(meta.stars)}<span class="sr-only"> stars</span></span>`,
		);
	}
	if (facts.length) parts.push(`<span class="embed-card-facts">${facts.join('')}</span>`);
	return `<div class="embed-card"><a class="embed-card-link" href="${escapeHtml(meta.url)}" data-embed="${meta.kind}">${parts.join('')}</a></div>`;
};

/** Returns the URL when a paragraph holds nothing but one link whose text is that URL. */
export const standaloneUrl = (paragraph: Paragraph): string | null => {
	const nodes = paragraph.children.filter((node) => !(node.type === 'text' && !node.value.trim()));
	if (nodes.length !== 1 || nodes[0].type !== 'link') return null;
	const link = nodes[0];
	if (link.children.length !== 1 || link.children[0].type !== 'text') return null;
	const bare = (value: string) => value.trim().replace(/^https?:\/\//, '');
	return /^https?:\/\//.test(link.url) && bare(link.url) === bare(link.children[0].value) ? link.url : null;
};

const readCache = async (file: string | null): Promise<Cache> => {
	if (!file) return {};
	try {
		return JSON.parse(await readFile(file, 'utf8')) as Cache;
	} catch {
		return {};
	}
};

/**
 * Resolves link metadata. GitHub repository URLs use the GitHub API; other
 * URLs use the page's Open Graph tags. Results are cached on disk; a failed
 * fetch falls back to a stale entry, then to `null`.
 */
export const createResolver = (userOptions: LinkCardOptions = {}) => {
	const options = {
		fetch: globalThis.fetch,
		cacheFile: 'node_modules/.astro/link-cards.json',
		githubToken: process.env.GITHUB_TOKEN,
		now: Date.now,
		maxAgeMs: 7 * DAY,
		timeoutMs: 8000,
		...userOptions,
	};
	let cache: Promise<Cache> | undefined;
	let writes = Promise.resolve();
	const inFlight = new Map<string, Promise<LinkMeta | null>>();

	const persist = (store: Cache) => {
		const file = options.cacheFile;
		if (!file) return writes;
		writes = writes
			.then(() => mkdir(dirname(file), { recursive: true }))
			.then(() => writeFile(file, JSON.stringify(store, null, '\t')))
			.catch((error) => console.warn(`[link-card] cache write failed: ${(error as Error).message}`));
		return writes;
	};

	const lookup = async (url: string): Promise<LinkMeta | null> => {
		const store = await (cache ??= readCache(options.cacheFile));
		const hit = store[url];
		if (hit && options.now() - hit.fetchedAt < options.maxAgeMs) return hit.meta;
		try {
			const meta = await fetchMeta(url, options);
			store[url] = { fetchedAt: options.now(), meta };
			await persist(store);
			return meta;
		} catch (error) {
			console.warn(`[link-card] ${(error as Error).message}`);
			return hit?.meta ?? null;
		}
	};

	const resolve = (url: string) => {
		let pending = inFlight.get(url);
		if (!pending) {
			pending = lookup(url).finally(() => inFlight.delete(url));
			inFlight.set(url, pending);
		}
		return pending;
	};

	return resolve;
};

/**
 * Sätteri mdast plugin: a bare URL on its own line becomes a link card.
 * Inline links and URLs without metadata stay plain links.
 */
export const linkCard = (options: LinkCardOptions = {}) => {
	const resolve = createResolver(options);
	return {
		name: 'link-card',
		async paragraph(node: Readonly<Paragraph>, ctx: { replaceNode(node: Readonly<Paragraph>, content: { raw: string; mdxExpressions: false }): void }) {
			const url = standaloneUrl(node as Paragraph);
			if (!url) return;
			const meta = await resolve(url);
			if (meta) ctx.replaceNode(node, { raw: renderCard(meta), mdxExpressions: false });
		},
	};
};
