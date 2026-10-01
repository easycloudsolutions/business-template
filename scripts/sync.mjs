// scripts/sync.mjs — push this repo's config into the Easy Cloud platform.
// Runs in CI on every push to main (see .github/workflows/sync.yml) or by hand:
//   EASYCLOUD_TOKEN=ect_... node scripts/sync.mjs [--dry-run]
// Zero dependencies (Node 20+). The token is scoped to this business only.
//
// What it does, in order:
//   1. bot.json      → POST /api/admin/bots (name + settings upsert)
//   2. bot.json      → items missing on the platform (by title) → POST /api/knowledge → POST /api/train
//   3. business.json → POST /api/admin/businesses (if the file exists)
// It never deletes or edits live items: rename nothing, add new titles instead.

import { readFileSync, existsSync } from "node:fs";

const BASE = process.env.BASE_URL || "https://simplebot.ray-ebb.workers.dev";
const TOKEN = process.env.EASYCLOUD_TOKEN;
const DRY = process.argv.includes("--dry-run");
if (!TOKEN) fail("EASYCLOUD_TOKEN is not set (GitHub secret, or export it for a manual run)");

const bot = JSON.parse(readFileSync("bot.json", "utf8"));
if (!bot.bot_id || !Array.isArray(bot.items)) fail("bot.json needs bot_id and items[]");
const oversize = bot.items.filter((i) => (i.content || "").length > 1200);
if (oversize.length) fail(`items over 1200 chars (split them): ${oversize.map((i) => JSON.stringify(i.title)).join(", ")}`);

// 1. bot + settings
await step(`bot ${bot.bot_id}: upsert name + settings`, () =>
  api("POST", "/api/admin/bots", { id: bot.bot_id, name: bot.name, settings: bot.settings ?? {} })
);

// 2. new items → train
const live = await api("GET", `/api/admin/knowledge?bot_id=${encodeURIComponent(bot.bot_id)}`);
const liveTitles = new Set(live.map((r) => r.title));
const missing = bot.items.filter((i) => !liveTitles.has(i.title));
console.log(`knowledge: live ${live.length} · repo ${bot.items.length} · new ${missing.length}`);
if (missing.length) {
  await step(`add ${missing.length} item(s): ${missing.map((i) => i.title).join(" | ")}`, async () => {
    await api("POST", "/api/knowledge", { bot_id: bot.bot_id, items: missing });
    const t = await api("POST", "/api/train", { bot_id: bot.bot_id });
    console.log(`  trained: indexed ${t.indexed ?? "?"}, remaining ${t.remaining ?? "?"}`);
  });
}

// 3. voice business (optional)
if (existsSync("business.json")) {
  const biz = JSON.parse(readFileSync("business.json", "utf8"));
  const { _readme, ...payload } = biz;
  if (!payload.id) fail("business.json needs id");
  await step(`business ${payload.id}: upsert`, async () => {
    const r = await api("POST", "/api/admin/businesses", payload);
    if (r.vapi_push_needed) {
      console.log("  NOTE: prompt fields changed — Easy Cloud will re-push your phone assistant (nothing for you to do).");
    }
  });
}

console.log(DRY ? "dry run complete" : "sync complete");

// ---- helpers ----
async function step(label, fn) {
  console.log(`${DRY ? "would " : ""}${label}`);
  if (!DRY) await fn();
}

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) fail("token rejected (revoked or wrong). Ask Easy Cloud for a new EASYCLOUD_TOKEN.");
  if (res.status === 403) fail(`token not allowed for this id: ${data.error}. bot_id/id in your JSON must match what the token was issued for.`);
  if (!res.ok) fail(`${method} ${path} → ${res.status}: ${data.error || JSON.stringify(data)}`);
  return data;
}

function fail(msg) {
  console.error(`sync failed: ${msg}`);
  process.exit(1);
}
