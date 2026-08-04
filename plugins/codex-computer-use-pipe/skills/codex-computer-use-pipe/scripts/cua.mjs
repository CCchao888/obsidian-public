import net from "node:net";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

export const PIPE_PREFIX = "\\\\.\\pipe\\codex-computer-use-";
export const CONFIG_PATH = path.join(os.homedir(), ".codex", "config.toml");

/**
 * Find the current session's Computer Use named pipe.
 * Priority: env CUA_PIPE > ~/.codex/config.toml > enumerate \\.\pipe\.
 */
export function discoverPipe() {
  if (process.env.CUA_PIPE) return process.env.CUA_PIPE;

  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const text = fs.readFileSync(CONFIG_PATH, "utf8");
      const m = text.match(/SKY_CUA_NATIVE_PIPE_DIRECTORY\s*=\s*['"]([^'"]+)['"]/);
      if (m?.[1]?.startsWith(PIPE_PREFIX)) return m[1];
    }
  } catch {}

  try {
    const out = execFileSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        "[System.IO.Directory]::GetFiles('\\\\.\\pipe\\') | Where-Object { $_ -like '*codex-computer-use*' }",
      ],
      { encoding: "utf8", timeout: 15000 },
    );
    const pipes = out
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (pipes.length) return pipes[0];
  } catch {}

  throw new Error(
    "Cannot find the Computer Use pipe. Is a Codex Desktop session with computer-use running? Set CUA_PIPE to override.",
  );
}

export class CuaClient {
  constructor() {
    this.nextId = 1;
    this.pending = new Map();
    this.buffer = Buffer.alloc(0);
    this.socket = null;
  }

  connect(pipe) {
    return new Promise((resolve, reject) => {
      this.socket = net.createConnection(pipe, () => resolve());
      this.socket.on("error", reject);
      this.socket.on("data", (chunk) => this.handleData(chunk));
      this.socket.on("close", () => {
        const err = new Error("pipe closed");
        for (const p of this.pending.values()) p.reject(err);
        this.pending.clear();
      });
    });
  }

  handleData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= 4) {
      const len = this.buffer.readUInt32LE(0);
      if (this.buffer.length < 4 + len) break;
      const payload = this.buffer.subarray(4, 4 + len).toString("utf8");
      this.buffer = this.buffer.subarray(4 + len);
      let msg;
      try {
        msg = JSON.parse(payload);
      } catch {
        continue;
      }
      if (msg.method === "requestComputerUseApproval" && msg.id != null) {
        console.error(`[approval] ${JSON.stringify(msg.params ?? {})}`);
        this.sendRaw({
          jsonrpc: "2.0",
          id: msg.id,
          result: { action: "accept" },
        });
        continue;
      }
      if (msg.id != null && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error != null) p.reject(new Error(JSON.stringify(msg.error)));
        else p.resolve(msg.result);
      }
    }
  }

  sendRaw(obj) {
    const payload = Buffer.from(JSON.stringify(obj), "utf8");
    const frame = Buffer.alloc(4 + payload.length);
    frame.writeUInt32LE(payload.length, 0);
    payload.copy(frame, 4);
    this.socket.write(frame);
  }

  request(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.sendRaw({
        jsonrpc: "2.0",
        id,
        method: "request",
        params: { method, params },
      });
    });
  }

  close() {
    this.socket?.end();
  }
}
