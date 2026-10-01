# Getting started with Easy Cloud AI

This page walks you from "yes" to a live chatbot, a live phone receptionist, or both.

- **Most of the work is ours.** You create a few accounts, send us their keys, and tell us about your business.
- **You own the accounts.** Your AI usage bills to your own OpenAI, Pinecone and Vapi accounts, and your data stays in them.
- **Keys never go by plain email.** Send them over the secure channel we agree on with you, never in a repository.
- **Find your product below.** SimpleBot is the website chatbot. VoiceBot is the phone receptionist. Doing both? Follow both sections.

## How we'll work together

There are two ways to manage your bot's content. Pick one with us at the start.

| | We manage it | You manage it in GitHub |
|---|---|---|
| Who edits answers, services, hours | We do, when you ask | You do, by pull request |
| What you need | Nothing extra | A GitHub account; we set up a repository for you from our template |
| How changes go live | We make and check them | Merging runs an automatic check, then publishes |

## SimpleBot — website chatbot

**1. Create two accounts and send us three values.**

- **OpenAI:** create an API key. It needs access to the models `text-embedding-3-small` and `gpt-4o-mini`.
- **Pinecone:** create a serverless index with dimension **1536** and metric **cosine**.
- Send us the OpenAI key, the Pinecone API key, and the index's host URL.

**2. Tell us what the bot should know.**

- Your services, hours, service area, and the questions customers ask most.
- Any prices the bot may state. It will only quote prices you have confirmed in writing.
- A greeting, your brand color, and the email address that should receive leads.

**3. We build and check it.** We load your content, then ask the bot every test question and confirm each one is answered from your information.

- *If you manage it in GitHub:* we send you an access token once, over the secure channel. Store it in your repository under **Settings → Secrets and variables → Actions** as a secret named `EASYCLOUD_TOKEN`. Then edit `bot.json`, open a pull request, and merge. The check runs on every merge and fails if any test question is missed.
- *If we manage it:* nothing to do in this step.

**4. Put it on your website.** We send you one line of code. Paste it just before the closing `</body>` tag of your site, or send it to whoever manages your website. We also send a direct link to a full-page chat you can share.

**5. Try it.** Ask it the questions your customers ask. Anything wrong or missing, tell us, or add it in `bot.json` if you manage it in GitHub.

## VoiceBot — phone receptionist

**1. Create two accounts and send us two keys.**

- **Cal.com:** set up one event type for each service callers can book. Create an API key and send it to us.
- **Vapi:** create an account and send us a private API key. Buy or import the phone number callers will dial in Vapi, then tell us which number it is.

**2. Tell us about your business.**

- Each bookable service, how long it takes, and the price the receptionist may quote.
- Which Cal.com event type goes with each service. Its number is at the end of the event type's page address.
- Your hours, address, parking note, and time zone.
- The owner's email and mobile number. Bookings and messages go there.

**3. We set up your receptionist.** We create it inside your Vapi account and connect it to your calendar.

- *If you manage it in GitHub:* the same token as SimpleBot covers the phone receptionist. Fill in `business.json` and merge. When a change affects what the receptionist says, we update it; the check tells you when that applies.
- *If we manage it:* nothing to do in this step.

**4. Make a test call.** Call your number and do three things:

1. Ask what services you offer. It should list only yours, at your prices.
2. Book an appointment. It should appear on your Cal.com calendar, and the owner should be notified.
3. Cancel that test booking in Cal.com.

**5. Send callers to it.** To have your existing business number answered, set up call forwarding to your Vapi number with your phone provider.

## Changing things later

- **We manage it:** tell us what to change.
- **You manage it in GitHub:** edit `bot.json` or `business.json`, open a pull request, check it passes, and merge.
- **Only we can** edit or delete an answer that is already live, rotate your Cal.com or Vapi key, or reissue your token.
- **Changing your OpenAI or Pinecone key?** Send us the new one before you delete the old one, or the bot stops answering.

## Something wrong?

- **The chatbot stops answering, or the GitHub check says "bot credentials not configured".** Your keys are missing or were changed. Send us the current ones.
- **GitHub says "token rejected".** Ask us for a new token.
- **Anything else,** contact us at sales@easycloudsolutions.com or (626) 885-6764.
