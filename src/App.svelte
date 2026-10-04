<script>
  import Icon from './Icon.svelte';
  import Docs from './Docs.svelte';
  import { github, releases, screenshots } from './content.js';

  const isDocs = window.location.pathname.endsWith('/docs.html');
  const homeHref = isDocs ? './' : '#top';
  const canvasHref = isDocs ? './#canvas' : '#canvas';
  const downloadHref = isDocs ? './#download' : '#download';

  let activeScreenshot = $state(0);
  let demoPlaying = $state(false);
  /** @type {HTMLDialogElement | undefined} */
  let lightbox = $state();
  const selected = $derived(screenshots[activeScreenshot]);
  const asset = (/** @type {string} */ path) => `${import.meta.env.BASE_URL}${path}`;

  function selectScreenshot(/** @type {number} */ index) {
    activeScreenshot = index;
    demoPlaying = false;
  }

  function closeOnBackdrop(/** @type {MouseEvent} */ event) {
    if (event.target === lightbox) lightbox?.close();
  }
</script>

<svelte:head>
  {#if !isDocs}<link rel="preload" as="image" href={asset(screenshots[0].src)} />{/if}
</svelte:head>

<a class="skip-link" href="#main">Skip to content</a>

<header class="site-header" id="top">
  <a class="brand" href={homeHref} aria-label="Sawer home">
    <img src={asset('images/logo.webp')} alt="" width="37" height="37" />
    <span>sawer<span class="brand-dot">.</span></span>
  </a>
  <nav aria-label="Main navigation">
    <a class="nav-text" href={canvasHref}>A look inside</a>
    <a class="nav-text docs-nav" class:current={isDocs} aria-current={isDocs ? 'page' : undefined} href="./docs.html">Docs</a>
    <a class="nav-text github-nav" href={github}><Icon name="github" size={17} /> GitHub <Icon name="arrow" size={13} /></a>
    <a class="button button-small button-dark" href={downloadHref}>Get Sawer <Icon name="download" size={15} /></a>
  </nav>
</header>

{#if isDocs}
  <Docs />
{:else}
<main id="main">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-dots" aria-hidden="true"></div>
    <div class="hero-content">
      <h1 id="hero-title">A little room<br />for <span class="idea-word">big ideas.<svg viewBox="0 0 390 25" fill="none" aria-hidden="true"><path d="M4 16C95 2 224 4 382 11M26 22c107-12 244-9 325-3" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" /></svg></span></h1>
      <p class="hero-description">Think out loud. Sketch it out. Connect the dots.<br class="desktop-break" /> A fast, simple whiteboard that feels right at home.</p>
      <div class="hero-actions">
        <a class="button button-blue" href={downloadHref}><Icon name="download" size={19} /> Download Sawer</a>
        <a class="text-link" href={canvasHref}>Take a look around <span aria-hidden="true">↘</span></a>
      </div>
      <p class="availability"><Icon name="windows" size={14} /><Icon name="linux" size={16} /> Windows & Linux <span>·</span> No account needed</p>
    </div>
    <div class="hero-decoration decoration-circle" aria-hidden="true"></div>
    <svg class="hero-decoration decoration-squiggle" width="96" height="85" viewBox="0 0 96 85" fill="none" aria-hidden="true"><path d="M12 50c19-27 29-21 29-5S18 67 22 52s32-29 46-21-12 39-23 35 10-26 38-7" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" /></svg>
    <svg class="hero-decoration decoration-star" width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true"><path d="m21 2 2 14 13-7-9 12 13 4-15 1 1 14-7-12-11 9 6-13-13-3 14-4L9 5l10 11 2-14Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" /></svg>
  </section>

  <section class="showcase" id="canvas" aria-label="Sawer screenshots">
    <div class="showcase-topline">
      <span class="eyebrow"><span class="tiny-cross" aria-hidden="true">✳</span> YOUR NEXT IDEA STARTS HERE</span>
      <div class="screenshot-tabs" role="group" aria-label="Choose a screenshot">
        {#each screenshots as screenshot, index}
          <button class:active={activeScreenshot === index && !demoPlaying} aria-pressed={activeScreenshot === index && !demoPlaying} onclick={() => selectScreenshot(index)}>{screenshot.label}</button>
        {/each}
      </div>
    </div>
    <div class="app-frame">
      <img class="app-screenshot" src={asset(demoPlaying ? 'images/demo.gif' : selected.src)} alt={demoPlaying ? 'Recorded Sawer demo showing freehand drawing, shapes, and board navigation.' : selected.alt} width="1282" height="752" fetchpriority="high" />
      {#if !demoPlaying}
        <button class="expand-button" aria-label="Enlarge screenshot" onclick={() => lightbox?.showModal()}><Icon name="expand" size={19} /></button>
      {/if}
    </div>
    <div class="showcase-bottomline">
      <p><span class="caption-dot"></span>{demoPlaying ? 'A real look at drawing and navigating in Sawer.' : selected.caption}</p>
      <button class="demo-button" aria-pressed={demoPlaying} onclick={() => demoPlaying = !demoPlaying}><Icon name={demoPlaying ? 'pause' : 'play'} size={15} /> {demoPlaying ? 'Stop demo' : 'Watch it in action'}</button>
    </div>
  </section>

  <section class="features" aria-labelledby="features-title">
    <div class="section-heading">
      <div><p class="eyebrow">LESS FRICTION. MORE FLOW.</p><h2 id="features-title">Just you and your ideas.</h2></div>
      <p>All the essentials.<br />A little space to breathe.</p>
    </div>
    <div class="feature-grid">
      <article><div class="feature-icon"><Icon name="pencil" size={22} /></div><h3>Simple by design.</h3><p>A pencil, lines, and shapes. A quiet interface that gives your thinking center stage.</p><span class="feature-footnote">Make your first mark.</span></article>
      <article><div class="feature-icon"><Icon name="bolt" size={22} /></div><h3>Moves at your speed.</h3><p>Native performance for smooth drawing, effortless panning, and getting closer to the details.</p><span class="feature-footnote">Keep the momentum.</span></article>
      <article><div class="feature-icon"><Icon name="offline" size={22} /></div><h3>Delightfully offline.</h3><p>No account, cloud, or telemetry. Open Sawer and get to work, wherever you happen to be.</p><span class="feature-footnote">Your focus stays yours.</span></article>
      <article><div class="feature-icon"><Icon name="file" size={22} /></div><h3>Your board. Your file.</h3><p>One portable <code>.sawer</code> file per board. Save it anywhere. Move it, back it up, or share it.</p><span class="feature-footnote">Nothing tied to a service.</span></article>
    </div>
  </section>

  <section class="download-section" id="download" aria-labelledby="download-title">
    <div class="download-copy"><p class="eyebrow">A BLANK CANVAS IS A GOOD BEGINNING.</p><h2 id="download-title">Make room for<br />your next idea<span>.</span></h2><p>Pick your platform. Open a board.<br />See where a little scribble takes you.</p><div class="prerelease-note"><span class="status-dot"></span> Sawer is currently in prerelease.</div></div>
    <div class="download-options">
      <a class="platform-card" href={releases}><span class="platform-icon"><Icon name="windows" size={26} /></span><span><strong>Download for Windows</strong><small>Windows 10 / 11 · x64</small><span class="package-types">Installer or portable executable</span></span><Icon name="arrow" size={23} /></a>
      <a class="platform-card" href={releases}><span class="platform-icon"><Icon name="linux" size={29} /></span><span><strong>Download for Linux</strong><small>Linux · x64</small><span class="package-types">Flatpak, AppImage, or standalone binary</span></span><Icon name="arrow" size={23} /></a>
      <p class="download-help">Both links open the latest GitHub release.<br />Choose your platform’s package under <strong>Assets</strong>.</p>
    </div>
    <svg class="download-doodle" width="145" height="70" viewBox="0 0 145 70" fill="none" aria-hidden="true"><path d="M4 47c20-35 54-35 60-18s-31 30-30 14 47-16 102-2m-16-13 16 13-21 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
  </section>
</main>
{/if}

<footer>
  <a class="brand footer-brand" href={homeHref}><img src={asset('images/logo.webp')} alt="" width="29" height="29" /><span>sawer<span class="brand-dot">.</span></span></a>
  <p>A small app for the things on your mind.</p>
  <div><a href="./docs.html">Docs</a><a href={github}>GitHub <Icon name="arrow" size={13} /></a><a href={`${github}/issues`}>Feedback <Icon name="arrow" size={13} /></a></div>
</footer>

{#if !isDocs}
<dialog bind:this={lightbox} class="lightbox" onclick={closeOnBackdrop} onkeydown={(event) => { if (event.key === 'Escape') lightbox?.close(); }} aria-label="Enlarged Sawer screenshot">
  <div class="lightbox-content"><button class="lightbox-close" aria-label="Close screenshot" onclick={() => lightbox?.close()}><Icon name="close" size={22} /></button><img src={asset(selected.src)} alt={selected.alt} width="1282" height="752" /><p>{selected.caption}</p></div>
</dialog>
{/if}
