# The Lab Notebook · 实验记录本

**A 12-month foundations roadmap for a new Data Engineer with a pure-science background.**
Bilingual (English / 中文), light + dark, fully interactive. Twelve chapters, twelve pages,
eight visual themes — still no framework, no dependencies, nothing to install.

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
- **How the big systems work** — Grab, Netflix, YouTube, a trading exchange, Taobao, Shopee and foodpanda.
- **Where apps actually live** — a 6-rung hosting ladder from `localhost` to serverless.
- **How the big systems work** — Grab, Netflix, YouTube and an exchange/trading system, each reduced
  to the one clever idea that makes it possible.
- **It all starts from 0 and 1** — an interactive bit playground and a 12-floor abstraction tower.
- **How this page was built** — the five prompts that produced it, verbatim, and what each one returned.

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
| 13 | Then → Now | Scrub 18 before/after panels; the past fades as the present lights up |

Plus 10 animated SVG explainers, 9 self-check quizzes, 5 challenge cards and 34 trackable lab tasks.


## Chapters

The guide is twelve pages. Each has its own **vibe** — palette, type, corner language,
animated background and generative soundtrack — chosen to suit what it's teaching.

| # | Page | Vibe |
|---|---|---|
| — | `index.html` — start here, plus the 12-month overview | minimalist |
| 01 | `map.html` — the whole map, and one request travelling it | futuristic |
| 02 | `words.html` — the metaphor sheet and the tech stack atlas | chill |
| 03 | `terminal.html` — why computers are really text-driven | pixel |
| 04 | `m1.html` — IT Basics | modern |
| 05 | `m2.html` — Developer Tools | gamify |
| 06 | `m3.html` — AI Fundamentals | ai |
| 07 | `m4.html` — Data Engineering Core | natural |
| 08 | `m5.html` — CS & Cloud Infrastructure | futuristic |
| 09 | `systems.html` — how Grab, Taobao, Shopee, foodpanda actually work | gamify |
| 10 | `zero.html` — it all starts from 0 and 1 | pixel |
| 11 | `finish.html` — month 12, and how this page was built | chill |

### The backgrounds
Every vibe draws its own canvas scene: a perspective grid and a rotating wireframe cube
(futuristic), a neural net whose nodes pulse and link (ai), falling pixel blocks (pixel),
drifting leaves (natural), bokeh (chill), collectibles (gamify), a wireframe octahedron
(modern), a few drifting rules (minimalist). All plain Canvas 2D with hand-rolled 3D
projection — no three.js, nothing downloaded.

### The sound
Each vibe has a **generative** soundtrack, not an audio file: a Web Audio scale, waveform,
tempo and filter per theme, playing notes that never repeat the same way twice. Zero bytes
to download and nothing copyrighted. It is **off by default** and starts only when you press
the speaker in the top bar — browsers block autoplay audio, and so should anyone.

### Building
`index.html` and the chapter pages are generated. The original single-file version is kept
at `build/source.html`, and `build/split.py` regenerates every page plus the shared assets:

```bash
python3 build/split.py
```

Shared CSS and JS live in `assets/` so the browser caches them once and every later
chapter is a small page on top.

## Running it

Open `index.html` in any browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

No npm install, no framework, no runtime dependency. Everything — CSS, JavaScript, SVG,
the 3D maths and the music — is hand-written and served as plain static files, which is
itself part of the point the guide is making.

## Notes

- **Navigation** — the top bar shows which chapter you are in; tap it for the full chapter list.
- **Themes** — light, dark, or follow-the-system, cycled from the button in the top bar. Your choice,
  your language, and your motion/sound preferences are remembered across chapters.
- **Motion and sound** each have their own toggle in the top bar, and both respect
  `prefers-reduced-motion`.
- Every section paints its own background scene — blueprint grid on the map, phosphor scanlines on the
  terminal, a neural field on the AI milestone, falling bits on the last one.
- The background is five fixed layers; its hue follows whichever milestone you're reading, and the
  light follows your cursor. All of it respects `prefers-reduced-motion`.
- Contrast is audited across every text element in both themes: dark mode has no WCAG AA failures.
- Progress and playground state are **not** saved between visits.
- Scale figures in the architecture showcase are approximate and from public reporting.
- Written to be read in either language: use the **EN / 中文** switch in the top bar.

## Licence

MIT — use it, fork it, rewrite it for your own team.
