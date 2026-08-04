# Computer Use named-pipe protocol

## Table of contents

- [Why this exists](#why-this-exists)
- [Frame format](#frame-format)
- [Requests](#requests)
- [Approval handshake](#approval-handshake)
- [Sky ops](#sky-ops)
- [Pipe discovery](#pipe-discovery)
- [Error cases](#error-cases)
- [Limitations](#limitations)

## Why this exists

Codex Desktop normally exposes Computer Use through an MCP `node_repl` server whose `js` tool injects a `sky` runtime. In builds where `js_repl` is `removed` (upstream [openai/codex#34039](https://github.com/openai/codex/issues/34039)), that tool is unavailable to non-OpenAI models (e.g. `deepseek-v4-flash` via a local provider), so the config flag `features.js_repl = true` is a no-op. The named pipe the helper listens on is still live, so a client can speak the wire protocol directly.

## Frame format

Messages are newline-free JSON-RPC 2.0 frames over a Windows named pipe:

- 4-byte little-endian payload length, then the UTF-8 JSON payload.

```js
const payload = Buffer.from(JSON.stringify(msg), "utf8");
const frame = Buffer.alloc(4 + payload.length);
frame.writeUInt32LE(payload.length, 0);
payload.copy(frame, 4);
```

## Requests

Client-to-helper request envelope:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "request",
  "params": { "method": "list_apps", "params": {} }
}
```

The helper serializes requests; concurrent calls are rejected.

## Approval handshake

The helper may send an approval request at any time:

```json
{
  "method": "requestComputerUseApproval",
  "id": "some-id",
  "params": { "message": "Allow Codex to use ...?" }
}
```

Accept by replying with the same `id`:

```json
{ "jsonrpc": "2.0", "id": "some-id", "result": { "action": "accept" } }
```

The client in `scripts/cua.mjs` auto-accepts these; the shell escalation approval is the real gate.

## Sky ops

Verified operations:

| Op | Params | Result |
| --- | --- | --- |
| `list_apps` | `{}` | Array of apps: `{ id, name, windows: [{ id, title, app }] }` |
| `get_window` | `{ id, app }` (`app` is the app **id string**, e.g. `"Chrome"` or an exe path) | Window object used by other ops |
| `activate_window` | `{ window }` | Brings window to foreground |
| `get_window_state` | `{ window, include_screenshot, include_text }` | `{ window, accessibility: { tree, focused_element }, screenshots: [{ url: "data:image/jpeg;base64,..." }] }` |
| `press_key` | `{ window, key }` | e.g. `"Control_L+t"`, `"Return"` |
| `type_text` | `{ window, text }` | Types text |

`get_window_state` returns screenshots as data URLs in `screenshots[0].url` when `include_screenshot` is true.

## Pipe discovery

The pipe name is per-session: `\\.\pipe\codex-computer-use-<uuid>`. Discover it by:

1. Env var `CUA_PIPE`.
2. `~/.codex/config.toml` → `[mcp_servers.node_repl.env]` → `SKY_CUA_NATIVE_PIPE_DIRECTORY = '\\.\pipe\codex-computer-use-...'`.
3. Enumerating `\\.\pipe\` and filtering `*codex-computer-use*`.

## Error cases

- `"foreground window did not report a process id"`: a non-target window has focus; run `activate <windowId>` first and retry.
- Browser policy stop: `"Computer Use has been stopped for this turn because it could not determine the current browser URL..."` — do not target Chrome/Edge windows for state/screenshots; use non-browser apps.
- `"pipe closed"` or connect refused: the session's helper is gone or the pipe name changed; rediscover and retry.

## Limitations

- Pipe and GUI access only work from an escalated (unsandboxed) shell.
- Browser control is policy-blocked in this setup (URL can't be confirmed). Non-browser apps are fully controllable.
- Everything is session-scoped: the pipe name, approvals, and tool availability reset per session.
