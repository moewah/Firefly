// 字体配置
export const fontConfig = {
	// 是否启用自定义字体功能
	enable: true,
	// 是否预加载字体文件
	preload: true,
	// 当前选择的字体，支持多个字体组合
	selected: [
		"jetbrains-mono-nl",
		"lxgw-wenkai-mono-gb-screen",
		//"lxgw-wenkai-screen",
		"system",
	],

	// 字体列表
	fonts: {
		// 系统字体
		system: {
			id: "system",
			name: "系统字体",
			src: "", // 系统字体无需 src
			family:
				"system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		},

		// Google Fonts - Zen Maru Gothic
		"zen-maru-gothic": {
			id: "zen-maru-gothic",
			name: "Zen Maru Gothic",
			src: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700;900&display=swap",
			family: "Zen Maru Gothic",
			display: "swap" as const,
		},

		// Google Fonts - Inter
		inter: {
			id: "inter",
			name: "Inter",
			src: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
			family: "Inter",
			display: "swap" as const,
		},

		// JetBrains Mono NL
		"jetbrains-mono-nl": {
			id: "jetbrains-mono-nl",
			name: "JetBrains Mono NL",
			src: "https://unpkg.com/jetbrains-mono@1.0.6/css/jetbrains-mono-nl.css?family=JetBrains+Mono+NL:wght@300;400;500;700&display=swap",
			family: "JetBrains Mono NL",
			display: "swap" as const,
		},

		// LXGW WenKai Screen
		"lxgw-wenkai-screen": {
			id: "lxgw-wenkai-screen",
			name: "LXGW WenKai Screen",
			src: "https://unpkg.com/lxgw-wenkai-screen-webfont@1.7.0/lxgwwenkaigbscreen.css",
			family: "LXGW WenKai Screen",
			weight: 400,
			display: "swap" as const,
		},

		// LXGW WenKai Mono GB Screen
		"lxgw-wenkai-mono-gb-screen": {
			id: "lxgw-wenkai-mono-gb-screen",
			name: "LXGW WenKai Mono GB Screen",
			src: "https://unpkg.com/lxgw-wenkai-screen-web@1.521.0/lxgwwenkaimonogbscreen/result.css",
			family: "LXGW WenKai Mono GB Screen",
			weight: 400,
			display: "swap" as const,
		},
	},

	// 全局字体回退
	fallback: [
		"system-ui",
		"-apple-system",
		"BlinkMacSystemFont",
		"Segoe UI",
		"Roboto",
		"sans-serif",
	],
};
