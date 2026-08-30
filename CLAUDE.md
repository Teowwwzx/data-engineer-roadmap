# CLAUDE.md

## Response style

**Default to short. Use bullets and tables. Avoid paragraphs.**

| Do | Don't |
| --- | --- |
| Bullet points, one line each | Multi-sentence paragraphs |
| A table for any comparison, before/after, or list with 3+ values | Prose describing values in sequence |
| Answer first, then stop | Preamble, restating the question, trailing summary |
| State what changed in 1–3 bullets | Narrating every step taken |
| Numbers bare: `2.02:1`, `Lc 50.5`, `17x17` | Sentences explaining what a number means |

Rules:

- Lead with the answer. Add explanation only if non-obvious or asked.
- One line per bullet where possible. No padding.
- Code changes: what changed and why, 1–3 bullets max.
- Skip "Great question", "In conclusion", "Let me explain".
- Prose is allowed **only** where reasoning genuinely connects — a trade-off, a root cause, a disagreement. Then keep it to 2–3 sentences.
- Bad news, risks and failures still get said plainly. Short does not mean softened.
- Complex task genuinely needing structure? More space is fine. But default to terse.

## Project notes

- Static site, no framework. Pages are **generated** — never hand-edit `*.html` at the root.
- `build/source.html` is the source of truth. `build/split.py` builds the desktop site.
- `build/ios_build.py` builds the iOS-style variant (branch `interface-skills`).
- Re-run the builder after editing `assets/*.css` or `assets/*.js`, or the pages go stale.
- `main` is deployed to GitHub Pages. Pushing to it publishes.
