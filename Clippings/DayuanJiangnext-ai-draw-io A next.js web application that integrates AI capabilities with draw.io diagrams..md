---
title: "DayuanJiang/next-ai-draw-io: A next.js web application that integrates AI capabilities with draw.io diagrams. This app allows you to create, modify, and enhance diagrams through natural language commands and AI-assisted visualization."
source: "https://github.com/DayuanJiang/next-ai-draw-io"
author:
  - "[[DayuanJiang]]"
published:
created: 2026-07-23
description: "A next.js web application that integrates AI capabilities with draw.io diagrams. This app allows you to create, modify, and enhance diagrams through natural language commands and AI-assisted visualization. - DayuanJiang/next-ai-draw-io"
tags:
  - "clippings"
---
## Next AI Draw.io

**AI-Powered Diagram Creation Tool - Chat, Draw, Visualize**

English | [中文](https://github.com/DayuanJiang/next-ai-draw-io/blob/main/docs/cn/README_CN.md) | [日本語](https://github.com/DayuanJiang/next-ai-draw-io/blob/main/docs/ja/README_JA.md)

[![TrendShift](https://camo.githubusercontent.com/ec4b3309820c4b14f597ea030e9862302565220813e8a60e181505117468e6e7/68747470733a2f2f7472656e6473686966742e696f2f6170692f62616467652f7265706f7369746f726965732f3135343439)](https://next-ai-drawio.jiang.jp/)

[![Live Demo](https://github.com/DayuanJiang/next-ai-draw-io/raw/main/public/live-demo-button.svg)](https://next-ai-drawio.jiang.jp/)

A Next.js web application that integrates AI capabilities with draw.io diagrams. Create, modify, and enhance diagrams through natural language commands and AI-assisted visualization.

> Note: Thanks to [ByteDance Doubao](https://www.volcengine.com/activity/codingplan?ac=MMAP8JTTCAQ2&rc=Z9Z3LDTJ&utm_campaign=drawio&utm_content=drawio&utm_medium=devrel&utm_source=OWO&utm_term=drawio) sponsorship, the demo site now uses the powerful glm-4.7 model!

20251211\_drawio.mp4<video src="https://private-user-images.githubusercontent.com/34411969/525172622-9d60a3e8-4a1c-4b5e-acbb-26af2d3eabd1.mp4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODQ3Mzc3ODAsIm5iZiI6MTc4NDczNzQ4MCwicGF0aCI6Ii8zNDQxMTk2OS81MjUxNzI2MjItOWQ2MGEzZTgtNGExYy00YjVlLWFjYmItMjZhZjJkM2VhYmQxLm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA3MjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNzIyVDE2MjQ0MFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTg4ZDk1MjllN2M4ZmZmZmFjODVjZjIxMTRlYTIyM2QxMzM1NjU5YjA5MzdkZDFjYWZkOTJmNzcxNGY4ZWVlMjQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT12aWRlbyUyRm1wNCJ9.1TCWgUUkxq-FtcAPi_xQmd7gv-1wCjjDL3NKwMJqDtw" controls="controls"></video>

## Table of Contents 目录

## Examples 例子

Here are some example prompts and their generated diagrams:  
以下是一些示例提示及其对应的图表生成结果：

<table width="100%"><tbody><tr><td colspan="2" align="center"><strong>Animated transformer connectors<font><br><font><font>动画化的变形金刚连接器</font></font></font></strong><br><p><strong>Prompt:</strong> Give me a **animated connector** diagram of transformer's architecture.<font><br><font><font>请给我一个关于变压器架构的**动画式连接器**示意图。</font></font></font></p><a href="https://github.com/DayuanJiang/next-ai-draw-io/blob/main/public/animated_connectors.svg"><img src="https://github.com/DayuanJiang/next-ai-draw-io/raw/main/public/animated_connectors.svg" width="480" height="431.25"></a></td></tr><tr><td width="50%"><strong>RAG Technique Diagram <font><font><font>RAG 技术示意图</font></font></font></strong><br><p><strong>Prompt:</strong> Generate a RAG architecture diagram for **chat application**. Use connected diagram for data ingestion<font><br><font><font>提示：为**聊天应用**生成一个 RAG 架构图。使用连接式图表来展示数据导入的过程。</font></font></font></p><a href="https://github.com/DayuanJiang/next-ai-draw-io/blob/main/public/rag_prod.svg"><img src="https://github.com/DayuanJiang/next-ai-draw-io/raw/main/public/rag_prod.svg" width="391.5" height="278.3125"></a></td><td width="50%"><strong>Authentication using React and AWS<font><br><font><font>使用 React 和 AWS 进行身份验证</font></font></font></strong><br><p><strong>Prompt:</strong> Generate authentication process using React with **AWS**. Use Serverless architecture.<font><br><font><font>提示：使用 React 框架实现身份验证流程，并集成**AWS**服务。采用无服务器架构来实现系统运行。</font></font></font></p><a href="https://github.com/DayuanJiang/next-ai-draw-io/blob/main/public/auth.svg"><img src="https://github.com/DayuanJiang/next-ai-draw-io/raw/main/public/auth.svg" width="391.5" height="229.359375"></a></td></tr><tr><td width="50%"><strong>Open Innovation <font><font><font>开放式创新</font></font></font></strong><br><p><strong>Prompt:</strong> Create visualization of Henry Chesbrough's Open Innovation model.<font><br><font><font>提示：请创建亨利·切斯布罗的开放创新模型的可视化展示。</font></font></font></p><a href="https://github.com/DayuanJiang/next-ai-draw-io/blob/main/public/inno.svg"><img src="https://github.com/DayuanJiang/next-ai-draw-io/raw/main/public/inno.svg" width="391.5" height="363.5625"></a></td><td width="50%"><strong>Cat sketch <font><font><font>猫的素描</font></font></font></strong><br><p><strong>Prompt:</strong> Draw a cute cat for me.<font><br><font><font>提示：请为我画一只可爱的猫吧。</font></font></font></p><a href="https://github.com/DayuanJiang/next-ai-draw-io/blob/main/public/cat_demo.svg"><img src="https://github.com/DayuanJiang/next-ai-draw-io/raw/main/public/cat_demo.svg" width="240" height="376.234375"></a></td></tr></tbody></table>

## Features 特点

- **LLM-Powered Diagram Creation**: Leverage Large Language Models to create and manipulate draw.io diagrams directly through natural language commands  
	基于大型语言模型的图表创作：利用大型语言模型，通过自然语言指令直接创建和编辑 draw.io 图表。
- **Image-Based Diagram Replication**: Upload existing diagrams or images and have the AI replicate and enhance them automatically  
	基于图像的图表复制：只需上传现有的图表或图片，AI 就能自动对其进行复制和增强处理。
- **PDF & Text File Upload**: Upload PDF documents and text files to extract content and generate diagrams from existing documents  
	上传 PDF 文档和文本文件：可以上传 PDF 文档和文本文件，以便提取其中的内容并生成相关图表。
- **AI Reasoning Display**: View the AI's thinking process for supported models (OpenAI o1/o3, Gemini, Claude, etc.)  
	AI 推理展示：查看支持型号的 AI 思考过程（如 OpenAI 的 o1/o3、Gemini、Claude 等）
- **Diagram History**: Comprehensive version control that tracks all changes, allowing you to view and restore previous versions of your diagrams before the AI editing.  
	图表历史：全面的版本控制功能，能够追踪所有修改记录。你可以在此基础上查看和恢复图表之前的版本，以便在人工智能编辑之前进行编辑操作。
- **Interactive Chat Interface**: Communicate with AI to refine your diagrams in real-time  
	互动聊天界面：与人工智能进行交流，实时完善你的图表设计
- **Cloud Architecture Diagram Support**: Specialized support for generating cloud architecture diagrams (AWS, GCP, Azure)  
	云架构图支持：专门提供生成云架构图的功能，涵盖 AWS、GCP 和 Azure 等平台。
- **Animated Connectors**: Create dynamic and animated connectors between diagram elements for better visualization  
	动画连接符：在图表元素之间创建动态且富有动画效果的连接关系，从而提升图表的可视化效果。

## MCP Server MCP 服务器

Use Next AI Draw.io with AI agents like Claude Desktop, Cursor, and VS Code via MCP (Model Context Protocol).  
使用 Next AI Draw.io，通过 MCP（模型上下文协议）与 Claude Desktop、Cursor 以及 VS Code 等 AI 代理进行协作。

```
{
  "mcpServers": {
    "drawio": {
      "command": "npx",
      "args": ["@next-ai-drawio/mcp-server@latest"]
    }
  }
}
```

### Claude Code CLI 克劳德法典 CLI

```
claude mcp add drawio -- npx @next-ai-drawio/mcp-server@latest
```

Then ask Claude to create diagrams:  
然后请克劳德来绘制图表：

> "Create a flowchart showing user authentication with login, MFA, and session management"  
> 请创建一个流程图，展示包括登录、多因素认证以及会话管理在内的用户身份验证过程。

The diagram appears in your browser in real-time!  
该图表能够实时显示在您的浏览器中！

See the [MCP Server README](https://github.com/DayuanJiang/next-ai-draw-io/blob/main/packages/mcp-server/README.md) for VS Code, Cursor, and other client configurations.  
有关 VS Code、光标以及其他客户端配置的详细信息，请参阅 MCP 服务器的 README 文件。

## Getting Started 开始吧

### Try it Online 在线尝试一下吧。

No installation needed! Try the app directly on our demo site:  
无需安装即可使用！可以直接在我们的演示网站上尝试该应用程序：

[![Live Demo](https://github.com/DayuanJiang/next-ai-draw-io/raw/main/public/live-demo-button.svg)](https://next-ai-drawio.jiang.jp/)

> **Bring Your Own API Key**: You can use your own API key to bypass usage limits on the demo site. Click the Settings icon in the chat panel to configure your provider and API key. Your key is stored locally in your browser and is never stored on the server.  
> 使用自己的 API 密钥：你可以使用自己的 API 密钥来绕过演示网站的使用限制。在聊天面板中点击“设置”图标，即可配置你的提供商信息和 API 密钥。你的密钥存储在本地浏览器中，不会保存在服务器上。

### Desktop Application 桌面应用程序

Download the native desktop app for your platform from the [Releases page](https://github.com/DayuanJiang/next-ai-draw-io/releases):  
从发布页面下载适用于您操作系统的原生桌面应用程序：

Supported platforms: Windows, macOS, Linux.  
支持的平台：Windows、macOS、Linux。

### Run with Docker 与 Docker 一起运行

[Go to Docker Guide  
请访问 Docker 指南。](https://github.com/DayuanJiang/next-ai-draw-io/blob/main/docs/en/docker.md)

### Installation 安装

1. Clone the repository:克隆仓库：
```
git clone https://github.com/DayuanJiang/next-ai-draw-io
cd next-ai-draw-io
npm install
cp env.example .env.local
```

See the [Provider Configuration Guide](https://github.com/DayuanJiang/next-ai-draw-io/blob/main/docs/en/ai-providers.md) for detailed setup instructions for each provider.  
如需了解各提供商的详细安装说明，请参考《提供商配置指南》。

2. Run the development server:
```
npm run dev
```
3. Open [http://localhost:6002](http://localhost:6002/) in your browser to see the application.

## Deployment

### Deploy to EdgeOne Pages

You can deploy with one click using [Tencent EdgeOne Pages](https://pages.edgeone.ai/).

Deploy by this button:

Check out the [Tencent EdgeOne Pages documentation](https://pages.edgeone.ai/document/deployment-overview) for more details.

Additionally, deploying through Tencent EdgeOne Pages will also grant you a [daily free quota for DeepSeek models](https://pages.edgeone.ai/document/edge-ai).

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com/new), the creators of Next.js. Be sure to **set the environment variables** in the Vercel dashboard as you did in your local `.env.local` file.

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Deploy on Cloudflare Workers

[Go to Cloudflare Deploy Guide](https://github.com/DayuanJiang/next-ai-draw-io/blob/main/docs/en/cloudflare-deploy.md)

## Multi-Provider Support

- [ByteDance Doubao](https://www.volcengine.com/activity/codingplan?ac=MMAP8JTTCAQ2&rc=Z9Z3LDTJ&utm_campaign=drawio&utm_content=drawio&utm_medium=devrel&utm_source=OWO&utm_term=drawio)
- AWS Bedrock (default)
- OpenAI
- Anthropic
- Google AI
- Google Vertex AI
- Azure OpenAI
- Ollama
- OpenRouter
- AIHubMix
- DeepSeek
- SiliconFlow
- ModelScope
- SGLang
- Vercel AI Gateway

All providers except AWS Bedrock and OpenRouter support custom endpoints.

📖 **[Detailed Provider Configuration Guide](https://github.com/DayuanJiang/next-ai-draw-io/blob/main/docs/en/ai-providers.md)** - See setup instructions for each provider.

### Server-Side Multi-Model Configuration

Administrators can configure multiple server-side models that are available to all users without requiring personal API keys. Configure via `AI_MODELS_CONFIG` environment variable (JSON string) or `ai-models.json` file. For a single-provider quick setup, list comma-separated model IDs in `AI_MODEL`.

### Admin Panel

Set the `ADMIN_PASSWORD` environment variable and visit `/admin` to manage server settings (models, access codes, features, observability, quota) from a web panel instead of hand-editing `.env`.

📖 **[Admin Panel Guide](https://github.com/DayuanJiang/next-ai-draw-io/blob/main/docs/en/admin-panel.md)** — setup, precedence rules, and notes.

**Model Requirements**: This task requires strong model capabilities for generating long-form text with strict formatting constraints (draw.io XML). Recommended models include Claude Sonnet 4.5, GPT-5.1, Gemini 3 Pro, and DeepSeek V3.2/R1.

Note that the `claude` series has been trained on draw.io diagrams with cloud architecture logos like AWS, Azure, GCP. So if you want to create cloud architecture diagrams, this is the best choice.

## How It Works

The application uses the following technologies:

- **Next.js**: For the frontend framework and routing
- **Vercel AI SDK** (`ai` + `@ai-sdk/*`): For streaming AI responses and multi-provider support
- **react-drawio**: For diagram representation and manipulation

Diagrams are represented as XML that can be rendered in draw.io. The AI processes your commands and generates or modifies this XML accordingly.

## Support & Contact

**Special thanks to [ByteDance Doubao](https://www.volcengine.com/activity/codingplan?ac=MMAP8JTTCAQ2&rc=Z9Z3LDTJ&utm_campaign=drawio&utm_content=drawio&utm_medium=devrel&utm_source=OWO&utm_term=drawio) for sponsoring the API token usage of the demo site!** Register on the ARK platform to get 500K free tokens for all models!

If you find this project useful, please consider [sponsoring](https://github.com/sponsors/DayuanJiang) to help me host the live demo site!

For support or inquiries, please open an issue on the GitHub repository or contact the maintainer at:

- Email: me\[at\]jiang.jp

## FAQ

See [FAQ](https://github.com/DayuanJiang/next-ai-draw-io/blob/main/docs/en/FAQ.md) for common issues and solutions.