// Genera un HTML por página (con su contenido y sus metadatos) a partir de dist/index.html,
// y el sitemap.xml. Se corre después de `vite build` y `vite build --ssr` (ver "build" en package.json).
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, PAGES, SITE_URL } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function swap(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender: no encontré ${pattern} en el template`);
  return html.replace(pattern, replacement);
}

for (const page of PAGES) {
  const url = SITE_URL + (page.path === '/' ? '/' : page.path);
  let html = template;
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`);
  html = swap(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(page.description)}" />`);
  html = swap(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);
  html = swap(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  html = swap(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(page.title)}" />`);
  html = swap(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(page.description)}" />`);
  if (page.schema) {
    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': page.schema });
    html = html.replace('</head>', `<script type="application/ld+json">${json}</script>\n  </head>`);
  }
  html = swap(html, /<div id="root"><\/div>/, `<div id="root">${render(page.path)}</div>`);

  const out = page.path === '/' ? path.join(dist, 'index.html') : path.join(dist, page.path.slice(1), 'index.html');
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log(`prerender: ${page.path} → ${path.relative(dist, out)}`);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(p => `  <url>
    <loc>${SITE_URL}${p.path === '/' ? '/' : p.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
await rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: sitemap.xml con ${PAGES.length} páginas`);
