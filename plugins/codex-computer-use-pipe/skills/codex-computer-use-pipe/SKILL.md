---
name: codex-computer-use-pipe
description: Control Windows apps through the Computer Use named-pipe protocol AND drive Chrome/Edge via Chrome DevTools Protocol (CDP) for development self-testing (navigate, click, type, read DOM, capture console logs, take screenshots) when the built-in computer-use / browser MCP tools are unavailable, such as sessions running a non-OpenAI model (deepseek-v4-flash or other custom providers). Use when the user asks to control apps, open or play media, test a local web page, click through a UI, fill forms, assert page state, take screenshots, press keys, or type text.
---

# Codex Computer Use Pipe

Two complementary drivers for sessions where the built-in computer-use / browser tools are disabled (upstream: [openai/codex#34039](https://github.com/openai/codex/issues/34039)):

- **Desktop apps** → named-pipe Computer Use client ([cua-cli.mjs](scripts/cua-cli.mjs)).
- **Browsers & dev self-testing** → CDP client ([cdp-cli.mjs](scripts/cdp-cli.mjs)). The pipe path cannot control browsers (helper URL policy); CDP can.

## Prerequisites

- Node 22+ (uses global `fetch` / `WebSocket`).
- Chrome or Edge installed (`CHROME_PATH` overrides discovery).
- Pipe access, launching browsers, and localhost CDP connections require an **escalated shell** (`sandbox_permissions: "require_escalated"`). Request the user's approval.

## Desktop apps (named pipe)

List apps and windows:

```bash
node scripts/cua-cli.mjs list-apps
```

Activate a window, read its state, optionally save a screenshot:

```bash
node scripts/cua-cli.mjs activate <windowId>
node scripts/cua-cli.mjs state <windowId> [out.png]
```

Send a key / type text:

```bash
node scripts/cua-cli.mjs key <windowId> "Control_L+t"
node scripts/cua-cli.mjs type <windowId> "https://music.163.com"
```

Launch an app with arguments:

```bash
node scripts/cua-cli.mjs launch "D:\programs\PotPlayer\PotPlayerMini64.exe" "C:\path\to\playlist.m3u"
```

Workflow: `list-apps` → `activate` → `state` → act (`key` / `type` / `launch`) → `state` again to verify. Report verified evidence (window title, screenshot path) to the user.

Pipe limitations: browsers are policy-blocked; the pipe name is per-session (auto-discovered from `~/.codex/config.toml` or `\\.\pipe\` enumeration); approvals are auto-accepted; if `get_window_state` reports "foreground window did not report a process id", run `activate` first and retry.

## Browsers & dev self-testing (CDP)

Launch a headless instance (CI-style, no visible window):

```bash
node scripts/cdp-cli.mjs launch --headless --port 9223
```

Launch a visible instance with a persistent profile (keeps logins and extensions; use a separate copy of the profile if Chrome is already running on it):

```bash
node scripts/cdp-cli.mjs launch --headed --profile "D:\dev\chrome-profile" --port 9223
```

Drive the page:

```bash
node scripts/cdp-cli.mjs open "http://127.0.0.1:5173"
node scripts/cdp-cli.mjs click "#submit"
node scripts/cdp-cli.mjs click-text "账单"
node scripts/cdp-cli.mjs type "#email" "dev@example.com"
node scripts/cdp-cli.mjs text "#result"
node scripts/cdp-cli.mjs eval "document.title"
node scripts/cdp-cli.mjs eval-file "C:\path\to\expression.js"
node scripts/cdp-cli.mjs shot "C:\path\to\out.png"
node scripts/cdp-cli.mjs logs
node scripts/cdp-cli.mjs close
```

Workflow:

1. Start the dev server.
2. `launch` (headless for quick checks; headed with a profile for real UI work).
3. `open <url>`, then `click` / `type` / `text` / `eval` to act and assert.
4. `shot` to keep evidence, `logs` to check console errors.
5. `close` when done; report verified state and screenshot paths to the user.

Notes:

- `--port` defaults to 9223 and is shared by all commands.
- `list` shows open targets; to attach to an already-debug-enabled Chrome instead of launching a new one, just run commands without `launch`.
- Do not reuse a profile directory locked by a running Chrome instance.
- `Input.insertText` is used for typing, so no separate key-press steps are needed for form fields.
- Prefer `click-text` over selectors for nav items and buttons without stable selectors (it clicks the smallest visible element whose exact text matches).
- Inline `eval` expressions containing double quotes can be mangled by PowerShell; put complex JS in a file and use `eval-file`.
- **Logged-in pages**: launch `--headed --profile <tempDir>`, let the user sign in, drive the page, then `close` and delete the temp profile (it holds the session cookies).

## References

- [protocol.md](references/protocol.md) — Computer Use pipe wire protocol, approvals, error cases.
- [browser-cdp.md](references/browser-cdp.md) — CDP details, key methods, and pitfalls.
