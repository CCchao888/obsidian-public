# Horizon — AI 每日新闻雷达搭建教程

## 一、Horizon 是什么

Horizon 是一个开源的 **AI 信息聚合系统**，用大模型帮你自动筛选、评分、总结每日新闻，生成中英双语 Markdown 简报。你可以把它理解为一个 **"AI 编辑"** ——每天从海量信息中捞出你真正关心的内容。

### 工作原理（7 步流水线）

```
抓取 → 去重 → AI 评分 → 背景补充 → 评论摘要 → 简报生成 → 多渠道分发
```

1. **抓取** — 从 7 大类信源并发拉取最新内容
2. **去重** — 自动合并跨平台相同故事 + AI 语义去重
3. **AI 评分** — 大模型对每条内容打 0–10 分，过滤低分内容
4. **背景补充** — 为陌生概念检索网页背景知识
5. **评论摘要** — 收集并提炼社区讨论精华
6. **简报生成** — 生成结构化 Markdown 简报
7. **分发** — 输出到本地 / GitHub Pages / 邮件 / Webhook

### 支持的信源

| 信源 | 样例 |
|------|------|
| Hacker News | 高分热门技术讨论 |
| Reddit | r/MachineLearning, r/LocalLLaMA 等 |
| RSS/Atom | 量子位、新智元、GitHub Trending 等 |
| GitHub | 用户动态、Repo 版本发布 |
| Twitter/X | KOL 推文 |
| OpenBB | 金融公司新闻 |
| OSS Insight | GitHub 趋势仓库 |

### 支持的 AI 模型

Claude / GPT / Gemini / DeepSeek / 豆包 / MiniMax / Ollama 等任意 OpenAI 兼容 API。

---

## 二、项目地址

- GitHub：[Thysrael/Horizon](https://github.com/Thysrael/Horizon)
- Stars：5.9K+
- 许可证：MIT

---

## 三、本机部署信息

| 项目 | 路径 |
|------|------|
| 项目根目录 | `D:\backup\Horizon\` |
| 配置文件 | `D:\backup\Horizon\data\config.json` |
| 环境变量 | `D:\backup\Horizon\.env` |
| **简报输出** | `D:\backup\obsidian\obsidian-public\News-Radar\` |
| 运行脚本 | `D:\backup\Horizon\run.ps1` (PowerShell) / `run.bat` (双击) |
| 定时脚本 | `D:\backup\Horizon\scripts\daily-run.bat` |
| 定时安装 | `D:\backup\Horizon\scripts\setup-scheduler.ps1` |

> **注意**：简报直接输出到 Obsidian Vault 的 `News-Radar/` 文件夹，这是通过修改 `src/storage/manager.py` + `.env` 中 `HORIZON_OUTPUT_DIR` 实现的定制功能。

---

## 四、配置全地图

### 4.1 `.env` — 密钥与路径（敏感信息）

```
D:\backup\Horizon\.env
```

```ini
# === 必填：AI 模型 API Key ===
DEEPSEEK_API_KEY=sk-xxx

# === 输出目录：简报直接写入 Obsidian Vault ===
HORIZON_OUTPUT_DIR=D:\backup\obsidian\obsidian-public\News-Radar

# === 可选：GitHub Token（解决 API 限流）===
GITHUB_TOKEN=ghp_xxx

# === 可选：代理（国内访问 Reddit/GitHub 等）===
# HTTPS_PROXY=http://127.0.0.1:7890
# HTTP_PROXY=http://127.0.0.1:7890
```

| 变量 | 必填 | 说明 |
|------|:--:|------|
| `DEEPSEEK_API_KEY` | ✅ | AI 模型的 API Key |
| `HORIZON_OUTPUT_DIR` | ✅ | 简报输出到哪个目录 |
| `GITHUB_TOKEN` | 推荐 | 无则 GitHub 源限流 60次/小时，有则 5000次/小时 |
| `HTTPS_PROXY` | 按需 | 国内访问 Reddit 等被墙服务需要代理 |

### 4.2 `config.json` → `ai` — 模型参数

```json
"ai": {
  "provider": "deepseek",        // 模型厂商
  "model": "deepseek-chat",      // 具体模型名
  "temperature": 0.3,            // 创造性 (0-1)，越低越稳定
  "max_tokens": 4096,            // 单次最大输出
  "analysis_concurrency": 3,     // 分析并发数，免费 API 建议 1
  "enrichment_concurrency": 2,   // 背景补充并发数
  "languages": ["zh", "en"]      // 生成语言，["zh"] 只要中文
}
```

#### 切换 AI 模型

| 厂商 | provider | model 示例 |
|------|----------|-----------|
| DeepSeek | `deepseek` | `deepseek-chat` |
| OpenAI | `openai` | `gpt-4o` |
| Anthropic | `anthropic` | `claude-sonnet-4-6` |
| 阿里 | `ali` | `qwen-plus` |
| 豆包 | `doubao` | `doubao-pro-32k` |
| 本地 | `ollama` | `llama3.1` |

> 换成其他厂商时，记得同时改 `.env` 里对应的 API Key 环境变量名，并在 `config.json` 的 `ai.api_key_env` 里对应修改。

  ### 4.3 `config.json` → `sources` — 信息源

```json
"sources": {
  "hackernews": {
    "enabled": true,              // 开关
    "fetch_top_stories": 30,      // 抓取条数
    "min_score": 100              // 最低热度分
  },
  "rss": [
    {
      "name": "量子位",
      "url": "https://wechat2rss.xlab.app/feed/...",
      "enabled": true,            // 设为 false 关闭
      "category": "ai-news"      // 分类标签
    }
  ],
  "reddit": {
    "enabled": true,
    "subreddits": [
      {
        "subreddit": "MachineLearning",
        "enabled": true,
        "sort": "hot",           // hot / new / top / rising
        "time_filter": "day",
        "fetch_limit": 15,
        "min_score": 50           // 最低点赞数
      }
    ],
    "fetch_comments": 5           // 每个帖子抓几条评论
  },
  "github": [
    {
      "type": "user_events",      // 用户 Star 动态
      "username": "karpathy",
      "enabled": true
    },
    {
      "type": "repo_releases",    // 仓库版本发布
      "owner": "vllm-project",
      "repo": "vllm",
      "enabled": true
    }
  ],
  "ossinsight": {
    "enabled": true,
    "period": "past_24_hours",
    "languages": ["All", "Python", "TypeScript"],
    "keywords": ["ai", "llm", "agent"],   // 关键词过滤
    "min_stars": 10,
    "max_items": 30
  },
  "twitter": {
    "enabled": false,              // 需 Apify Token 或 Playwright
    "users": ["karpathy", "ylecun"],
    "fetch_limit": 10
  },
  "openbb": {
    "enabled": false,              // 需额外安装 openbb 包
    "watchlists": [
      {
        "name": "科技七巨头",
        "symbols": ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA"],
        "provider": "yfinance"
      }
    ]
  }
}
```

### 4.4 `config.json` → `filtering` — 筛选规则

```json
"filtering": {
  "ai_score_threshold": 6.0,    // AI 评分底线 (0-10)，越高简报越短越精
  "time_window_hours": 24,      // 只抓最近 N 小时
  "max_items": 35               // 最终简报最多几条
}
```

| 参数 | 建议值 | 效果 |
|------|--------|------|
| `ai_score_threshold` | `6.0` | 宽松，内容较多 |
| | `7.0` | 适中 |
| | `8.0` | 严格，只要高质量 |
| `max_items` | `20` | 快速浏览 |
| | `35` | 全面覆盖 |
| | `50` | 信息过载 |

---

## 五、日常使用

### 手动运行

```powershell
# PowerShell 中
cd D:\backup\Horizon

# 方式一：直接命令
uv run horizon

# 方式二：封装脚本（有友好提示）
.\run.ps1
```

### 自动定时运行

以管理员身份打开 PowerShell，执行一次即可：

```powershell
powershell -ExecutionPolicy Bypass -File "D:\backup\Horizon\scripts\setup-scheduler.ps1"
```

默认每天早上 **08:00** 自动运行。修改运行时间：

1. `Win + R` → `taskschd.msc`
2. 找到 `Horizon-Daily-News-Radar`
3. 右键 → 属性 → 触发器 → 编辑

> **注意**：定时任务依赖本机开机+有网。关机期间会错过，已在脚本中启用 `StartWhenAvailable`（开机会补跑一次）。

### 在 Obsidian 中查看

简报直接生成在 Vault 的 `News-Radar/` 文件夹：

```
News-Radar/
├── horizon-2026-06-21-zh.md    # 中文日报
├── horizon-2026-06-21-en.md    # 英文日报
├── horizon-2026-06-22-zh.md
└── ...
```

---

## 六、常见调整

| 需求 | 操作 |
|------|------|
| 只用中文 | `config.json` → `ai.languages` 改为 `["zh"]` |
| 结果太少 | 降低 `filtering.ai_score_threshold` 到 `5.0` |
| 结果太多/质量低 | 提高 `filtering.ai_score_threshold` 到 `7.5` |
| 关闭某个信源 | 对应节点的 `enabled` 改为 `false` |
| 添加 RSS 源 | 在 `sources.rss` 数组新增一条 |
| 更换 AI 模型 | 改 `ai.provider` + `ai.model`，更新 `.env` 中对应 Key |
| 更换输出目录 | 改 `.env` 中 `HORIZON_OUTPUT_DIR` |
| 换定时时间 | `taskschd.msc` → 编辑触发器，或改 `setup-scheduler.ps1` 中的 `$StartTime` |
| 解决 Reddit 被墙 | `.env` 中设置 `HTTPS_PROXY` |

---

## 七、定制修改记录

本项目对原版 Horizon 做了以下定制：

| 修改 | 文件 | 说明 |
|------|------|------|
| 自定义输出目录 | `src/storage/manager.py` | 支持 `HORIZON_OUTPUT_DIR` 环境变量，简报直接写入 Obsidian Vault |
| 优化信源配置 | `data/config.json` | 聚焦 AI/科技/金融，移除失效 RSS 源 |
| 运行时脚本 | `run.ps1` / `run.bat` | 一键运行，友好提示 |
| 定时任务 | `scripts/daily-run.bat` | 使用 `.venv` Python 运行，不依赖系统 PATH |

---

## 八、故障排查

| 现象 | 原因 | 解决 |
|------|------|------|
| `Missing API key` | `.env` 中 Key 未填 | 编辑 `.env` 填入正确的 API Key |
| `403 rate limit exceeded` (GitHub) | 未配置 GitHub Token | 在 `.env` 中设置 `GITHUB_TOKEN` |
| Reddit 全部失败 | 国内网络封锁 | 在 `.env` 中设置 `HTTPS_PROXY` |
| RSS 源返回 404 | Feed URL 已失效 | 在 `config.json` 中禁用该源 |
| `openbb package is not installed` | 未安装可选依赖 | 禁用 OpenBB 源或执行 `uv pip install openbb` |
| 定时任务没跑 | 电脑当时关机/休眠 | 开机后会补跑一次（已启用 StartWhenAvailable） |

---

## 九、成本估算

| 项目 | 费用 |
|------|------|
| DeepSeek API | 约 ¥0.5–2/天（取决于抓取量） |
| GitHub Token | 免费 |
| 其他 | 免费 |

以每天处理约 50 条内容、生成双语简报计算，每月成本约 ¥15–60。

---

## 十、用 Claude Code 搭建全过程

本项目的环境搭建、配置调优、代码修改均由 **Claude Code** 在对话中完成，没有手动写一行配置。以下是实际操作过程，可作为用 AI 搭建开发环境的参考。

### 10.1 对话流程

```
提问 Horizon 是什么
    ↓
Claude Code 搜索 GitHub、技术文章，确认项目存在
    ↓
"直接帮我搭建"
    ↓
自动检查环境 → 发现缺少 uv → 自动安装
    ↓
克隆仓库 → uv sync 安装 153 个依赖
    ↓
询问偏好（AI模型 / 信息源 / 输出目录）
    ↓
生成 config.json → 验证通过
    ↓
首次运行 → 报错排查 → 逐个修复
    ↓
定制代码（直接输出 Obsidian）→ 生成教程文档
```

### 10.2 Claude Code 具体做了什么

| 步骤 | 自动化操作 |
|------|-----------|
| 环境检查 | 检测 Python/git/uv 是否安装，缺什么装什么 |
| 文件探查 | 读取 Obsidian Vault 结构，确认输出位置 |
| 项目搭建 | `git clone` + `uv sync` 一键完成 |
| 配置生成 | 根据偏好（AI/科技/金融）自动生成 `config.json` |
| 验证 | 跑 Pydantic 校验确认配置文件合法 |
| 调试 | 首次运行报错后，逐个分析日志并修复 |
| 代码修改 | 在 `src/storage/manager.py` 加 3 行，支持直接输出到 Obsidian |
| 脚本编写 | 生成 `run.ps1` / `daily-run.bat` / `setup-scheduler.ps1` |
| 文档生成 | 输出本教程到 Obsidian Vault |

### 10.3 关键对话

**第一步：了解项目**
```
Q: 你知道 Horizon AI 吗，是不是可以通过它搭建每日新闻雷达，记录到 Obsidian？
A: [搜索项目信息，确认可行，给出方案]
```

**第二步：直接搭建**
```
Q: 直接帮我搭建
A: [检查环境 → 安装 uv → 克隆仓库 → 安装依赖]
   [询问：输出到哪个 Vault？关注哪些领域？AI 模型偏好？]
```

**第三步：运行调试**
```
Q: 设置 API Key 之后手动运行 [贴日志]
A: [诊断 5 个问题：API Key / Reddit 被墙 / GitHub 限流 / RSS 失效 / OpenBB 未安装]
   [逐个修复配置]
```

**第四步：优化体验**
```
Q: 输出的文档不能直接到 Obsidian 吗，为什么要多一步？
A: 你说得对 → 修改 StorageManager 源码，加 HORIZON_OUTPUT_DIR 支持
   → 去掉复制步骤，现在 uv run horizon 直接写入 Obsidian
```

### 10.4 用 Claude Code 搭项目的技巧

**1. 先问再搭**
不用急于动手，先让 Claude Code 搜索确认项目是否靠谱、是否匹配需求。

**2. 直接说"帮我搭建"**
Claude Code 会自动探测环境、安装依赖、生成配置。不需要你手动操作。

**3. 把报错日志贴回来**
首次运行大概率有坑，把完整日志贴给 Claude Code，它会逐个诊断和修复。

**4. 觉得不合理就说**
多一步复制？直接提出来，Claude Code 会改源码来适配你的需求。

**5. 最后让它生成教程**
搭建完成后让 Claude Code 生成一份配置文档，存到 Obsidian 里，以后需要调整时直接翻出来看。

### 10.5 你的本机环境信息

| 项目 | 值 |
|------|-----|
| OS | Windows 11 Home China 10.0.26200 |
| Python | 3.13.2 (D:\envs\python\python.exe) |
| Git | 2.48.1 |
| uv | 0.11.23 (pip 安装) |
| Horizon | 0.1.0 (Thysrael/Horizon 最新版) |
| Obsidian Vault | D:\backup\obsidian\obsidian-public\ |
| 设置日期 | 2026-06-22
