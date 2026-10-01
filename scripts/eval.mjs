// scripts/eval.mjs — prove the chatbot answers every question in bot.json's
// `eval` list from the expected knowledge item. Runs on pull requests (no
// token needed — it uses the public /api/ask) and after every sync.
//   node scripts/eval.mjs
// Exit 1 on any miss, so CI blocks a change that breaks retrieval.

import { readFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "https://simplebot.ray-ebb.workers.dev";
const bot = JSON.parse(readFileSync("bot.json", "utf8"));
const cases = bot.eval || [];
const fallback = (bot.settings?.fallback_message || "I don't have that information").slice(0, 40);

if (!cases.length) {
  console.error("bot.json has no eval cases — add [question, expected title] pairs for every Q-line phrasing.");
  process.exit(1);
}

let pass = 0;
for (const [question, expected] of cases) {
  const res = await fetch(`${BASE}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bot_id: bot.bot_id, question, session_id: `eval-${Date.now()}` }),
  });
  const data = await res.json().catch(() => ({}));
  const titles = (data.citations || []).map((c) => c.title || c);
  const refused = (data.answer || "").includes(fallback);
  const ok = res.ok && titles.includes(expected) && !refused;
  if (ok) pass++;
  console.log(`${ok ? "PASS" : "MISS"}  ${question}${ok ? "" : `\n      expected "${expected}", got [${titles.join(", ")}]${refused ? " (refused)" : ""}${res.ok ? "" : ` HTTP ${res.status}`}`}`);
}
console.log(`\n${pass}/${cases.length} passed`);
process.exit(pass === cases.length ? 0 : 1);
