# The Lab Notebook · 实验记录本

**A 12-month foundations roadmap for a new Data Engineer with a pure-science background.**
Bilingual (English / 中文), fully interactive, single static HTML file — no build step, no dependencies.

**▶ Live: https://teowwwzx.github.io/data-engineer-roadmap/**

---

## Why this exists

Job titles change every few years. The foundations don't. This guide walks someone from
"I've never written code" to "I understand how the whole machine works" — one honest month
at a time — and deliberately ends at the bottom of the stack: a switch that is either off or on.

## What's inside

- **The map** — one clickable diagram of the whole landscape: device → network → server side → data
  platform, with infrastructure underneath. Click any box for a pop-up explaining it; pick a role to
  see which regions belong to a Frontend Engineer, Backend Engineer, **Data Engineer**, Analyst,
  ML Engineer, DevOps or Security.
- **A metaphor sheet** — HTML = skeleton, CSS = clothes, JavaScript = nervous system, plus Apache,
  API, framework, Git, GitHub, open source, cloud, server and ETL in plain language.
- **The terminal** — why computers are really text-driven, what Linux is, GUI vs CLI, and why AI is
  unreasonably good at the command line.
- **5 milestones** — IT basics · developer tools · AI fundamentals · data engineering core · CS & cloud.
  Each concept is broken into **Why / Then→Now / What & How / If you skip it**, with a real-world
  example and a hands-on challenge.
- **Where apps actually live** — a 6-rung hosting ladder from `localhost` to serverless.
- **How the big systems work** — Grab, Netflix, YouTube and an exchange/trading system, each reduced
  to the one clever idea that makes it possible.
- **It all starts from 0 and 1** — an interactive bit playground and a 12-floor abstraction tower.

## Interactive playgrounds (11)

| # | Playground | What it does |
|---|---|---|
| 1 | Body / web page layers | Toggle HTML, CSS and JS on a figure and a live page at the same time |
| 2 | Live code sandbox | Type real HTML/CSS/JS, see it render instantly |
| 3 | SQL builder | Click clauses; the SQL and the returned rows both update |
| 4 | HTTP simulator | Trigger a real 200, 401, 403, 404, 429 and 503 |
| 5 | Git simulator | Commit, branch, merge — the graph draws itself, conflicts included |
| 6 | Terminal | A working virtual shell: `ls`, `grep`, `wc`, pipes, `df -h`, `python3` |
| 7 | Prompt Lab | Tick ingredients, watch a 0–100 quality score and the answer change |
| 8 | Data cleaner | Eight genuinely dirty rows, fixed one pandas operation at a time |
| 9 | Latency lab | The memory hierarchy as a race you can watch |
| 10 | Autoscaling | Drag traffic; servers appear, latency holds, the bill moves |
| 11 | Bit switches | Flip eight switches, watch a letter appear |
| 12 | The map | 17 clickable regions, role overlays, and a traced request |

Plus 10 animated SVG explainers, 9 self-check quizzes, 5 challenge cards and 34 trackable lab tasks.

## Running it

It's one file. Open `index.html` in any browser, or:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

No build, no npm install, no framework. Everything — CSS, JavaScript, SVG — is inline,
which is itself part of the point the guide is making.

## Notes

- Progress and playground state are **not** saved between visits.
- Scale figures in the architecture showcase are approximate and from public reporting.
- Written to be read in either language: use the **EN / 中文** switch in the top bar.

## Licence

MIT — use it, fork it, rewrite it for your own team.
