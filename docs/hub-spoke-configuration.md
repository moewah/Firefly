# Hub-Spoke 专题聚合配置

> 本文档说明博客 Hub 页面的 JSON 配置文件格式。
> 配置文件位于：`src/content/hubs/*.json`

---

## 配置文件结构概览

```json
{
  "title": "页面标题",
  "description": "页面描述",
  "slug": "路由路径",
  "icon": "图标标识",
  "keywords": ["关键词1", "关键词2"],
  "hero": { ... },
  "spokes": [ ... ],
  "auto_spokes": { ... },
  "config": { ... }
}
```

---

## 一、基础字段（必填）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✓ | Hub 页面标题，用于 SEO `<title>` 标签 |
| `description` | string | ✓ | Hub 页面描述，用于 SEO meta description |
| `slug` | string | ✓ | URL 路径标识，生成 `/hubs/{slug}/` 路由 |

**示例：**
```json
{
  "title": "AI Agent 开发指南",
  "description": "从架构设计到实战部署，构建可靠、可扩展的 AI Agent 系统",
  "slug": "ai-agents"
}
```

> ⚠️ `slug` 必须全局唯一，与文件名无关，仅用于 URL 路由。

---

## 二、可选基础字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `icon` | string | Hero 区域图标，使用 Iconify 图标名称（如 `material-symbols:category-search`），默认 `material-symbols:category-search` |
| `keywords` | string[] | 页面 SEO 关键词，传递给 `<meta name="keywords">` |

**示例：**
```json
{
  "icon": "material-symbols:deployed-code",
  "keywords": ["Docker", "容器", "self-hosted", "部署"]
}
```

---

## 三、Hero 区域配置（可选）

Hero 是页面顶部的标题展示区，包含大标题和副标题。

| 字段 | 类型 | 说明 |
|------|------|------|
| `hero.headline` | string | 大标题（若未设置，默认使用 `title`） |
| `hero.subheadline` | string | 副标题/补充说明 |

**示例：**
```json
{
  "hero": {
    "headline": "AI Agent 开发指南",
    "subheadline": "构建可靠、可扩展的智能体系统"
  }
}
```

---

## 四、Spokes 手动指定模式

手动指定要聚合的文章列表。**仅支持内部文章**，不支持外部链接。

### 4.1 内部文章（通过 slug 精确匹配）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `slug` | string | ✓ | 文章的 slug，**精确匹配**文章 frontmatter 中的 `slug` 字段或文件路径（不含扩展名） |
| `custom_title` | string | - | 自定义显示标题（覆盖原文章标题） |
| `custom_description` | string | - | 自定义显示描述（覆盖原文章描述） |

**示例：**
```json
{
  "spokes": [
    {
      "slug": "agent-skill-design-ten-principles"
    },
    {
      "slug": "hermes-agent-vs-openclaw-comparison",
      "custom_title": "Hermes Agent vs OpenClaw 对比分析",
      "custom_description": "两款主流 AI Agent 工具的功能差异与适用场景"
    }
  ]
}
```

> ⚠️ **匹配规则**：`slug` 必须与以下两者之一**精确匹配**：
> 1. 文章 frontmatter 中的 `slug` 字段（如 `slug: "533"`）
> 2. 文章文件路径（不含 `.md`/`.mdx` 扩展名，如 `OLD-ARTICLES/私有化部署/极简云盘...`）
>
> 不支持子串匹配、模糊匹配或忽略大小写匹配。如果 slug 填错，该 spoke 将被静默跳过。

---

## 五、Auto_Spokes 自动筛选模式

自动从博客文章库中筛选符合条件的文章，无需手动逐条指定。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | `false` | 是否启用自动筛选（必须设为 `true` 才生效） |
| `category` | string | - | 按分类筛选（匹配文章 `category` 字段） |
| `tags` | string[] | - | 按标签筛选（数组，匹配任意一个即可） |
| `sort_by` | string | `published` | 排序依据：`published` / `updated` / `title` |
| `order` | string | `desc` | 排序方向：`desc`（降序）或 `asc`（升序） |
| `limit` | number | - | 最大返回数量（不设置则返回全部） |

**示例 1：按分类自动聚合**
```json
{
  "auto_spokes": {
    "enabled": true,
    "category": "AI实验室",
    "sort_by": "published",
    "order": "desc",
    "limit": 10
  }
}
```

**示例 2：按标签自动聚合**
```json
{
  "auto_spokes": {
    "enabled": true,
    "tags": ["AI", "Agent", "LLM"],
    "sort_by": "updated",
    "order": "desc"
  }
}
```

> ⚠️ **注意**：`spokes` 和 `auto_spokes` 可同时使用，结果会合并去重。若两者都未配置，页面将只显示 Hero 区域。

---

## 六、Config 显示配置

控制 Hub 页面的额外展示选项。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show_reading_time` | boolean | `true` | 是否在 Hero 统计栏中显示"预计阅读 X 分钟" |

> ⚠️ **发布日期和标签始终显示**：Spoke 卡片（PostCard 组件）始终渲染发布日期和标签，不受 config 控制。

**示例：**
```json
{
  "config": {
    "show_reading_time": true
  }
}
```

---

## 七、完整配置示例

### 示例 1：纯手动指定

```json
{
  "title": "AI Agent 开发指南",
  "description": "从架构设计到实战部署，构建可靠、可扩展的 AI Agent 系统",
  "slug": "ai-agents",
  "icon": "material-symbols:smart-toy",
  "keywords": ["AI Agent", "智能体", "架构设计"],
  "hero": {
    "headline": "AI Agent 开发指南",
    "subheadline": "构建可靠、可扩展的智能体系统"
  },
  "spokes": [
    {
      "slug": "ai-first-architecture-harness-self-healing-pipeline"
    },
    {
      "slug": "agent-skill-design-ten-principles"
    },
    {
      "slug": "hermes-agent-vs-openclaw-comparison",
      "custom_title": "Hermes Agent vs OpenClaw 对比分析"
    }
  ],
  "config": {
    "show_reading_time": true
  }
}
```

### 示例 2：自动筛选

```json
{
  "title": "SEO 完整指南",
  "description": "系统掌握搜索引擎优化方法论",
  "slug": "seo-guide",
  "icon": "material-symbols:travel-explore",
  "hero": {
    "headline": "SEO 完整指南",
    "subheadline": "技术SEO、内容策略、外链建设全覆盖"
  },
  "auto_spokes": {
    "enabled": true,
    "tags": ["SEO", "Google", "搜索优化"],
    "sort_by": "published",
    "order": "desc",
    "limit": 15
  },
  "config": {
    "show_reading_time": true
  }
}
```

### 示例 3：混合模式（手动 + 自动）

```json
{
  "title": "博客搭建指南",
  "description": "从零开始搭建个人技术博客",
  "slug": "blog-setup",
  "icon": "material-symbols:web-stories",
  "hero": {
    "headline": "博客搭建完整指南",
    "subheadline": "Astro + MDX + Tailwind CSS 技术栈"
  },
  "spokes": [
    {
      "slug": "astro-blog-0-to-1-complete-guide",
      "custom_title": "Astro 博客从零到一"
    },
    {
      "slug": "astro-mdx-advanced-tips-blog-professional-upgrade"
    }
  ],
  "auto_spokes": {
    "enabled": true,
    "category": "技术教程",
    "tags": ["Astro", "博客"],
    "sort_by": "updated",
    "order": "desc",
    "limit": 5
  },
  "config": {
    "show_reading_time": true
  }
}
```

---

## 八、常见问题

### Q1：slug 匹配不到文章怎么办？

检查以下几点：
1. `slug` 是否与文章 frontmatter 中的 `slug` 字段完全一致（区分大小写）
2. 若文章没有 frontmatter `slug`，是否与文件路径（不含 `.md`/`.mdx`）完全一致
3. 文章是否在 `src/content/posts/` 目录下
4. 文章是否被标记为 `draft: true`（生产环境不显示草稿）

### Q2：如何区分内部文章和外部链接？

**Hub 仅支持内部文章**（通过 `slug` 匹配）。不支持外部链接。

### Q3：auto_spokes 筛选逻辑是什么？

筛选条件叠加关系：
- `category` AND `tags`（同时满足）
- `tags` 数组内部为 OR 关系（任意一个标签匹配即可）

### Q4：为什么 Hub 页面的布局不由 config 控制？

Hub 页面使用全局的 `siteConfig.postListLayout` 控制布局（列表/网格/瀑布流），所有 Hub 页面共用同一套布局配置。这是为了保持全站布局一致性。

### Q5：spokes 和 auto_spokes 合并后如何排序？

合并后的最终排序规则为：
1. **置顶文章优先**：`pinned: true` 的文章排在最前面（按 `updated` 日期降序）
2. **其余按发布日期降序**：非置顶文章按 `published` 日期从新到旧排列

`auto_spokes` 内部的 `sort_by`/`order` 仅影响自动筛选阶段的临时排序，最终合并后的全局排序仍遵循上述规则。

---

## 九、文件位置与命名规范

| 项目 | 说明 |
|------|------|
| 配置目录 | `src/content/hubs/` |
| 文件格式 | JSON（`.json`） |
| 文件命名 | 建议与 `slug` 字段一致，如 `ai-agents.json` |
| 生成路径 | `/hubs/{slug}/`（如 `/hubs/ai-agents/`） |

---

## 附录：字段支持状态总览

| 字段 | Schema | 代码使用 | 状态 |
|------|--------|----------|------|
| `title` | ✓ | ✓ | ✅ 支持 |
| `description` | ✓ | ✓ | ✅ 支持 |
| `slug` | ✓ | ✓ | ✅ 支持 |
| `icon` | ✓ | ✓ | ✅ 支持 |
| `keywords` | ✓ | ✓ | ✅ 支持 |
| `hero.headline` | ✓ | ✓ | ✅ 支持 |
| `hero.subheadline` | ✓ | ✓ | ✅ 支持 |
| `spokes[].slug` | ✓ | ✓ | ✅ 支持（必填） |
| `spokes[].custom_title` | ✓ | ✓ | ✅ 支持 |
| `spokes[].custom_description` | ✓ | ✓ | ✅ 支持 |
| `auto_spokes.*` | ✓ | ✓ | ✅ 支持 |
| `config.show_reading_time` | ✓ | ✓ | ✅ 支持 |

---

*文档版本：v3.0 | 更新日期：2026-06-02*
