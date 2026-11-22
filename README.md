# Rilatu

**Proof should travel.**

Rilatu helps freelancers build a traceable work history. It connects the original agreement, invoice and payment, shows which claim each record supports and lists what a recipient may still ask for.

## How it works

**Choose → Inspect → Review.** The freelancer chooses a purpose: an income summary, a rental application or residency preparation. Rilatu shows the three source records behind it, explains what each one establishes and prepares a review with the open items and the next step. The evidence trail links every claim to its source, and the review exports as JSON.

## Site

[Rilatu on GitHub Pages](https://dokarpov.github.io/rilatu/) walks through one work story: a €3,200 retainer, the April invoice and the matching payment.

The **rilatu.** wordmark is a path-based [SVG](rilatu-logo.svg), with a letter-derived [favicon](favicon.svg) and an [Open Graph image](og-cover.svg).

## Development

- `index.html`, `styles.css`, `script.js`, `film.js`: product narrative, animated walkthrough and the three-step guided review.
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) and [MOTION.md](MOTION.md): visual and animation decisions.
- `tests/site_check.py` and `tests/responsive.spec.js`: structural checks and Chromium tests from 320 to 1920 px.

Local preview: `python3 -m http.server 8765`, then open `http://127.0.0.1:8765/`.

Checks: `python3 tests/site_check.py`. For browser tests, install Playwright, serve the root on 8765 and run `npx playwright test tests/responsive.spec.js`.
