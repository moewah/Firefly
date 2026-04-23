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

> ⚠️ `slug` 必须与文件名一致（不含 `.json` 扩展名）

---

## 二、Hero 区域配置（可选）

Hero 是页面顶部的标题展示区，包含大标题和副标题。

| 字段 | 类型 | 说明 |
|------|------|------|
| `hero.headline` | string | 大标题（若未设置，默认使用 `title`） |
| `hero.subheadline` | string | 副标题/补充说明 |
| `hero.cover_image` | string | Hero 背景图片路径（相对或绝对路径） |

**示例：**
```json
{
  "hero": {
    "headline": "AI Agent 开发指南",
    "subheadline": "构建可靠、可扩展的智能体系统",
    "cover_image": "/images/ai-agents-cover.jpg"
  }
}
```

---

## 三、Spokes 手动指定模式

手动指定要聚合的文章列表，支持 **内部文章** 和 **外部链接** 两种类型。

### 3.1 内部文章（通过 slug 匹配）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `slug` | string | ✓ | 文章的 slug（匹配 `posts/` 目录下的文件） |
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

> 💡 `slug` 匹配规则：精确匹配 → 模糊匹配（包含关系）→ 忽略大小写匹配

### 3.2 外部链接（非博客文章）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✓ | 链接标题 |
| `url` | string | ✓ | 链接地址（完整 URL） |
| `description` | string | - | 链接描述 |
| `is_external` | boolean | - | 是否标记为外部链接（默认 `true`，可省略） |

**示例：**
```json
{
  "spokes": [
    {
      "title": "Anthropic Agent 研究论文",
      "url": "https://anthropic.com/research/agents",
      "description": "Anthropic 官方发布的 Agent 架构研究"
    },
    {
      "title": "LangChain 官方文档",
      "url": "https://python.langchain.com/docs/",
      "description": "LangChain 框架完整使用指南"
    }
  ]
}
```

---

## 四、Auto_Spokes 自动筛选模式

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

> ⚠️ **注意**：`spokes` 和 `auto_spokes` 可同时使用，结果会合并显示。若两者都未配置，页面将只显示 Hero 区域。

---

## 五、Config 显示配置

控制 Spoke 卡片的展示样式和信息。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show_publish_date` | boolean | `true` | 是否显示发布日期 |
| `show_reading_time` | boolean | `true` | 是否显示预估阅读时长 |
| `show_tags` | boolean | `true` | 是否显示文章标签 |
| `external_link_icon` | boolean | `true` | 外部链接是否显示图标标识 |
| `grid_layout` | boolean | `false` | 是否使用网格布局（`false` = 列表布局） |

**示例：网格布局**
```json
{
  "config": {
    "show_publish_date": true,
    "show_reading_time": true,
    "show_tags": true,
    "grid_layout": true
  }
}
```

**示例：列表布局（精简信息）**
```json
{
  "config": {
    "show_publish_date": false,
    "show_reading_time": false,
    "show_tags": false,
    "grid_layout": false
  }
}
```

---

## 六、完整配置示例

### 示例 1：纯手动指定（网格布局）

```json
{
  "title": "AI Agent 开发指南",
  "description": "从架构设计到实战部署，构建可靠、可扩展的 AI Agent 系统",
  "slug": "ai-agents",
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
    },
    {
      "slug": "long-context-safety-guardrails",
      "custom_title": "长上下文模型的安全边界"
    },
    {
      "title": "LangChain 官方文档",
      "url": "https://python.langchain.com/docs/",
      "description": "LangChain 框架完整使用指南"
    }
  ],
  "config": {
    "show_publish_date": true,
    "show_reading_time": true,
    "show_tags": true,
    "grid_layout": true
  }
}
```

### 示例 2：自动筛选（列表布局）

```json
{
  "title": "SEO 完整指南",
  "description": "系统掌握搜索引擎优化方法论",
  "slug": "seo-guide",
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
    "show_publish_date": true,
    "show_reading_time": true,
    "show_tags": true,
    "grid_layout": false
  }
}
```

### 示例 3：混合模式（手动 + 自动）

```json
{
  "title": "博客搭建指南",
  "description": "从零开始搭建个人技术博客",
  "slug": "blog-setup",
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
    "show_publish_date": true,
    "show_reading_time": false,
    "show_tags": true,
    "grid_layout": true
  }
}
```

---

## 七、常见问题

### Q1：slug 匹配不到文章怎么办？

检查以下几点：
1. `slug` 是否与文章文件名一致（不含 `.md` / `.mdx`）
2. 文章是否在 `src/content/posts/` 目录下
3. 文章 frontmatter 是否有 `slug` 字段（若存在，需匹配该字段而非文件名）

### Q2：如何区分内部文章和外部链接？

| 类型 | 必填字段 | 标识 |
|------|----------|------|
| 内部文章 | `slug` | 自动解析文章数据 |
| 外部链接 | `title` + `url` | 显示外部链接图标 |

> 不能同时使用 `slug` 和 `url`，两者互斥。

### Q3：auto_spokes 筛选逻辑是什么？

筛选条件叠加关系：
- `category` AND `tags`（同时满足）
- `tags` 数组内部为 OR 关系（任意一个标签匹配即可）

---

## 八、文件位置与命名规范

| 项目 | 说明 |
|------|------|
| 配置目录 | `src/content/hubs/` |
| 文件格式 | JSON（`.json`） |
| 文件命名 | 与 `slug` 字段一致，如 `ai-agents.json` |
| 生成路径 | `/hubs/{slug}/`（如 `/hubs/ai-agents/`） |

---

*文档版本：v1.0 | 更新日期：2026-04-23*