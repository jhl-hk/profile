// @ts-check

import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { readBlogManifest } from './scripts/blog-manifest.ts';
import { codeFrameTransformer } from './src/lib/code-frame.ts';
import { linkCard } from './src/lib/link-card.ts';
import { includeInSitemap, sitemapAlternateMap } from './src/lib/sitemap.ts';

const site = 'https://jhl.idv.hk';
const blogManifest = await readBlogManifest(new URL('./src/content/blog', import.meta.url).pathname);
const sitemapAlternates = sitemapAlternateMap(blogManifest, site);

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [
		mdx(),
		sitemap({
			filter: includeInSitemap,
			serialize: (item) => ({ ...item, links: sitemapAlternates.get(item.url) }),
		}),
	],
	markdown: {
		processor: satteri({ mdastPlugins: [linkCard()] }),
		shikiConfig: {
			themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
			defaultColor: false,
			transformers: [codeFrameTransformer],
		},
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: 'JetBrains Mono',
			cssVariable: '--font-jetbrains-mono',
			fallbacks: ['monospace'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/jetbrains-mono-latin-400-normal.woff2'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/jetbrains-mono-latin-700-normal.woff2'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: 'Source Serif 4',
			cssVariable: '--font-source-serif',
			fallbacks: ['serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/source-serif-4-latin-wght-normal.woff2'],
						weight: '200 900',
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/source-serif-4-latin-wght-italic.woff2'],
						weight: '200 900',
						style: 'italic',
						display: 'swap',
					},
				],
			},
		},
	],
});
