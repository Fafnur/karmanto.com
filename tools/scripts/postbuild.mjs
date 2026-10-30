/**
 * After `build-angular`: files served next to the prerendered pages.
 *
 * - `404.html` — the English 404 page for static servers with a single 404 file (`yarn serve`);
 *   nginx serves each locale's own `404/index.html`.
 * - `sitemap.xml` — every indexable page of every locale with `xhtml:link` hreflang alternates. Built from the
 *   prerendered HTML itself (canonical, `hreflang`, `robots: noindex`), so pages, locales and the domain are never
 *   listed twice.
 * - `robots.txt` — allows everything and points to the sitemap.
 */
import { copyFileSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '../..');
const BROWSER = join(ROOT, 'dist/apps/site/browser');

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      return htmlFiles(path);
    }
    return name === 'index.html' ? [path] : [];
  });
}

function attribute(tag, name) {
  return new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
}

function escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

copyFileSync(join(BROWSER, '404/index.html'), join(BROWSER, '404.html'));

const pages = [];
for (const file of htmlFiles(BROWSER)) {
  const head = readFileSync(file, 'utf8').split('</head>')[0];
  if (/<meta name="robots" content="[^"]*noindex/.test(head)) {
    continue;
  }

  const links = head.match(/<link [^>]*>/g) ?? [];
  const canonical = links.map((tag) => attribute(tag, 'rel') === 'canonical' && attribute(tag, 'href')).find(Boolean);
  if (!canonical) {
    throw new Error(`${relative(ROOT, file)}: no canonical link — every indexable page must have one`);
  }
  const alternates = links
    .filter((tag) => attribute(tag, 'rel') === 'alternate' && attribute(tag, 'hreflang'))
    .map((tag) => ({ hreflang: attribute(tag, 'hreflang'), href: attribute(tag, 'href') }));
  pages.push({ url: canonical, alternates });
}

pages.sort((a, b) => a.url.localeCompare(b.url));
const origin = new URL(pages[0].url).origin;

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...pages.map(({ url, alternates }) =>
    [
      '  <url>',
      `    <loc>${escape(url)}</loc>`,
      ...alternates.map(({ hreflang, href }) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escape(href)}"/>`),
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(BROWSER, 'sitemap.xml'), sitemap);
writeFileSync(join(BROWSER, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);

console.log(`postbuild: 404.html, sitemap.xml (${pages.length} pages), robots.txt`);
