# Sawer website

A small Svelte 5 + Vite showcase for [Sawer](https://github.com/SeifKaroui/sawer).
Static, responsive, and ready for GitHub Pages. No backend, analytics, or external font requests.

## Run locally

Use Node.js 24 and pnpm 11.19.0:

```sh
corepack enable
pnpm install
pnpm dev
```

## Check and build

```sh
pnpm check
pnpm build
pnpm exec playwright install chromium
pnpm test
pnpm preview
```

The production site is in `dist/`. Both the domain root and repository subdirectories work because asset URLs are relative.

Browser tests cover the screenshot gallery, demo controls, lightbox and Escape key, download destinations, mobile overflow, and loading from a GitHub Pages subdirectory. To use an existing Chromium browser instead of installing the test browser, set `BROWSER_EXECUTABLE_PATH` to its executable path.

## Publish to GitHub Pages later

1. Put this folder in its own GitHub repository with a `main` branch.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. Run **Deploy showcase to GitHub Pages** from the Actions tab, or push to `main`.

The included `.github/workflows/pages.yml` builds and deploys the site. No hosting has been activated and no repository has been created by this task.

## Content and assets

- `src/App.svelte`: layout, copy, screenshot gallery, lightbox, and demo toggle.
- `docs.html` and `src/Docs.svelte`: the separate documentation page, built as a static entry point for GitHub Pages.
- `src/docs.css`: documentation layout and responsive tables.
- `src/style.css`: responsive visual design and reduced-motion support.
- `src/content.js`: GitHub links and screenshot descriptions.
- `public/images/`: optimized real screenshots captured from the running Sawer application, its existing logo, and its existing recorded demo.
- `public/examples/`: the shape-only boards used in the screenshots. The apparent marks are vector shapes and strokes; no text tool is depicted.
- `src/assets/`: locally bundled Inter 4.1 fonts; see `public/FONT-LICENSE.txt`.

Downloads open Sawer's latest release page, so there are no version-specific download filenames to update after a release. The Windows and Linux cards tell visitors which package to pick under **Assets**.

Sawer branding and screenshots belong to the Sawer project. Inter is distributed under the SIL Open Font License 1.1.
