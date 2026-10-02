# Signal — the identity.md reading room

A green, responsive editorial showcase of the seven supplied X links. It includes four articles, two posts, one thread, local cover images and avatars, and an original six-second video of Pepes collaborating with AI tools.

Search by idea or author, filter articles/posts, sort by date, and save reads in this browser. Every card links to its original X post. The collection is curated, not a live engagement ranking. Joseph Chalom’s article is marked as wider context.

## Install and run

Requires Node.js 20.19+ (Node 24 was used) and npm.

```sh
npm ci
npm run build
npm run preview
```

Open `http://127.0.0.1:4173`. Stop with Ctrl+C. `npm run dev` watches source changes and rebuilds; refresh the browser after an edit. The existing `dist/` can also be served directly by any static HTTP server, without Node or installation on the host.

## Rebuild and check

```sh
npm run typecheck
npm run build
npx playwright install chromium
npm run check
```

`check` owns a temporary HTTP server and Chromium session, serves the **production export at `/preview/`**, checks primary interactions and accessibility, captures screenshots under `artifacts/`, and closes both processes. It does not contact X during the check. It requires an installed Chromium browser. To use an existing compatible installation, set `IMD_CHROMIUM_PATH` to its executable.

The worker kept all installed dependencies and caches under `/tmp`, outside this repository. The optional `IMD_DEPENDENCY_ROOT` variable supports that workflow; ordinary local installation needs no environment variables.

## Publish the included export

Publish the **contents of `dist/`**, including `index.html`, `favicon.svg`, `assets/` and `media/`, to static hosting, IPFS or a gateway subdirectory. There is no server routing, backend, wallet, secret configuration, or runtime API. All runtime assets are local; asset URLs are relative. Hash anchors support the collection and about sections. Use a trailing slash for the hosting directory URL.

The included export is the finished deliverable; publishing does not require a rebuild. After a source change, rebuild and include the updated `dist/` alongside source and the lockfile. Do not include dependency directories, caches, or temporary archives. No ignore file was created or changed.

## Content and media

- `src/posts.json`: attributed article titles, selected quotations, UTC source dates, local assets and the seven exact destination links.
- `src/main.tsx`: accessible native controls and React state.
- `src/styles.css`: color tokens, typography, card layouts, focus and responsive styles.
- `scripts/site.mjs`: esbuild production bundling, local preview and watch mode.
- `scripts/render-video.mjs`: original vector scene and video generation; “armed with AI” is interpreted as equipped with AI terminals and connected headsets.
- `public/media/`: source images, font, video and still poster.
- `dist/`: complete static export.
- `DESIGN.md`: final implemented design system.
- `VALIDATION.md` and `docs/validation/`: review, actual checks and captured evidence.
- `SOURCES.md`: content provenance and attribution.

To regenerate the already-included video, install `ffmpeg` on your PATH and run `npm run render-video`, then rebuild. Sharp renders the original SVG scene; FFmpeg encodes a silent H.264 MP4. The video has a visible pause/play control and remains paused under reduced-motion preferences. Its local poster is the media-error fallback.

## Actual validation

Production build and TypeScript checks passed. Chromium interaction checks passed, including filters, search/empty recovery, sorting, saved-post persistence, keyboard activation, video controls, reduced motion and media failure. The final production export was checked at 1440, 768, 390 and 320 CSS pixels with no horizontal page overflow. Axe reported zero violations across 27 passing rules; two contrast cases require human review and are described in `VALIDATION.md`. All six Better Interface domains were reviewed, and applicable findings were corrected.

The supplied browser connector could not launch its missing Chrome path. Checks instead used installed Chromium through Playwright in one bounded foreground process. Native browser 200% zoom, screen-reader sessions, physical devices, Safari and Firefox were not tested. A 200% root-text enlargement check was run; it is not equivalent to native zoom. Original X links may require login and their contents may change; outbound navigation was checked against the supplied URLs, not by logging in to X. Saves are local to this browser and do not sync.

## Attribution

The Pepe collaboration scene and Signal interface were created for this assignment. Article images and avatars belong to their original creators and remain associated with their original links. Space Grotesk is bundled under the SIL Open Font License; see `licenses/space-grotesk.txt`.

Design review used the supplied, pinned Better Interface guide by Jakub Krehel (MIT, commit `267330e1adfc66a718fb65fa6918c1f06d0a689e`). Documentation follows the included Impeccable method by Paul Bakaus (Apache-2.0, commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`). Both license texts are preserved in `licenses/design-guidance.txt`.
