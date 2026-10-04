import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const root = resolve('dist');
let server;
let browser;
let origin;
const errors = [];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.gif': 'image/gif', '.ttf': 'font/ttf' };

before(async () => {
  server = createServer(async (req, res) => {
    try {
      const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const path = resolve(root, `.${requested.replace(/^\/sawer-website\//, '/')}${requested.endsWith('/') ? 'index.html' : ''}`);
      if (!path.startsWith(root + '/')) {
        // Windows uses backslashes; resolve the relative boundary separately.
        if (!path.startsWith(root + '\\')) throw new Error('Outside site root');
      }
      await stat(path);
      res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' });
      res.end(await readFile(path));
    } catch {
      res.writeHead(404); res.end('Not found');
    }
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined, headless: true });
});

after(async () => { await browser?.close(); await new Promise((done) => server?.close(done)); });

async function openPage(width = 1440, height = 1000, subpath = '/') {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}${subpath}`);
  await page.evaluate(() => document.fonts.ready);
  if (await page.locator('.app-screenshot').count()) await page.locator('.app-screenshot').evaluate(img => img.decode());
  return page;
}

test('gallery, demo, lightbox, keyboard dismissal, and download destinations', async () => {
  const page = await openPage();
  assert.match(await page.title(), /Sawer/);
  await page.getByRole('button', { name: 'After hours', exact: true }).click();
  assert.match(await page.locator('.app-screenshot').getAttribute('src'), /canvas-dark/);
  await page.locator('.app-screenshot').evaluate(img => img.decode());
  await page.getByRole('button', { name: 'Enlarge screenshot' }).click();
  assert.equal(await page.locator('dialog').evaluate(dialog => dialog.open), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').evaluate(dialog => dialog.open), false);
  await page.getByRole('button', { name: 'Watch it in action' }).click();
  assert.match(await page.locator('.app-screenshot').getAttribute('src'), /demo.gif/);
  await page.getByRole('button', { name: 'Stop demo' }).click();
  assert.match(await page.locator('.app-screenshot').getAttribute('src'), /canvas-dark/);
  await page.getByRole('button', { name: 'A closer look', exact: true }).click();
  await page.locator('.app-screenshot').evaluate(img => img.decode());
  for (const platform of ['Windows', 'Linux']) {
    assert.equal(await page.getByRole('link', { name: new RegExp(`Download for ${platform}`) }).getAttribute('href'), 'https://github.com/SeifKaroui/sawer/releases/latest');
  }
  await page.close();
});

test('mobile widths remain within the viewport and all images load', async () => {
  for (const width of [320, 375, 768, 1440]) {
    const page = await openPage(width, 900);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow at ${width}px`);
    assert.equal(await page.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)), true);
    if (process.env.SITE_SCREENSHOT_DIR && [375, 1440].includes(width)) {
      await mkdir(process.env.SITE_SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({ path: resolve(process.env.SITE_SCREENSHOT_DIR, `sawer-website-${width}.png`), fullPage: true });
    }
    await page.close();
  }
});

test('production assets load under a GitHub Pages repository subdirectory', async () => {
  const page = await openPage(1440, 1000, '/sawer-website/');
  await page.getByRole('button', { name: 'After hours', exact: true }).click();
  await page.locator('.app-screenshot').evaluate(img => img.decode());
  assert.match(await page.locator('.app-screenshot').evaluate(img => img.currentSrc), /\/sawer-website\/images\/canvas-dark/);
  assert.deepEqual(errors, []);
  await page.close();
});

test('docs are reachable from the showcase and link back to downloads', async () => {
  const page = await openPage();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Docs', exact: true }).click();
  await page.waitForURL('**/docs.html');
  assert.match(await page.title(), /Sawer Docs/);
  assert.equal(await page.getByRole('heading', { name: 'Built to feel fast.', exact: true }).count(), 1);
  assert.equal(await page.getByRole('heading', { name: 'One board. One file.', exact: true }).count(), 1);
  assert.equal(await page.getByRole('heading', { name: 'Where things live.', exact: true }).count(), 1);
  assert.equal(await page.getByRole('heading', { name: 'Keyboard & mouse controls.', exact: true }).count(), 1);
  assert.match(await page.locator('.docs-content').innerText(), /%APPDATA%\\Sawer\\Sawer/);
  assert.match(await page.locator('.docs-content').innerText(), /XDG_DATA_HOME/);
  await page.getByRole('navigation', { name: 'Documentation sections' }).getByRole('link', { name: /Keyboard & mouse/ }).click();
  assert.match(page.url(), /#controls$/);
  assert.equal(await page.locator('kbd').filter({ hasText: 'Ctrl + Shift + S' }).count(), 1);
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Get Sawer' }).click();
  await page.waitForURL('**/#download');
  assert.equal(await page.getByRole('heading', { name: 'Make room for your next idea.' }).count(), 1);
  await page.close();
});

test('docs direct links, local anchors, and mobile tables work under a Pages subdirectory', async () => {
  for (const width of [320, 375, 768, 1440]) {
    const page = await openPage(width, 1000, '/sawer-website/docs.html#storage');
    assert.match(await page.title(), /Sawer Docs/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Docs overflow at ${width}px`);
    assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Docs', exact: true }).isVisible(), true);
    assert.equal(await page.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)), true);
    if (width === 320) {
      const table = page.getByRole('region', { name: 'Draw & navigate shortcuts' });
      await table.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() => document.querySelector('[aria-label="Draw & navigate shortcuts"]').scrollLeft > 0, null, { timeout: 3000 });
      assert.equal(await table.evaluate(element => element.scrollLeft > 0), true);
    }
    if (process.env.SITE_SCREENSHOT_DIR && [375, 1440].includes(width)) {
      await mkdir(process.env.SITE_SCREENSHOT_DIR, { recursive: true });
      await page.goto(`${origin}/sawer-website/docs.html`);
      await page.screenshot({ path: resolve(process.env.SITE_SCREENSHOT_DIR, `sawer-docs-${width}.png`), fullPage: true });
    }
    await page.getByRole('link', { name: 'Sawer home', exact: true }).click();
    await page.waitForURL('**/sawer-website/');
    await page.locator('.app-screenshot').evaluate(img => img.decode());
    await page.close();
  }
  assert.deepEqual(errors, []);
});

test('field guide follows scrolling, anchor links, and direct deep links', async () => {
  const page = await openPage(1440, 900, '/docs.html');
  const currentGuide = page.locator('nav[aria-label="Documentation sections"] a[aria-current="location"]');
  assert.equal(await currentGuide.getAttribute('href'), '#performance');
  assert.equal(await page.locator('#getting-started, .docs-meta').count(), 0);
  assert.doesNotMatch(await page.locator('footer').innerText(), /Made by/);

  // Wheel through each boundary without clicking an anchor or changing the URL.
  for (const id of ['portable-files', 'storage', 'controls']) {
    const distance = await page.locator(`#${id}`).evaluate(element => element.getBoundingClientRect().top - 80);
    await page.mouse.wheel(0, distance);
    await page.waitForFunction(expected => document.querySelector('nav[aria-label="Documentation sections"] a[aria-current="location"]')?.getAttribute('href') === `#${expected}`, id);
    assert.equal(await currentGuide.getAttribute('href'), `#${id}`);
    assert.equal(await currentGuide.count(), 1);
    assert.equal(new URL(page.url()).hash, '');
  }
  await page.mouse.wheel(0, -100000);
  await page.waitForFunction(() => document.querySelector('nav[aria-label="Documentation sections"] a[aria-current="location"]')?.getAttribute('href') === '#performance');
  await page.getByRole('navigation', { name: 'Documentation sections' }).getByRole('link', { name: /Where things live/ }).click();
  await page.waitForFunction(() => document.querySelector('nav[aria-label="Documentation sections"] a[aria-current="location"]')?.getAttribute('href') === '#storage');
  await page.goto(`${origin}/sawer-website/docs.html#portable-files`);
  await page.waitForFunction(() => document.querySelector('nav[aria-label="Documentation sections"] a[aria-current="location"]')?.getAttribute('href') === '#portable-files');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.getByRole('navigation', { name: 'Documentation sections' }).getByRole('link', { name: /Keyboard & mouse/ }).click();
  await page.waitForFunction(() => document.querySelector('nav[aria-label="Documentation sections"] a[aria-current="location"]')?.getAttribute('href') === '#controls');
  assert.equal(await currentGuide.count(), 1);
  await page.close();
});
