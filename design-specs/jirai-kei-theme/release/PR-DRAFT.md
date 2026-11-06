# Draft only — do not open yet

Proposed upstream: https://github.com/Map1en/VRCX-0-Community-Themes

Proposed title: **Add Jirai Kei · Windose Dark theme**

## Summary

Adds one self-contained dark jirai-kei theme with pink Win98-style window chrome, pixel controls and icon glyphs, decorative lace/hearts, and photo-corner charms. Includes consistent entity-dialog title bars and the AI assistant header clipping fix.

## Scope

Only these paths belong in the eventual PR:

- `themes/jirai-kei-theme/theme.css`
- `themes/jirai-kei-theme/theme.json`
- `themes/jirai-kei-theme/README.md`
- `themes/jirai-kei-theme/preview.webp`
- `themes/index.json` (one theme ID added)
- `README.md` (one maintained-theme link added)

No application source, development fixtures, local/private screenshots, research files, or unrelated theme changes are included. The branch starts from upstream commit `bfd4bb852afd52382e730bda93cba8e2d21c430c`.

## Design and behavior

- Embedded images/fonts only; `remoteAssets: false`.
- Dark base with theme-controlled colors; `darkMode: true`, `accentMode: false`.
- Theme-owned motion respects reduced-motion/reduced-effects preferences.
- Existing application actions and recovery controls remain available.
- The preview uses a synthetic layout with fictional data, not actual friends or account screenshots.

## Required pre-submission work — NOT complete

1. **Artwork permissions:** the approved personal theme includes NSO/Steam/Fandom-derived artwork. Local records do not establish redistribution permission. Attribution is not a license, and these assets cannot be declared GPL-cleared simply by adding the repository license. Obtain appropriate permission or approve a separately designed replacement set before public submission.
2. **Latest upstream compatibility:** the latest upstream VRCX-0 release checked during preparation is `v2.33.0`. Existing Windows verification used a custom VRCX-0-jirai build; this is not exact-version upstream certification. Test against the latest upstream/appropriate Dev Kit and replace `testedWith: 0.0.0-unverified` only after verification.
3. **Readable CSS policy:** the candidate is a formatted assembly of modular CSS and generated embedded assets, not compiled Tailwind/application output. Upstream CONTRIBUTING disallows generated CSS; ask maintainers to confirm acceptability or provide the source form they require. Do not hide this provenance.
4. **User sign-off:** user must explicitly approve before any push or PR creation. No upstream issue, push, or PR has been created during preparation.

## Validation

- Upstream repository validator passed on the local candidate.
- Upstream validator unit tests passed.
- Complete Lucide/Feather and Fusion Pixel/Silkscreen notices have been restored inside the stylesheet; the old preview build stripped comments, so its documentation alone was insufficient.
- Readable stylesheet remains below the application's 1 MiB limit.
- Format-equivalence frozen-page report and exact package hashes are recorded alongside the local preparation artifacts.

The local package version is `1.0.0-rc.1`. Select the public version only after the above gates are resolved. This document is a working PR body, not an assertion that the PR checklist has passed.
