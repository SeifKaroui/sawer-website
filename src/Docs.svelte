<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import { github } from './content.js';

  const sections = [
    ['performance', 'Built to feel fast'],
    ['portable-files', 'One board, one file'],
    ['storage', 'Where things live'],
    ['controls', 'Keyboard & mouse'],
  ];
  let activeSection = $state('performance');

  onMount(() => {
    const targets = sections.map(([id]) => document.getElementById(id));
    let frame = 0;

    function updateSection() {
      frame = 0;
      const marker = Math.min(160, window.innerHeight * 0.22);
      let current = sections[0][0];
      for (const target of targets) {
        if (target && target.getBoundingClientRect().top <= marker) current = target.id;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1][0];
      }
      activeSection = current;
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateSection);
    }

    updateSection();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  });

  const stack = [
    ['C++20', 'Native application and document model.'],
    ['SDL3', 'Windowing, input, and platform integration.'],
    ['SDL GPU', 'Direct3D 12 on Windows; Vulkan on Linux.'],
    ['Custom UI · SDL_ttf · FreeType', 'GPU-drawn interface and embedded Inter fonts.'],
    ['nlohmann/json · CBOR', 'Structured data inside portable board files.'],
    ['Meson · Ninja', 'Native builds with pinned dependencies.'],
  ];

  const shortcuts = [
    { title: 'Draw & navigate', rows: [
      ['Draw with the current tool', 'Left-drag'],
      ['Pencil / line / rectangle / ellipse', 'P / L / R / E'],
      ['Selection / hand tool', 'V / H'],
      ['Pan the canvas', 'Middle-drag / Space + left-drag / Hand tool'],
      ['Zoom toward the cursor', 'Mouse wheel'],
      ['Reset zoom to 100%', 'Ctrl + 0'],
      ['Constrain angles or proportions', 'Hold Shift while drawing'],
      ['Toggle shape fill', 'F'],
      ['Choose a preset color', '1–7'],
      ['Decrease / increase stroke width', '[ / ]'],
    ] },
    { title: 'Select & edit', rows: [
      ['Move an object / resize a shape', 'Drag selection / Drag handles'],
      ['Select all', 'Ctrl + A'],
      ['Nudge a selection', 'Arrow keys'],
      ['Nudge by a larger step', 'Shift + arrow keys'],
      ['Copy / cut / paste', 'Ctrl + C / Ctrl + X / Ctrl + V'],
      ['Duplicate the selection', 'Ctrl + D'],
      ['Delete the selection', 'Delete'],
      ['Undo', 'Ctrl + Z'],
      ['Redo', 'Ctrl + Shift + Z / Ctrl + Y'],
      ['Cancel the current action', 'Escape'],
    ] },
    { title: 'Files & appearance', rows: [
      ['New board', 'Ctrl + N'],
      ['Open a board', 'Ctrl + O'],
      ['Save', 'Ctrl + S'],
      ['Save As', 'Ctrl + Shift + S'],
      ['Rename the board', 'F2'],
      ['Switch light / dark theme', 'T'],
    ] },
  ];
</script>

<div class="docs-layout">
  <aside class="docs-sidebar">
    <a class="docs-back" href="./"><span aria-hidden="true">←</span> Back to Sawer</a>
    <p class="eyebrow">THE FIELD GUIDE</p>
    <nav aria-label="Documentation sections">
      {#each sections as [id, label], index}
        <a href={`#${id}`} class:active={activeSection === id} aria-current={activeSection === id ? 'location' : undefined}><span class="toc-number">0{index + 1}</span>{label}</a>
      {/each}
    </nav>
  </aside>

  <main id="main" class="docs-content">
    <div class="docs-intro">
      <p class="eyebrow">SAWER / DOCUMENTATION</p>
      <h1>A little guide.<br /><span>The essentials.</span></h1>
      <p>The native stack, your files, and the controls.</p>
    </div>

    <section id="performance" class="docs-section" aria-labelledby="performance-heading">
      <div class="docs-section-label"><span>01</span> PERFORMANCE</div>
      <h2 id="performance-heading">Built to feel fast.</h2>
      <p>Sawer is a native C++ application. Its renderer draws vector geometry and the interface through SDL GPU.</p>
      <div class="performance-points">
        <article><strong>Cached geometry.</strong><p>Finished strokes and GPU meshes are reused when you pan.</p></article>
        <article><strong>Visible objects first.</strong><p>A spatial index finds what is near the viewport.</p></article>
        <article><strong>Procedural grid.</strong><p>The background is drawn without a board-sized texture.</p></article>
        <article><strong>Background I/O.</strong><p>Saving and large-board loading run in the background.</p></article>
      </div>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable tables need keyboard focus for horizontal navigation.) -->
      <div class="docs-table-wrap" role="region" aria-label="Sawer technology stack" tabindex="0">
        <table class="stack-table"><thead><tr><th scope="col">Technology</th><th scope="col">Purpose</th></tr></thead><tbody>{#each stack as [technology, purpose]}<tr><th scope="row">{technology}</th><td>{purpose}</td></tr>{/each}</tbody></table>
      </div>
      <p class="docs-small"><a href={`${github}/blob/main/docs/rendering-performance.md`}>Rendering details & measurements <Icon name="arrow" size={12} /></a></p>
    </section>

    <section id="portable-files" class="docs-section" aria-labelledby="portable-heading">
      <div class="docs-section-label"><span>02</span> PORTABLE FILES</div>
      <h2 id="portable-heading">One board. One file.</h2>
      <p>A <code>.sawer</code> file contains your shapes, strokes, styles, and pasted images. Copy, back up, or share that single file, and open it in a compatible Sawer version on Windows or Linux.</p>
      <div class="portable-file-card"><div class="portable-file-icon"><Icon name="file" size={30} /></div><div><strong>My next idea.sawer</strong><p>Your entire board, in one file.</p></div><span class="file-extension">.sawer</span></div>
      <p>Save it in any folder you choose. Close the board before moving its file. Preferences and preview caches are not needed to reopen it.</p>
      <p class="docs-small"><a href={`${github}/blob/main/docs/file-format.md`}>File-format reference <Icon name="arrow" size={12} /></a></p>
    </section>

    <section id="storage" class="docs-section" aria-labelledby="storage-heading">
      <div class="docs-section-label"><span>03</span> STORAGE</div>
      <h2 id="storage-heading">Where things live.</h2>
      <p><strong>Boards:</strong> the location you choose in Save As. Untitled boards stay in memory until saved.</p>
      <div class="storage-block"><div><Icon name="file" size={20} /><h3>App data</h3></div><dl class="storage-paths"><dt>Windows</dt><dd><code>%APPDATA%\Sawer\Sawer\</code></dd><dt>Linux</dt><dd><code>$XDG_DATA_HOME/Sawer/Sawer/</code><span>Default: ~/.local/share/Sawer/Sawer/</span></dd><dt>Flatpak</dt><dd><code>~/.var/app/io.sawer.app/data/Sawer/Sawer/</code></dd></dl></div>
      <p><code>recent-files.json</code> stores recent paths and preferences; <code>previews/</code> holds disposable thumbnails; <code>Sawer.log</code> holds local diagnostics.</p>
      <p><strong>Saving:</strong> after the first save, edits autosave roughly every second and flush on focus loss or close. Use <kbd>Ctrl + S</kbd> to save explicitly. Interrupted final writes can be recovered; external changes are preserved in a conflict copy.</p>
      <p class="docs-small">Flatpak allows Documents by default. Other board folders may need <a href={`${github}/blob/main/docs/releasing.md#flatpak-packaging-and-installation`}>folder permission <Icon name="arrow" size={12} /></a>.</p>
    </section>

    <section id="controls" class="docs-section" aria-labelledby="controls-heading">
      <div class="docs-section-label"><span>04</span> CONTROLS</div>
      <h2 id="controls-heading">Keyboard & mouse controls.</h2>
      <p>The same controls apply on Windows and Linux.</p>
      {#each shortcuts as group}
        <h3>{group.title}</h3>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable tables need keyboard focus for horizontal navigation.) -->
        <div class="docs-table-wrap" role="region" aria-label={`${group.title} shortcuts`} tabindex="0"><table class="shortcuts-table"><thead><tr><th scope="col">Action</th><th scope="col">Control</th></tr></thead><tbody>{#each group.rows as [action, control]}<tr><th scope="row">{action}</th><td>{#each control.split(' / ') as key, index}{#if index > 0}<span class="shortcut-or">/</span>{/if}<kbd>{key}</kbd>{/each}</td></tr>{/each}</tbody></table></div>
      {/each}
    </section>
  </main>
</div>
