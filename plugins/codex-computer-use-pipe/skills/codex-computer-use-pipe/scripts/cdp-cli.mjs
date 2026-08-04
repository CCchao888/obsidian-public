import fs from "node:fs";
import path from "node:path";
import {
  CdpSession,
  DEFAULT_PORT,
  getTargets,
  launchChrome,
  readSessions,
  saveSessions,
} from "./cdp.mjs";

const args = process.argv.slice(2);
const cmd = args[0];

function flag(name, def) {
  const i = args.indexOf(name);
  if (i === -1) return def;
  const v = args[i + 1];
  return v != null && !v.startsWith("--") ? v : true;
}

const port = Number(flag("--port", DEFAULT_PORT));

function usage() {
  console.log(
    [
      "Usage: node cdp-cli.mjs <command> [args] [--port N]",
      "",
      "  launch [--headless|--headed] [--profile <dir>] [--port N]",
      "  list [--port N]",
      "  open <url> [--port N]",
      "  eval <expression> [--port N]",
      "  eval-file <path> [--port N]",
      "  click <selector> [--port N]",
      "  click-text <text> [--port N]",
      "  type <selector> <text> [--port N]",
      "  text <selector> [--port N]",
      "  shot <out.png> [--port N]",
      "  logs [--port N]",
      "  close [--port N]",
      "",
      "Default port: 9223. All commands share the same port.",
    ].join("\n"),
  );
}

function rest(n) {
  return args.filter((a, i) => i > 0 && !a.startsWith("--") && a !== String(port)).slice(0, n);
}

async function withSession(fn) {
  const session = await new CdpSession(port).init();
  try {
    return await fn(session);
  } finally {
    session.close();
  }
}

async function main() {
  switch (cmd) {
    case "launch": {
      const headless = !args.includes("--headed");
      const profile = flag("--profile", null);
      const userDataDir = typeof profile === "string" ? profile : undefined;
      const { pid } = await launchChrome({ port, headless, userDataDir });
      const sessions = readSessions();
      sessions[port] = pid;
      saveSessions(sessions);
      console.log(`LAUNCHED port=${port} pid=${pid} headless=${headless}`);
      break;
    }
    case "list": {
      const targets = await getTargets(port);
      console.log(
        JSON.stringify(
          targets.map((t) => ({ id: t.id, type: t.type, title: t.title, url: t.url })),
          null,
          2,
        ),
      );
      break;
    }
    case "open": {
      const [url] = rest(1);
      if (!url) return usage();
      await withSession(async (s) => {
        await s.navigate(url);
        console.log(`OPENED: ${url}`);
      });
      break;
    }
    case "eval": {
      const expr = rest(1)[0] ?? args.slice(1).filter((a) => !a.startsWith("--")).join(" ");
      if (!expr) return usage();
      await withSession(async (s) => {
        console.log(`EVAL: ${JSON.stringify(await s.eval(expr))}`);
      });
      break;
    }
    case "eval-file": {
      const [file] = rest(1);
      if (!file) return usage();
      const expr = fs.readFileSync(file, "utf8");
      await withSession(async (s) => {
        console.log(`EVAL: ${JSON.stringify(await s.eval(expr))}`);
      });
      break;
    }
    case "click": {
      const [sel] = rest(1);
      if (!sel) return usage();
      await withSession(async (s) => {
        await s.click(sel);
        console.log(`CLICKED: ${sel}`);
      });
      break;
    }
    case "click-text": {
      const [text] = rest(1);
      if (!text) return usage();
      await withSession(async (s) => {
        const tag = await s.clickText(text);
        console.log(`CLICKED_TEXT: ${text} (${tag})`);
      });
      break;
    }
    case "type": {
      const [sel, text] = rest(2);
      if (!sel || text == null) return usage();
      await withSession(async (s) => {
        await s.type(sel, text);
        console.log(`TYPED into ${sel}: ${text}`);
      });
      break;
    }
    case "text": {
      const [sel] = rest(1);
      if (!sel) return usage();
      await withSession(async (s) => {
        console.log(`TEXT: ${JSON.stringify(await s.text(sel))}`);
      });
      break;
    }
    case "shot": {
      const [out] = rest(1);
      if (!out) return usage();
      await withSession(async (s) => {
        console.log(`SHOT_SAVED: ${await s.shot(out)}`);
      });
      break;
    }
    case "logs": {
      await withSession(async (s) => {
        await new Promise((r) => setTimeout(r, 400));
        const logs = s.logs();
        console.log(logs.length ? logs.join("\n") : "(no console logs)");
      });
      break;
    }
    case "close": {
      const sessions = readSessions();
      const pid = sessions[port];
      if (!pid) {
        console.log(`No tracked process for port ${port}; nothing to close.`);
        break;
      }
      try {
        process.kill(pid);
        console.log(`CLOSED pid=${pid} (port ${port})`);
      } catch (err) {
        console.log(`Process already gone: ${err.message}`);
      }
      delete sessions[port];
      saveSessions(sessions);
      break;
    }
    default:
      usage();
  }
}

main().catch((err) => {
  console.error(`ERROR: ${err?.message ?? err}`);
  process.exit(1);
});
