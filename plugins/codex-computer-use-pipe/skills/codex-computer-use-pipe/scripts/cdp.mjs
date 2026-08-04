import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const DEFAULT_PORT = 9223;

export const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

export function findChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  for (const p of CHROME_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Chrome/Edge not found; set CHROME_PATH");
}

export function stateFile() {
  return path.join(os.tmpdir(), "codex-cdp-sessions.json");
}

export function readSessions() {
  try {
    return JSON.parse(fs.readFileSync(stateFile(), "utf8"));
  } catch {
    return {};
  }
}

export function saveSessions(sessions) {
  fs.writeFileSync(stateFile(), JSON.stringify(sessions, null, 2));
}

export async function launchChrome({
  port = DEFAULT_PORT,
  headless = true,
  userDataDir,
  extraArgs = [],
} = {}) {
  const chrome = findChrome();
  const args = [
    `--remote-debugging-port=${port}`,
    "--no-first-run",
    "--disable-gpu",
  ];
  if (headless) args.push("--headless=new");
  if (userDataDir) args.push(`--user-data-dir=${userDataDir}`);
  args.push(...extraArgs, "about:blank");

  const argList = args
    .map((a) => `'${String(a).replaceAll("'", "''")}'`)
    .join(",");
  const hidden = headless ? " -WindowStyle Hidden" : "";
  const ps =
    `Start-Process -FilePath '${String(chrome).replaceAll("'", "''")}'` +
    ` -ArgumentList @(${argList})${hidden} -PassThru | Select-Object -ExpandProperty Id`;
  const out = execFileSync("powershell", ["-NoProfile", "-Command", ps], {
    encoding: "utf8",
    timeout: 30000,
  });
  const pid = Number(out.trim().split(/\r?\n/).pop());
  await waitForCdp(port, 20000);
  return { pid, port };
}

async function waitForCdp(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`CDP endpoint on port ${port} did not come up`);
}

export async function getTargets(port) {
  const r = await fetch(`http://127.0.0.1:${port}/json/list`);
  if (!r.ok) throw new Error(`CDP list failed: ${r.status}`);
  return r.json();
}

export async function newPage(port, url = "about:blank") {
  const r = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`,
    { method: "PUT" },
  );
  if (!r.ok) throw new Error(`CDP new tab failed: ${r.status}`);
  return r.json();
}

export class CdpSession {
  constructor(port) {
    this.port = port;
    this.ws = null;
    this.msgId = 0;
    this.pending = new Map();
    this.consoleEvents = [];
  }

  async init() {
    let targets = await getTargets(this.port);
    let page = targets.find((t) => t.type === "page");
    if (!page) page = await newPage(this.port);
    this.ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      this.ws.onopen = res;
      this.ws.onerror = () => rej(new Error("WebSocket connect failed"));
    });
    this.ws.onmessage = (ev) => this.handleMessage(ev);
    await this.send("Page.enable");
    await this.send("Runtime.enable");
    return this;
  }

  handleMessage(ev) {
    const msg = JSON.parse(ev.data);
    if (msg.id != null && this.pending.has(msg.id)) {
      const p = this.pending.get(msg.id);
      this.pending.delete(msg.id);
      if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
      else p.resolve(msg.result);
    } else if (msg.method === "Runtime.consoleAPICalled") {
      this.consoleEvents.push(msg.params);
    }
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  waitEvent(method, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`event timeout: ${method}`)),
        timeoutMs,
      );
      const handler = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.method === method) {
          this.ws.removeEventListener("message", handler);
          clearTimeout(timer);
          resolve(msg.params);
        }
      };
      this.ws.addEventListener("message", handler);
    });
  }

  async eval(expression) {
    const r = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
    });
    if (r.exceptionDetails) {
      throw new Error(`eval failed: ${JSON.stringify(r.exceptionDetails)}`);
    }
    return r.result?.value;
  }

  async navigate(url) {
    const loaded = this.waitEvent("Page.loadEventFired");
    await this.send("Page.navigate", { url });
    await loaded;
  }

  async click(selector) {
    const ok = await this.eval(
      `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.click(); return true; })()`,
    );
    if (!ok) throw new Error(`selector not found: ${selector}`);
  }

  async clickText(text) {
    const tag = await this.eval(`(() => {
      const els = [...document.querySelectorAll('a,button,span,div,li')];
      const target = els
        .filter((e) => e.textContent.trim() === ${JSON.stringify(text)} && e.offsetParent !== null)
        .sort((a, b) => a.children.length - b.children.length)[0];
      if (!target) return null;
      target.click();
      return target.tagName;
    })()`);
    if (!tag) throw new Error(`text not found: ${text}`);
    return tag;
  }

  async type(selector, text) {
    const ok = await this.eval(
      `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.focus(); return true; })()`,
    );
    if (!ok) throw new Error(`selector not found: ${selector}`);
    await this.send("Input.insertText", { text });
  }

  async text(selector) {
    return this.eval(
      `(() => { const el = document.querySelector(${JSON.stringify(selector)}); return el ? el.textContent : null; })()`,
    );
  }

  async shot(outPath) {
    const r = await this.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(outPath, Buffer.from(r.data, "base64"));
    return path.resolve(outPath);
  }

  logs() {
    return this.consoleEvents.map((e) =>
      (e.args ?? []).map((a) => a.value ?? a.description ?? "").join(" "),
    );
  }

  close() {
    try {
      this.ws?.close();
    } catch {}
  }
}
