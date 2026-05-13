import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import katex from "katex";
import "katex/dist/contrib/mhchem.mjs"; // 加载 mhchem 扩展
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkMath from "remark-math";
import rehypeCallouts from "rehype-callouts";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig, siteConfig } from "./src/config";
import { i18n } from "./src/i18n/translation";
import I18nKey from "./src/i18n/i18nKey";
import { pluginLanguageBadge } from "expressive-code-language-badge"; /* Language Badge */
import { pluginCollapsible } from "expressive-code-collapsible"; /* Collapsible */
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { rehypeMermaid } from "./src/plugins/rehype-mermaid.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkMermaid } from "./src/plugins/remark-mermaid.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import mdx from "@astrojs/mdx";
import rehypeEmailProtection from "./src/plugins/rehype-email-protection.mjs";
import rehypeFigure from "./src/plugins/rehype-figure.mjs";
import rehypeTableWrapper from "./src/plugins/rehype-table-wrapper.mjs";
import rehypeExternalLinks from "./src/plugins/rehype-external-links.mjs";
import matter from "gray-matter";
import { glob } from "glob";
import * as fs from "node:fs";
import * as nodePath from "node:path";

// ===== Sitemap lastmod 映射构建 =====
const postsLastmodMap = new Map();
const hubsLastmodMap = new Map();

// 扫描文章，优先用 frontmatter.slug，否则用文件名作为 key
for (const f of await glob("**/*.{md,mdx}", { cwd: "./src/content/posts" })) {
	const { data } = matter(fs.readFileSync(nodePath.join("./src/content/posts", f), "utf-8"));
	// 优先使用 frontmatter.slug，若不存在则用文件名（去除扩展名）
	const slug = data.slug || nodePath.basename(f, nodePath.extname(f));
	if (slug) {
		postsLastmodMap.set(slug, data.updated || data.published);
	}
}

// 扫描 Hub，聚合关联文章的最新时间
for (const f of await glob("*.json", { cwd: "./src/content/hubs" })) {
	const hub = JSON.parse(fs.readFileSync(nodePath.join("./src/content/hubs", f), "utf-8"));
	const maxDate = (hub.spokes || []).reduce((max, s) => {
		if (!s.slug) return max;
		const d = postsLastmodMap.get(s.slug);
		if (d) {
			const dt = new Date(d);
			if (!max || dt > max) max = dt;
		}
		return max;
	}, null);
	if (maxDate) hubsLastmodMap.set(hub.slug, maxDate);
}

// https://astro.build/config
export default defineConfig({
	site: siteConfig.site_url,

	base: "/",
	trailingSlash: "always",
	integrations: [
		swup({
			theme: false,
			animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
			// the default value `transition-` cause transition delay
			// when the Tailwind class `transition-all` is used
			containers: [
				"#swup-container",
				"#right-sidebar-dynamic",
				"#floating-toc-wrapper",
			],
			smoothScrolling: false,
			cache: true,
			preload: {
					hover: true, // 仅在 hover 时预加载（不阻塞首屏）
					visible: false, // 不预加载可见链接
				},
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
			// 滚动相关配置优化
			resolveUrl: (url) => url,
			animateHistoryBrowsing: false,
			skipPopStateHandling: (event) => {
				// 跳过锚点链接的处理，让浏览器原生处理
				return event.state && event.state.url && event.state.url.includes("#");
			},
		}),
		icon({
			include: {
				"material-symbols": ["*"],
				"fa7-brands": ["*"],
				"fa7-regular": ["*"],
				"fa7-solid": ["*"],
				"simple-icons": ["*"], 
				mdi: ["*"],
			},
		}),
		expressiveCode({
			themes: [expressiveCodeConfig.darkTheme, expressiveCodeConfig.lightTheme],
			useDarkModeMediaQuery: false,
			themeCssSelector: (theme) => `[data-theme='${theme.name}']`,
			plugins: [
				pluginLanguageBadge(),
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				// pluginCollapsible 配置 - 从expressiveCodeConfig读取设置，使用i18n文本
				...(expressiveCodeConfig.pluginCollapsible?.enable === true
					? [
							pluginCollapsible({
								lineThreshold: expressiveCodeConfig.pluginCollapsible.lineThreshold || 15,
								previewLines: expressiveCodeConfig.pluginCollapsible.previewLines || 8,
								defaultCollapsed: expressiveCodeConfig.pluginCollapsible.defaultCollapsed ?? true,
								expandButtonText: i18n(I18nKey.codeCollapsibleShowMore),
								collapseButtonText: i18n(I18nKey.codeCollapsibleShowLess),
								expandedAnnouncement: i18n(I18nKey.codeCollapsibleExpanded),
								collapsedAnnouncement: i18n(I18nKey.codeCollapsibleCollapsed),
							}),
						]
					: []),
			],
			defaultProps: {
				wrap: false,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				borderRadius: "0.75rem",
				codeFontSize: "0.875rem",
				codeFontFamily:
					"'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				codeLineHeight: "1.5rem",
				frames: {},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
				languageBadge: {
					fontSize: "0.75rem",
					fontWeight: "bold",
					borderRadius: "0.25rem",
					opacity: "1",
					borderWidth: "0px",
					borderColor: "transparent",
				},
			},
			frames: {
				showCopyToClipboardButton: true,
			},
		}),
		svelte(),
		sitemap({
			filter: (page) => {
				// 根据页面开关配置过滤sitemap
				const url = new URL(page);
				const pathname = url.pathname;

				if (pathname === "/sponsor/" && !siteConfig.pages.sponsor) {
					return false;
				}
				if (pathname === "/guestbook/" && !siteConfig.pages.guestbook) {
					return false;
				}
				if (pathname === "/bangumi/" && !siteConfig.pages.bangumi) {
					return false;
				}
				if (pathname.startsWith("/hubs/") && !siteConfig.pages.hubs?.enabled) {
					return false;
				}

				return true;
			},
			serialize(item) {
				const p = new URL(item.url).pathname;

				// 首页
				if (p === "/") {
					item.priority = 1.0;
					item.changefreq = "daily";
				}

				// 文章页
				const postMatch = p.match(/^\/posts\/([^/]+)\/$/);
				if (postMatch) {
					item.priority = 0.7;
					item.changefreq = "monthly";
					const d = postsLastmodMap.get(postMatch[1]);
					if (d) item.lastmod = (d instanceof Date ? d : new Date(d)).toISOString().split("T")[0];
				}

				// Hub 子页（含分页）
				const hubMatch = p.match(/^\/hubs\/([^/]+)(\/\d+)?\/$/);
				if (hubMatch) {
					item.priority = hubMatch[2] ? 0.5 : 0.6;
					item.changefreq = "weekly";
					const d = hubsLastmodMap.get(hubMatch[1]);
					if (d) item.lastmod = d.toISOString().split("T")[0];
				}

				// Hub 索引页
				if (p === "/hubs/") {
					item.priority = 0.6;
					item.changefreq = "weekly";
				}

				// 归档页
				if (p === "/archive/") {
					item.priority = 0.5;
					item.changefreq = "weekly";
				}

				// 博客分页
				if (p.match(/^\/\d+\/$/)) {
					item.priority = 0.3;
					item.changefreq = "daily";
				}

				// 静态页（Firefly 实际页面，不含 gallery/privacy）
				if (["/about/", "/friends/", "/guestbook/", "/sponsor/", "/bangumi/", "/rss/", "/search/"].some(page => p.startsWith(page))) {
					item.priority = 0.5;
					item.changefreq = "yearly";
				}

				return item;
			},
		}),
		mdx(),
	],
	markdown: {
		remarkPlugins: [
			remarkMath,
			remarkReadingTime,
			remarkExcerpt,
			remarkDirective,
			remarkSectionize,
			parseDirectiveNode,
			remarkMermaid,
		],
		rehypePlugins: [
			[rehypeKatex, { katex }],
			[rehypeCallouts, { theme: siteConfig.rehypeCallouts.theme }],
			rehypeSlug,
			rehypeMermaid,
			rehypeFigure,
			[rehypeEmailProtection, { method: "base64" }], // 邮箱保护插件，支持 'base64' 或 'rot13'
			[
				rehypeComponents,
				{
					components: {
						github: GithubCardComponent,
					},
				},
			],
			[rehypeAutolinkHeadings,
				{
					behavior: "append",
					properties: {
						className: ["anchor"],
					},
					content: {
						type: "element",
						tagName: "span",
						properties: {
							className: ["anchor-icon"],
							"data-pagefind-ignore": true,
						},
						children: [
							{
								type: "text",
								value: "#",
							},
						],
					},
				},
			],
			// 外部链接处理：为外部链接添加 nofollow 和 target="_blank"（放在 rehypeComponents 之后以处理组件生成的链接）
			...(siteConfig.externalLinks?.enabled === true
				? [[rehypeExternalLinks, {
						siteUrl: siteConfig.site_url,
						rel: siteConfig.externalLinks.rel,
						target: siteConfig.externalLinks.target
					}]]
				: []),
			rehypeTableWrapper,
		],
	},
	vite: {
		plugins: [
			tailwindcss(),
		],
		resolve: {
			alias: {
				"@rehype-callouts-theme": `rehype-callouts/theme/${siteConfig.rehypeCallouts.theme}`,
			},
		},
		build: {
			// 启用资源压缩和优化
			minify: "terser",
			terserOptions: {
				compress: {
					drop_console: false, // 生产环境可改为true移除console
					drop_debugger: true,
				},
				mangle: true,
				format: {
					comments: false,
				},
			},
			rollupOptions: {
				onwarn(warning, warn) {
					// temporarily suppress this warning
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					warn(warning);
				},
			},
			// CSS 优化
			cssCodeSplit: true,
			cssMinify: true,
			// 资源大小限制 - 减少内联资源
			assetsInlineLimit: 4096,
			// 减少源映射大小（可选，生产环境改为false）
			sourcemap: false,
			// 并行处理构建
			workers: 4,
		},
	},
});
