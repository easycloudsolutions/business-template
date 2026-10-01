# Your Easy Cloud AI config — SimpleBot + VoiceBot

This repo is the source of truth for your chatbot (`bot.json`) and, if you have
one, your VoiceBot phone receptionist (`business.json`). Merge to `main` and CI pushes
the change into the Easy Cloud platform, then proves the chatbot still answers
every question in your `eval` list.

New here? Start with `GETTING-STARTED.md`: what to send us, your first merge, your first test call.

## Editing

- `bot.json` — knowledge items, greeting, tone, brand color. Each item stays under 1200 characters.
- `business.json` — services and prices the phone agent may quote, hours, address, owner contact.
- Every new phrasing you add to an item's `Q:` line gets a matching `eval` case in the same commit.
- Open a pull request first: the `eval` check shows what is live before you merge.

## What happens on merge

1. `scripts/sync.mjs` upserts your bot settings, adds any new knowledge items by title, and updates your business row.
2. Indexing runs on the platform; after a short wait `scripts/eval.mjs` asks every eval question and fails the run on a miss.
3. If you changed the phone agent's name, timezone, services or settings, Easy Cloud re-pushes the assistant. CI prints a note; nothing for you to do.

## Things only Easy Cloud can do

- Edit or remove a live knowledge item (sync only adds). Ask us, or add a new item with a new title.
- Rotate your Cal.com key, change your Vapi assistant, or move your phone number.
- Issue or revoke `EASYCLOUD_TOKEN`. If CI reports "token rejected", ask us for a new one.

## Secrets

One repository secret: `EASYCLOUD_TOKEN`. It can touch only your bot and business. Nothing else in this repo is secret. Never commit the token.

## Your own AI accounts

Your bot runs on **your** OpenAI key and **your** Pinecone index, so usage bills to you and nobody else's questions touch your data. Before the first merge, send Easy Cloud (over the secure channel we agreed, never in this repo or by plain email):

- An OpenAI API key with access to `text-embedding-3-small` and `gpt-4o-mini` (the embedding model is fixed by the index below).
- A Pinecone serverless index: dimension **1536**, metric **cosine**. Send its API key and the index host URL.
- If you have VoiceBot: a Vapi private key from your own Vapi org and your Cal.com API key.

Until those are set on our side, CI's sync step reports "bot credentials not configured" and nothing is indexed.

## Running by hand

```bash
EASYCLOUD_TOKEN=ect_... node scripts/sync.mjs --dry-run
EASYCLOUD_TOKEN=ect_... node scripts/sync.mjs
node scripts/eval.mjs
```
