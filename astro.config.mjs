// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { readBlogManifest } from './scripts/blog-manifest.ts';
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
	],
});
