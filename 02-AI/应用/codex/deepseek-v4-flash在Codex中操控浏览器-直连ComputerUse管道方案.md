# DeepSeek-V4-Flash 在 Codex 中操控浏览器：直连 Computer Use 管道方案

> 经验文档 · 2026-08-05 · 适用：Codex Desktop 26.727+，自定义模型（deepseek-v4-flash 等非官方模型）
> 更新：v3 — 新增 CDP 点击/按文本点击（click-text）、eval-file、登录页工作流与实战案例（DeepSeek 用量/账单）
> 更新：v4 — 新增“指定个人资料开标签/排查清单”（--profile-directory 引号坑、不同用户导致无资料、验证方法）

## 一、背景：问题是什么

用 deepseek-v4-flash（本地代理，custom provider）跑 Codex Desktop，想让它操控浏览器/电脑（例如"播放一个专注歌单"或"开发自测"）时：

- 电脑（Computer Use）插件点了没反应，`mcp__node_repl__js` 这类工具不存在；
- 在 `config.toml` 里开 `features.js_repl = true` 是无效的；
- 浏览器截图/点击要么不出现、要么中途被强制停止。

**根本原因**：上游问题 [openai/codex#34039](https://github.com/openai/codex/issues/34039)。新版本把 `js_repl` 移到了 `removed` 状态，内置 Computer Use 的 MCP 入口只对官方 OpenAI 模型开放，改配置无法恢复。

## 二、结论

- 配置层面无解（当前版本），但**不是官方模型 ≠ 完全不能操控电脑**。
- **桌面应用**：走 Computer Use 后台 helper 的命名管道协议（`list_apps` / `get_window` / `get_window_state` / `press_key` / `type_text` 等），绕过被禁用的 MCP 入口。实测 PotPlayer 等非浏览器应用完全可控。
- **浏览器 / 开发自测**：管道路径受 helper 的 URL 安全策略拦截，浏览器要走 **Chrome DevTools Protocol（CDP）**——编程式驱动浏览器：导航、点击、按文本点击、填表、读 DOM、抓 console、截图、看网络请求，全部可用，与模型无关。
- 截图是**浏览器的渲染 API**（`Page.captureScreenshot`），不是操作系统屏幕抓取：不需要窗口可见（无头模式可用）、不受其他窗口遮挡，还能截整页。

## 三、原理（协议要点）

### Computer Use 命名管道（桌面应用）

- 管道：`\\.\pipe\codex-computer-use-<uuid>`，**每个会话不同**。
- 帧格式：4 字节小端长度前缀 + UTF-8 JSON-RPC 2.0 报文。
- 请求信封：`{"jsonrpc":"2.0","id":N,"method":"request","params":{"method":"<sky_op>","params":{...}}}`
- 批准握手：helper 发 `{"method":"requestComputerUseApproval","id":"...","params":{...}}`，客户端回 `{"jsonrpc":"2.0","id":"<同一 id>","result":{"action":"accept"}}`。
- 已确认可用的 sky op：

| op | 参数 | 说明 |
| --- | --- | --- |
| `list_apps` | `{}` | 列出应用与窗口（id/title） |
| `get_window` | `{ id, app }`（app 是应用 id 字符串） | 取窗口对象 |
| `activate_window` | `{ window }` | 窗口置前 |
| `get_window_state` | `{ window, include_screenshot, include_text }` | 窗口标题 + 可访问性树 + 截图（`screenshots[0].url` data URL） |
| `press_key` | `{ window, key }` | 如 `Control_L+t`、`Return` |
| `type_text` | `{ window, text }` | 输入文本 |

### CDP（浏览器）

- Chrome 以 `--remote-debugging-port=<port>` 启动后：
  - `http://127.0.0.1:<port>/json/version` — 浏览器信息；
  - `http://127.0.0.1:<port>/json/list` — 页面 target（含 `webSocketDebuggerUrl`）；
  - `PUT http://127.0.0.1:<port>/json/new?<url>` — 新建标签页。
- 之后通过 target 的 WebSocket 收发 JSON 命令：`{ "id": N, "method": "...", "params": {...} }`。
- 常用方法：`Page.navigate`（打开）、`Runtime.evaluate`（执行 JS/读 DOM）、`Input.insertText`（输入）、`Page.captureScreenshot`（截图）、`Runtime.consoleAPICalled`（console 日志）、`Network.enable`（网络请求）。

## 四、方案：直接用 skill（推荐）

已封装成 skill 并安装到 `C:\Users\bytechao\.codex\skills\codex-computer-use-pipe`。新会话里直接说"用 codex-computer-use-pipe 帮我操控/自测…"即可触发。需提权运行，shell 弹出批准时点允许。

### 桌面应用（管道）

```bash
node cua-cli.mjs list-apps
node cua-cli.mjs activate <windowId>
node cua-cli.mjs state <windowId> [out.png]     # 读状态，可顺带截图
node cua-cli.mjs key <windowId> "Control_L+t"
node cua-cli.mjs type <windowId> "https://music.163.com"
node cua-cli.mjs launch "D:\programs\PotPlayer\PotPlayerMini64.exe" "C:\path\to\playlist.m3u"
```

管道自动发现顺序：环境变量 `CUA_PIPE` → `~/.codex/config.toml` 的 `SKY_CUA_NATIVE_PIPE_DIRECTORY` → 枚举 `\\.\pipe\`。

### 浏览器开发自测（CDP）

```bash
# 启动（headless 无窗口适合快速回归；--headed 带窗口+profile）
node cdp-cli.mjs launch --headless --port 9223
node cdp-cli.mjs launch --headed --profile "D:\dev\chrome-profile" --port 9223

# 驱动页面
node cdp-cli.mjs open "http://127.0.0.1:5173"
node cdp-cli.mjs click "#submit"
node cdp-cli.mjs click-text "账单"            # 按可见文本点击（无稳定选择器时最实用）
node cdp-cli.mjs type "#email" "dev@example.com"
node cdp-cli.mjs text "#result"
node cdp-cli.mjs eval "document.title"
node cdp-cli.mjs eval-file "C:\path\to\expr.js"  # 复杂 JS 放文件里，避免 shell 引号坑
node cdp-cli.mjs shot "C:\path\to\out.png"
node cdp-cli.mjs logs
node cdp-cli.mjs close
```

- `--port` 默认 9223，所有命令共用同一端口；`list` 可查看现有 target。
- 若 Chrome 已带调试端口运行，可直接执行命令"挂载"上去，不用再 `launch`。
- **登录页工作流**：`launch --headed --profile <临时目录>` → 用户扫码/登录 → 操作 → `close` 后删除临时 profile（里面有登录 cookie）。

## 五、实战案例：播放专注歌单（管道路径，已验证）

1. 环境确认：PotPlayer 已安装，本机无音乐文件；SomaFM 被墙、网易云可达。
2. 用网易云公开搜索接口找"学习背景音乐/专注/白噪音"歌曲，逐个验证外链 `https://music.163.com/song/media/outer/url?id=<id>.mp3` 返回 `200 audio/mpeg`。
3. 生成 `focus-playlist.m3u`（14 首，含 lofi/钢琴/雨声白噪音）。
4. `Start-Process PotPlayerMini64.exe 歌单路径` → 窗口标题立即变为"学习背景音乐 - 早上喝咖啡/早晨音乐 - PotPlayer"。
5. 用管道 `state` 读窗口：标题、可访问性树、截图全部正常 → 确认播放。

## 六、实战案例：DeepSeek 用量与账单（CDP，已验证）

需求：读取 `platform.deepseek.com/usage` 的累计消费，并点击进入账单页。

1. 用 `~/.codex/config.toml` 里的 DeepSeek API key 先调 `https://api.deepseek.com/user/balance`（只能拿余额，拿不到累计消费）。
2. 累计消费在登录后的页面里 → `launch --headed --profile <临时目录> --port 9231` 开独立窗口，用户扫码登录。
3. `open https://platform.deepseek.com/usage` → `eval 'document.body.innerText...'` 读 DOM 文本：累计消费 **¥330.72**、近 30 天 ¥69.58 / 12,640 次请求 / 12.4 亿 tokens。
4. `click-text "账单"` → 页面切到账单视图（充值账单/赠送账单/退款管理/发票管理 + 订单流水表）→ `eval` 读出订单记录，`shot` 截图留证。
5. `close` + 删除临时 profile，用户原 Chrome 全程未动。

## 七、已知限制

- **管道路径浏览器被拦**：Chrome/Edge 的窗口状态/截图会被 helper 的 URL 策略强制停止。浏览器请走 CDP。
- **同一份 profile 不能开第二个窗口，但可以开新标签**：Chrome 运行时会锁住 User Data 目录，第二个进程指定同一目录只会把请求转给现有实例（调试端口开不起来）。要在“现有窗口 + 指定资料”里开新标签，用 `chrome.exe --profile-directory="Profile 3" <url>`（见第八节，引号必须内嵌）。要调试端口只能关掉 Chrome 重启带参数（需确认），否则用临时 profile 让用户登录一次。
- **会话级**：管道名每个会话重置，skill 会自动重新发现。CDP 端口由你启动，跨命令稳定。
- **需要提权**：管道访问、启动浏览器、localhost CDP 连接都必须走提权 shell。
- **自动批准**：管道客户端自动接受 Computer Use 批准请求；真正的门禁是 shell 提权审批。
- **并发**：helper 串行处理请求；CDP 命令需唯一递增 id。
- 无头模式截图是"看不见窗口"的真实渲染；要肉眼看就 `--headed`。

## 八、指定个人资料：在现有窗口开标签 vs 开新窗口（2026-08-05 新验证）

Chrome 的资料按文件夹存放：`%LOCALAPPDATA%\Google\Chrome\User Data` 下的 `Default`、`Profile 1`、`Profile 2`……显示名 → 文件夹的映射在 `Local State` → `profile.info_cache`；最准的是 `chrome://version` 里的 Profile 路径。

在**指定资料**里打开网址（推荐，直接进现有窗口）：

```powershell
chrome.exe --profile-directory="Profile 3" https://www.douyin.com
```

要点：

1. **引号必须内嵌**：值里有空格（`Profile 3`）。引号一旦丢失，参数被拆成 `--profile-directory=Profile` 和 `3`，Chrome 会用/新建一个字面名叫 `Profile` 的空资料 → 新窗口、没有任何个人资料。2026-08-05 实测：拆坏的启动真的在 User Data 里建出了 `Profile` 文件夹和 Local State 条目。
2. **单实例路由**：Chrome 已在运行且是同一 Windows 用户时，网址会交给现有实例 → 在该资料对应的窗口里**开新标签**（不新开窗口）。该资料没有开窗口时才新开窗口（数据还是它自己的）。
3. 想强制新窗口（仍用该资料）加 `--new-window`。
4. **不带 `--profile-directory`**：交给现有实例，用当前活跃资料开标签（当天开抖音就是这条路）。
5. **不同 Windows 用户 = 另一个 Chrome**：单实例和 User Data 都按用户隔离。启动侧是别的账户（沙箱用户/提权管理员）时，`chrome.exe <url>` 会起一个全新的空 Chrome → 新窗口、没有个人资料。

skill 用法：

```bash
node cua-cli.mjs launch "C:\Program Files\Google\Chrome\Application\chrome.exe" '--profile-directory="Profile 3"' "https://www.douyin.com"
```

### 验证（别靠猜）

1. 新标签里开 `chrome://version`，Profile 路径必须以 `...\Profile 3` 结尾（金标准）。
2. 任务管理器：正确合并只增加渲染进程，浏览器主进程数和窗口数不变。
3. 看 `User Data` 目录和 `Local State`：多了陌生 `Profile`/`Profile 2` 文件夹或条目 = 参数被拆或换了数据目录。
4. `whoami` 对比启动侧账户和持有 Chrome 的账户。

### 排查清单：新窗口且没有个人资料

| # | 现象/检查点 | 原因 | 解决 |
| --- | --- | --- | --- |
| 1 | 新空白窗口；User Data 下多出 `Profile`/`Profile 2` 文件夹 | `--profile-directory` 空格处被拆（引号丢失） | 内嵌引号 `--profile-directory="Profile 3"`；PowerShell `Start-Process -ArgumentList` 里写 `'--profile-directory="Profile 3"'` |
| 2 | 新 Chrome 一个资料都没有；Profile 路径指向别的用户 | 启动账户不同（沙箱/提权 vs 日常登录） | 用同一账户启动；`whoami` 双侧对比 |
| 3 | 新 Chrome 空资料；命令行带 `--user-data-dir=<临时>` 或 CDP `--headed --profile <tempDir>` | 工具刻意隔离数据目录（开发/CDP 流程） | 个人浏览去掉 `--user-data-dir`；调试才用资料副本 |
| 4 | 启动时 Chrome 没在运行，开默认资料新窗口 | 没有可路由的实例 | 先开 Chrome 再传网址（或接受新窗口） |
| 5 | 资料开错（`Profile` 而不是 `Profile 3`） | 目录名拼写/大小写错误 | 从 `chrome://version` 或 `Local State` 抄准确名字 |

## 九、排错速查

| 错误/现象 | 原因 | 处理 |
| --- | --- | --- |
| `parse get_window params: invalid type: map, expected a string` | `app` 传成了对象 | 传应用 id 字符串 |
| `foreground window did not report a process id` | 前台不是目标窗口 | 先 `activate <windowId>` 再重试 |
| Computer Use 被停止（browser URL 策略） | 目标窗口是浏览器 | 改用 CDP（`cdp-cli.mjs`） |
| `SyntaxError: Unexpected end of input`（eval 内联） | PowerShell 把含双引号的表达式截断了 | 表达式避免双引号，或写进文件用 `eval-file` |
| `launch` 后命令无输出/超时 | 用 spawn 启动 Chrome 挂在命令进程树上 | 已改为 `Start-Process` 分离启动；仍超时就挂载已运行的调试 Chrome |
| CDP 连不上 | Chrome 未带 `--remote-debugging-port` 启动 | 用 `launch` 启动，或重启 Chrome 时加参数 |
| 新窗口没有登录态 | 同一 profile 被运行中的 Chrome 锁住 | 关闭原 Chrome 重启带调试端口（需确认），或用临时 profile 登录 |
| 新窗口空白且多出 `Profile` 文件夹 | `--profile-directory` 引号丢失被拆 | 内嵌引号（见第八节） |
| 新 Chrome 没有任何个人资料 | 启动账户与日常登录不同（沙箱/提权） | 同账户启动，`whoami` 验证 |
| 资料开错（`Profile` vs `Profile 3`） | 目录名拼错 | 从 `chrome://version` / `Local State` 抄名字 |

## 十、相关文件

- skill：`C:\Users\bytechao\.codex\skills\codex-computer-use-pipe\`（`SKILL.md`、`scripts/cua-*.mjs`、`scripts/cdp-*.mjs`、`references/protocol.md`、`references/browser-cdp.md`）
- 上游 issue：[openai/codex#34039](https://github.com/openai/codex/issues/34039)
- 本次歌单示例：`C:\Users\bytechao\Documents\Codex\2026-08-05\plugin-computer-use-openai-bundled-play\outputs\focus-playlist.m3u`
- 本次 DeepSeek 截图：`outputs/deepseek-usage.png`、`outputs/deepseek-billing.png`
