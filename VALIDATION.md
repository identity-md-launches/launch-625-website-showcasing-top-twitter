# Validation and Better Interface review

**Complete for the stated scope.** This is the worker’s evidence record, not an independent certification. The final static export is `dist/`; source, package manifest and lockfile accompany it.

## Scope and assumptions

One responsive English reading room showcasing exactly the seven supplied X links. Original titles and excerpts were looked up before implementation. Article/post/thread labels describe the source formats; “top” is implemented as an editorial selection, without fabricated rankings or live metrics. “Armed with AI” is illustrated by three Pepe-inspired agents equipped with terminals/headsets and a shared AI workspace. No wallet, backend, account or payment flow was requested.

Reviewed flows: collection navigation, external read destinations, article/post filters, search and recovery, sort, saved reads, reload persistence, motion controls, reduced motion, and failed-video fallback. All runtime images, font, script, styles and video are local.

## Actual commands and results

The worker used dependencies under `/tmp/imd-dependencies` and a compatible preinstalled Chromium binary:

```sh
IMD_DEPENDENCY_ROOT=/tmp/imd-dependencies npm run typecheck
IMD_DEPENDENCY_ROOT=/tmp/imd-dependencies npm run build
IMD_DEPENDENCY_ROOT=/tmp/imd-dependencies \
IMD_CHROMIUM_PATH=/opt/ms-playwright/chromium-1246/chrome-linux64/chrome \
npm run check
npm audit --json --cache /tmp/imd-npm-cache
```

- **Typecheck:** exit 0, strict TypeScript, no emit.
- **Production build:** exit 0, three bundled assets plus copied local media and `dist/index.html`. The generated entry and stylesheet/font URLs are relative.
- **Interaction/render check:** exit 0; **18 check groups passed**. See `docs/validation/check-results.json` for the actual timestamp and result list.
- **Dependency audit:** zero known vulnerabilities after updating the build/media dependencies. The audited lockfile has no Vite dependency; esbuild is the production bundler.
- **Preview mechanism:** one foreground check process owns its HTTP server and Playwright browser and closes both. The production export was served under `/preview/`. The browser connector could not launch because its configured executable was absent; the existing `/opt/ms-playwright` browser was used through Playwright instead.

The first Vite build stalled during transformation; it was replaced with a working esbuild runner. An initial accessibility-check harness needed an explicit browser context; that harness issue was fixed. Normal browser-cancelled requests (`net::ERR_ABORTED`) are excluded from resource-failure reporting. The deliberate media-error test separately blocks the MP4, verifies the poster state, restores the route, then reloads before final console/resource assertions.

## Coverage of all six domains

| Domain | Coverage and evidence | Remaining limitations |
| --- | --- | --- |
| Accessibility | **Checked.** Native landmarks, headings, links and buttons; named search/sort/save controls; `aria-pressed`, polite status updates, visible focus. Keyboard skip link, Enter and Space activation tested. Reduced motion and media error tested. Axe: **0 violations**, **27 passing rules**. | No screen-reader session, physical touch device, browser-native zoom, or forced-colors rendering test. Axe is not full accessibility certification. |
| Layout | **Checked.** Full-page screenshots and overflow assertions at **1440×1050**, **768×900**, **390×900**, **320×900**. Three/two/one-column reflow, mobile hero, card wrapping and reachable controls inspected. | No RTL/localization variant exists. Intermediate widths beyond these samples were source-reviewed, not exhaustively rendered. |
| Writing | **Checked.** Attributed source quotes; clear “Read … on X”, save/unsave, pause/play, clear search and empty recovery; independent-site description; local-save limitation. No fake engagement figures. | External sources can change or require X authentication; their opinions were not independently verified. |
| Typography | **Checked.** Local Space Grotesk loaded in Chromium; hierarchy, heading/quote wrapping, metadata, and 16px narrow-screen inputs inspected. 200% root font enlargement had no page overflow. Small excerpt text was increased. | Root-text enlargement is **not** native 200% browser zoom. Native font rendering in other platforms is untested. |
| Colors | **Checked.** Semantic tokens, solid rendered foreground/background pairs measured; results below. Text remains readable in inspected screenshots. Selected filters also expose pressed state; saved icons fill. | Axe could not determine backgrounds for `.scene-label` and decorative `.hero-coordinate` over the video. Their all-frame contrast is **not verified**. No alternate theme exists. |
| UI details | **Checked.** Default, selected, saved, focus, empty and media-error states; poster/loop; pause/play; responsive card arrangements. Hover is guarded by device capability; animations by motion preference. Source timings are 150ms. | Hover/pressed animation was not replayed at 10% speed. Safari, Firefox and native mobile playback remain untested. |

Not applicable: dialogs/focus traps, submission forms, destructive confirmations, authentication, financial transactions, localization and theme switching. These features were not added solely to satisfy a checklist.

## Findings, fixes and rechecks

| Severity / domain | Source location and evidence | Correction and recheck |
| --- | --- | --- |
| Medium / typography | `src/styles.css:710`: the initial desktop excerpt was 12px. At the rendered three-column reading layout, the quoted content was visually too small for the primary reading task. | Increased excerpts to 14px and author names/handles and read actions by one step. Rebuilt; final desktop/mobile screenshots show complete, readable quotes. |
| Medium / writing + accessibility | `src/styles.css:1163`, `src/main.tsx:428`: the visible search label was hidden at the intermediate breakpoint. The input kept its accessible name but lost its persistent visible label. | Kept the label visible at that breakpoint. Rechecked 768px layout with no overflow. |
| Low / layout | `src/styles.css:1114`: the tablet hero initially extended 190px beyond the right edge and cut off much of the right-hand agent. | Reduced that extension to 75px. Rebuilt and inspected the 768px screenshot; the main illustration is better contained. |
| Medium / writing | `src/main.tsx:282`: the original byline read “by identity.md”, which could imply official authorship despite the independent curation. | Changed it to “on identity.md”; the about section explicitly identifies an independent reading room. Final screenshot checked. |

Accessibility and motion controls were implemented during construction: `src/main.tsx:89` handles reduced motion and failure; `src/main.tsx:149` keeps save and outbound links separate; `src/main.tsx:257` handles unavailable storage without crashing; `src/styles.css:121` defines keyboard focus. These are implemented controls, not claims that a previously observed defect existed.

No known primary-interaction or responsive-layout blocker remains.

## Measured solid contrast pairs

The check reads computed CSS foreground and actual opaque ancestor backgrounds in Chromium, then calculates WCAG sRGB relative luminance. It does not infer contrast through the video.

| Pair | Ratio |
| --- | ---: |
| Page text `#f0f1e8` on `#0b2018` | **14.95:1** |
| Excerpt/secondary text `#b0bfb0` on card `#112a20` | **7.94:1** |
| Primary button text `#0b2018` on `#c2f970` | **13.84:1** |
| Focus ring `#f0f1e8` against page `#0b2018` | **14.95:1** |

Raw measurements: `docs/validation/contrast.json`. The keyboard screenshot visibly confirms the filter’s focus perimeter; this does not establish every possible focus/background combination.

## Evidence and retained limitations

- `docs/validation/desktop.jpg`: 1440px complete page.
- `docs/validation/tablet.jpg`: 768px complete page.
- `docs/validation/mobile.jpg`: 390px complete page.
- `docs/validation/mobile-320.jpg`: 320px complete page.
- `docs/validation/keyboard-focus.jpg`: actual keyboard-focused filter state.
- `docs/validation/accessibility.json`: automated violations, incomplete contrast cases and pass count.
- `docs/validation/check-results.json`: 18 successful check groups, no final console errors or failed resources.

The final screenshots were visually inspected, including cropped 1:1 hero views at desktop and 320px. Checks verify the seven outbound URLs exactly but do not automate X login or claim each original article is publicly readable without authentication. Saves persist only in the current browser; blocked storage falls back to session state (source-reviewed, not simulated in this run).

## Submission integrity

All dependencies, caches and temporary scripts stayed outside the task repository. No `.git/`, `.github/`, `.env`, `node_modules/` or ignore file was created or modified. The worker did not run Git mutation commands. All deliverable source and export files are ordinary files, not submodules. Runtime media is compact, with a roughly 132 KiB video; no vendored registry, dependency archives or debug builds are included.

The environment excludes `artifacts/` from Git by an existing rule. Captured review evidence is therefore also retained under the ordinary, unignored `docs/validation/` path, without changing that rule. The renderer source contains the complete original scene, so the ignored generated SVG is not a build dependency.

Final inventory before this line: **62 files, 3,050,228 uncompressed bytes**, below the **8,388,608-byte** bundle ceiling even before compression. No prohibited dependency directories or symlinks appeared in the inventory.
