# Rilatu

**Proof should travel.**

Rilatu is a **private-source** research prototype for freelancers who need a traceable work history. It connects original agreements, invoices and payments, explains what the records can support, and makes the gaps explicit. The public walkthrough uses synthetic records.

## Repository boundary

This public repository contains only the presentation website, synthetic interactive demo, visual system and website tests. Product research, pilot operations, client workflows and future application code belong in the separate private `dokarpov/rilatu-product` repository.

Do not commit real client records, internal validation material or identifiable evidence here.

## Active public demonstration

The public page currently shows an **automatically animated four-step evidence film**, not the old interactive Choose → Inspect → Review workspace. The film shows a rental evidence request, linked sample documents, the remaining proof gap and a non-certified handover. Its data is synthetic and it accepts no real documents.

The former guided workspace remains in the source behind `.rilatu-film-legacy` and is not an active product flow. Its obsolete interaction-test suite is archived; the release gate validates the actual film, responsive presentation, and reduced-motion behavior.

The approved **rilatu.** logo is stored as path-based [SVG wordmark](rilatu-logo.svg), with a matching letter-derived [favicon](favicon.svg) and [Open Graph preview](og-cover.svg). No placeholder arrow remains in the public header.

## Publication and privacy

**Public demonstration:** [Rilatu on GitHub Pages](https://dokarpov.github.io/rilatu/) is reachable without signing in as of **17 October 2026**. This repository is **public** and contains the synthetic presentation site, design materials and UI tests. The separate `rilatu-product` repository remains private.

The public demo processes no real documents or customer records.

GitHub Pages and the public repository have different exposure boundaries: shipped HTML, CSS and JavaScript are inspectable; public Git history and source files are also accessible. Don't commit real client material or secrets. If an actual secret is exposed, revoke or rotate it; a later deletion cannot erase copies, forks or caches.

For implementation checks, see [site QA](QA_REPORT.md).

## Development and quality

- `index.html`, `styles.css`, `script.js`: static product narrative and three-stage guided prototype.
- `rilatu-logo.svg`, `favicon.svg`, `og-cover.svg`: approved identity assets.
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) and [MOTION.md](MOTION.md): controlled visual and animation decisions.
- [QA_REPORT.md](QA_REPORT.md): actual CI results, public accessibility and remaining release gates.
- `tests/site_check.py`, `tests/film.spec.js` and `tests/responsive.spec.js`: structural, animated-film and Chromium tests at 320–1920px.

Local preview: `python3 -m http.server 8765`, then open `http://127.0.0.1:8765/`.

Local checks: `python3 tests/site_check.py`. For automated browser testing, install Playwright, serve the root on 8765 and run `npx playwright test tests/responsive.spec.js`.

**Stage:** research concept. Neither product-market fit nor independent proof-of-income verification has been established.
