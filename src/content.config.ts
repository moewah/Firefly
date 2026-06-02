import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postsCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		author: z.string().optional().default(""),
		sourceLink: z.string().optional().default(""),
		licenseName: z.string().optional().default(""),
		licenseUrl: z.string().optional().default(""),
		comment: z.boolean().optional().default(true),
		slug: z.string().optional(),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const hubsCollection = defineCollection({
	loader: glob({ pattern: "**/*.json", base: "./src/content/hubs" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		slug: z.string(),
		icon: z.string().optional(),
		keywords: z.array(z.string()).optional(),
		hero: z.object({
			headline: z.string().optional(),
			subheadline: z.string().optional(),
		}).optional(),
		spokes: z.array(z.object({
			slug: z.string(),
			custom_title: z.string().optional(),
			custom_description: z.string().optional(),
		})).optional(),
		auto_spokes: z.object({
			enabled: z.boolean().default(false),
			category: z.string().optional(),
			tags: z.array(z.string()).optional(),
			sort_by: z.enum(['published', 'updated', 'title']).optional().default('published'),
			order: z.enum(['asc', 'desc']).optional().default('desc'),
			limit: z.number().int().positive().optional(),
		}).optional(),
		config: z.object({
			show_reading_time: z.boolean().optional().default(true),
		}).optional().default({
			show_reading_time: true,
		}),
	}),
});

const specCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
	schema: z.object({}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
	hubs: hubsCollection,
};
