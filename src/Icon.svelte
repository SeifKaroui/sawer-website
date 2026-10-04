<script>
  /** @type {{name: string, size?: number}} */
  let { name, size = 20 } = $props();
  const paths = {
    arrow: 'M7 17 17 7M7 7h10v10',
    download: 'M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4',
    windows: 'M3 5l8-1v7H3V5Zm10-1 8-1v8h-8V4ZM3 13h8v7l-8-1v-6Zm10 0h8v8l-8-1v-7Z',
    linux: 'M9 9V6a3 3 0 0 1 6 0v3c0 3 4 5 4 9H5c0-4 4-6 4-9ZM9 21l-5-1 1-3m10 4 5-1-1-3M10 11l2 1 2-1',
    bolt: 'm13 2-9 12h7l-1 8 10-12h-7l1-8Z',
    pencil: 'm15 5 4 4M4 20l4-1L20 7a2 2 0 0 0-4-4L4 15v5Z',
    offline: 'M5 9a12 12 0 0 1 5-2m4 0a12 12 0 0 1 5 2M8 13a7 7 0 0 1 8 0m-5 4h2M3 3l18 18',
    file: 'M14 3H5v18h14V8l-5-5ZM14 3v5h5M8 12h8m-8 4h6',
    play: 'm9 5 11 7-11 7V5Z',
    pause: 'M8 5v14M16 5v14',
    close: 'm6 6 12 12M6 18 18 6',
    expand: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',
    github: 'M9 19c-4 1-4-2-6-2m12 5v-4a3 3 0 0 0-1-2c3 0 6-1 6-5a4 4 0 0 0-1-3 4 4 0 0 0 0-3s-1 0-3 1a11 11 0 0 0-8 0C6 5 5 5 5 5a4 4 0 0 0 0 3 4 4 0 0 0-1 3c0 4 3 5 6 5a3 3 0 0 0-1 2v4',
    check: 'm5 12 4 4L19 6',
  };
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d={paths[/** @type {keyof typeof paths} */ (name)] ?? paths.arrow} />
</svg>
