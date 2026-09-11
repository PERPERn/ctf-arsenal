# ⚔️ CTF Arsenal

A curated hub of cybersecurity & CTF tools with **bilingual (TH/EN) guides**,
**playable terminal demos**, and an **in-browser Identify** that pastes-and-decodes
strings or files entirely client-side. Built with Next.js + Tailwind, deployable
to both **Vercel** and **Render**.

คลังเครื่องมือ Cybersecurity & CTF พร้อม **คู่มือสองภาษา (ไทย/อังกฤษ)**,
**เดโมเทอร์มินัลที่เล่นได้**, และ **Identify ในเบราว์เซอร์** ที่วางข้อความหรือไฟล์แล้วถอดให้ทันที
โดยไม่ส่งขึ้นเซิร์ฟเวอร์ สร้างด้วย Next.js + Tailwind deploy ได้ทั้ง **Vercel** และ **Render**

---

## ✨ Features / จุดเด่น

- **100+ tools** across 10 categories (recon, web, crypto, forensics, stego, reverse/pwn, network, password, mobile, misc).
- Each tool page: bilingual overview + our own notes, install commands, usage, a cheatsheet, official-docs link, and a **replayable terminal demo**.
- **Identify** (`/identify`): paste text or drop a file/image → it detects hashes, encodings, ciphers, file magic; auto-decodes in layers; and suggests the next tool. Ported from our `ctfid` CLI. Runs 100% in the browser.
- Dark-first design, TH/EN toggle, instant search + category filters.

---

## 🧑‍💻 Local development / รันในเครื่อง

```bash
npm install
npm run dev          # http://localhost:3000
```

Build a static export and preview it:

```bash
npm run build        # outputs to ./out
npm run serve        # serves ./out on http://localhost:3000
```

Requires Node 18+ (see `.nvmrc`).

---

## 🚀 Deploy

The app is a **static export** (`output: "export"` in `next.config.mjs`), so both
hosts serve the pre-rendered `out/` folder — no server runtime needed.

### Option A — Vercel

**วิธีที่ 1 · Vercel**

1. Push this repo to GitHub/GitLab/Bitbucket.
2. On [vercel.com](https://vercel.com) → **Add New… → Project** → import the repo.
3. Vercel auto-detects Next.js. Leave the defaults (`vercel.json` pins the framework). Click **Deploy**.
4. Done — you get a `*.vercel.app` URL with automatic preview deploys per push.

CLI alternative / ทางเลือกผ่าน CLI:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

### Option B — Render (same style as the reference site)

**วิธีที่ 2 · Render (โฮสต์สไตล์เดียวกับเว็บอ้างอิง)**

Blueprint (recommended) — this repo ships `render.yaml`:

1. Push the repo to GitHub.
2. On [render.com](https://render.com) → **New → Blueprint** → select the repo.
3. Render reads `render.yaml` and creates a **Static Site**:
   - Build command: `npm ci && npm run build`
   - Publish directory: `out`
4. Click **Apply**. You get an `*.onrender.com` URL with PR previews.

Manual (no blueprint) / ตั้งเอง:

- **New → Static Site** → connect repo → Build `npm ci && npm run build` → Publish directory `out`.

---

## 📁 Structure / โครงสร้าง

```
app/                 routes: / , /identify , /guides , /about , /tools/[id]
components/          Nav, Hero, Explorer, ToolCard, ToolDetail, Terminal, Identify, …
lib/tools.ts         the tool dataset (bilingual content + terminal demos)
lib/identify.ts      the in-browser identify/decoder engine (ported from ctfid)
lib/guides.ts        bilingual playbooks
lib/categories.ts    category metadata
render.yaml          Render Static Site blueprint
vercel.json          Vercel framework hint
```

## ➕ Add a tool / เพิ่มเครื่องมือ

Append an entry to `lib/tools.ts` (see the `Tool` type in `lib/types.ts`).
Set `featured: true` and add a `demo` with terminal `steps` to give it a card
badge and a playable demo. Rebuild — it is picked up automatically.

---

## ⚠️ Disclaimer

For education and authorised security testing only. Do not use these tools or
techniques against systems you do not own or lack explicit permission to test.

ใช้เพื่อการศึกษาและการทดสอบความปลอดภัยที่ได้รับอนุญาตเท่านั้น
ห้ามใช้กับระบบที่คุณไม่ได้เป็นเจ้าของหรือไม่ได้รับอนุญาต
