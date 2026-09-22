import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { blogContentId } from './lib/blog-routes';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}', generateId: blogContentId }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			lang: z.enum(['en', 'ja', 'zh']),
			translationKey: z.string().min(1).optional(),
			slug: z.string().min(1).optional(),
			topics: z.array(z.string().min(1)).default([]),
			featured: z.boolean().default(false),
			draft: z.boolean().default(false),
			sample: z.boolean().default(false),
		}),
});

export const collections = { blog };
