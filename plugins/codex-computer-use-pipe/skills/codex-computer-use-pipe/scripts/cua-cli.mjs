import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { CuaClient, discoverPipe } from "./cua.mjs";

const [cmd, ...rest] = process.argv.slice(2);

function usage() {
  console.log(
    [
      "Usage: node cua-cli.mjs <command> [args]",
      "",
      "  list-apps",
      "  state <windowId> [out.png]",
      "  activate <windowId>",
      "  key <windowId> <key>",
      "  type <windowId> <text>",
      "  launch <exePath> [arg ...]",
      "",
      "Pipe discovery: env CUA_PIPE, then ~/.codex/config.toml, then \\\\.\\pipe\\ enumeration.",
    ].join("\n"),
  );
}

async function findWindow(client, windowId) {
  const apps = (await client.request("list_apps", {})) ?? [];
  const id = Number(windowId);
  for (const app of apps) {
    const win = (app.windows ?? []).find((w) => Number(w.id) === id);
    if (win) return { app, win };
  }
  throw new Error(`Window ${windowId} not found. Run list-apps first.`);
}

async function main() {
  const client = new CuaClient();
  await client.connect(discoverPipe());
  try {
    switch (cmd) {
      case "list-apps": {
        const apps = (await client.request("list_apps", {})) ?? [];
        const summary = apps.map((a) => ({
          id: a.id,
          name: a.name,
          windows: (a.windows ?? []).map((w) => ({ id: w.id, title: w.title })),
        }));
        console.log(JSON.stringify(summary, null, 2));
        break;
      }
      case "state": {
        const [windowId, outFile] = rest;
        if (!windowId) return usage();
        const { app, win } = await findWindow(client, windowId);
        const window = await client.request("get_window", { id: win.id, app: app.id });
        try {
          await client.request("activate_window", { window });
        } catch {}
        const state = await client.request("get_window_state", {
          window,
          include_screenshot: Boolean(outFile),
          include_text: true,
        });
        const w = state?.window ?? {};
        const acc = state?.accessibility ?? {};
        const tree = String(acc.tree ?? acc.document_text ?? "");
        console.log(`WINDOW_TITLE: ${String(w.title ?? "")}`);
        console.log(`WINDOW_ID: ${String(w.id ?? "")}`);
        console.log(`FOCUSED: ${String(acc.focused_element ?? "(none)")}`);
        console.log(`TREE_LEN: ${tree.length}`);
        if (tree) console.log(tree.slice(0, 8000));
        if (outFile) {
          const shot = Array.isArray(state?.screenshots) ? state.screenshots[0] : null;
          const raw = shot?.url ?? state?.screenshot;
          if (raw) {
            const b64 = String(raw).startsWith("data:")
              ? String(raw).split(",")[1]
              : String(raw);
            fs.writeFileSync(outFile, Buffer.from(b64, "base64"));
            console.log(`SCREENSHOT_SAVED: ${path.resolve(outFile)}`);
          } else {
            console.log("NO_SCREENSHOT_IN_RESULT");
          }
        }
        break;
      }
      case "activate": {
        const [windowId] = rest;
        if (!windowId) return usage();
        const { app, win } = await findWindow(client, windowId);
        const window = await client.request("get_window", { id: win.id, app: app.id });
        await client.request("activate_window", { window });
        console.log(`ACTIVATED: ${win.title}`);
        break;
      }
      case "key": {
        const [windowId, key] = rest;
        if (!windowId || !key) return usage();
        const { app, win } = await findWindow(client, windowId);
        const window = await client.request("get_window", { id: win.id, app: app.id });
        await client.request("press_key", { window, key });
        console.log(`KEY_SENT: ${key}`);
        break;
      }
      case "type": {
        const [windowId, text] = rest;
        if (!windowId || text == null) return usage();
        const { app, win } = await findWindow(client, windowId);
        const window = await client.request("get_window", { id: win.id, app: app.id });
        await client.request("type_text", { window, text });
        console.log(`TYPED: ${text}`);
        break;
      }
      case "launch": {
        const [exe, ...args] = rest;
        if (!exe) return usage();
        const argList = args.map((a) => `'${String(a).replaceAll("'", "''")}'`);
        const ps = `Start-Process -FilePath '${String(exe).replaceAll("'", "''")}' -ArgumentList @(${argList.join(",")})`;
        execFileSync("powershell", ["-NoProfile", "-Command", ps], { timeout: 30000 });
        console.log(`LAUNCHED: ${exe}`);
        break;
      }
      default:
        usage();
    }
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error(`ERROR: ${err?.message ?? err}`);
  process.exit(1);
});
