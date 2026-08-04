# Browser automation via CDP

## Table of contents

- [Why CDP](#why-cdp)
- [Endpoints](#endpoints)
- [Key methods](#key-methods)
- [Typing and clicking](#typing-and-clicking)
- [Console and network](#console-and-network)
- [Real-Chrome usage](#real-chrome-usage)
- [Pitfalls](#pitfalls)

## Why CDP

The Computer Use helper refuses browser windows ("could not determine the current browser URL"), so screenshots/clicks on Chrome/Edge are blocked over the pipe. Chrome DevTools Protocol (CDP) drives the browser directly over a local debugging port — no OpenAI gating, so it works for any model. Everything the helper could do for a desktop app is available for a browser: navigation, DOM reads/writes, clicks, typing, screenshots, console and network capture.

## Endpoints

Chrome must be started with `--remote-debugging-port=<port>` (the skill's `launch` does this). Then:

- `http://127.0.0.1:<port>/json/version` — browser info + browser-level WebSocket URL.
- `http://127.0.0.1:<port>/json/list` — page targets with `webSocketDebuggerUrl`.
- `PUT http://127.0.0.1:<port>/json/new?<url>` — open a new tab.

Commands are JSON messages over the target's WebSocket: `{ "id": N, "method": "...", "params": {...} }`, responses carry the same `id`.

## Key methods

| Method | Purpose |
| --- | --- |
| `Page.enable` / `Runtime.enable` | Required before navigation / evaluation |
| `Page.navigate` + `Page.loadEventFired` | Open a URL and wait for load |
| `Runtime.evaluate` | Run JS, read/assert DOM, dispatch clicks |
| `Input.insertText` | Type text into the focused element (native events) |
| `Page.captureScreenshot` | Render-engine screenshot (not OS screen capture); `data` is base64 PNG; works headless, viewport by default, full page via `captureBeyondViewport` |
| `Runtime.consoleAPICalled` | Event with console logs (enable `Runtime.enable` first) |
| `Network.enable` + `Network.requestWillBeSent` / `responseReceived` | Capture requests/responses for API debugging |

## Typing and clicking

Prefer DOM-level actions for reliability:

```js
// click
document.querySelector("#btn").click();
// focus then type
document.querySelector("#email").focus();
```

then `Input.insertText { text }`. For coordinate-based mouse events (canvas, drag), use `Input.dispatchMouseEvent` with `type: mousePressed/mouseReleased/mouseMoved`.

Click by visible text when there is no stable selector (nav items, buttons):

```js
(() => {
  const el = [...document.querySelectorAll('a,button,span,div,li')]
    .filter((e) => e.textContent.trim() === '账单' && e.offsetParent !== null)
    .sort((a, b) => a.children.length - b.children.length)[0];
  if (el) el.click();
})();
```

The CLI exposes this as `click-text "账单"`.

## Console and network

Console logs arrive as `Runtime.consoleAPICalled` events; collect them after `Runtime.enable`. Network capture needs `Network.enable`; inspect `Network.requestWillBeSent` (request URL/method) and `Network.responseReceived` (status) to assert API calls during self-tests.

## Real-Chrome usage

- **Headless** (`--headless=new`): invisible, fast, good for regression-style checks.
- **Headed with a profile** (`--headed` + `--user-data-dir=<dir>`): visible, keeps logins/extensions. A running Chrome holds a lock on its User Data dir: a second process pointed at the same dir just forwards the request to the running instance (no debug port), so you cannot "open another window on the same profile". To reuse an existing login, close Chrome and relaunch it with `--remote-debugging-port` on the same user-data-dir (get user consent first). Otherwise use a temp profile and let the user sign in once.
- **Attach instead of launch**: if Chrome is already running with `--remote-debugging-port`, just run the CLI commands without `launch`.
- Local dev servers (`http://127.0.0.1:<port>`) work normally; `file://` URLs also work for static pages.

## Pitfalls

- Forgetting `Page.enable`/`Runtime.enable` causes silent failures of navigation/eval.
- `Runtime.evaluate` without `returnByValue: true` returns an object reference, not the value.
- A page that never fires `loadEventFired` (e.g. long-lived SPA with no reload) can hang; use `Page.navigate` + a bounded wait instead of waiting for load when appropriate.
- Reusing one WebSocket for concurrent requests: the helper is not the issue here, but keep command `id`s unique per session.
- Screenshot of `file://` or localhost pages is fine; capture after your assertions so the evidence includes the final UI state.
- PowerShell mangles inline `eval` expressions that contain `"` (the argument is truncated, e.g. `SyntaxError: Unexpected end of input`). Keep inline expressions quote-free, or put the JS in a file and use `eval-file`.
