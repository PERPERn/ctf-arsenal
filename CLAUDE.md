# CTF Arsenal

A Next.js (App Router, static export) hub of cybersecurity & CTF tools with
bilingual (Thai/English) guides, playable terminal demos, and an in-browser
Identify engine ported from the `ctfid` CLI. See `README.md` for full details,
structure, and deploy steps (Vercel + Render).

Common commands:

```bash
npm run dev      # local dev server
npm run build    # static export to ./out
npm run serve    # preview ./out
```

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`.
See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical roles (`needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root.
See `docs/agents/domain.md`.
