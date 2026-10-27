/**
 * After `build-angular`: files served next to the prerendered pages.
 *
 * - `404.html` — the English 404 page for static servers with a single 404 file (`yarn serve`);
 *   nginx serves each locale's own `404/index.html`.
 */
import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '../..');
const BROWSER = join(ROOT, 'dist/apps/site/browser');

copyFileSync(join(BROWSER, '404/index.html'), join(BROWSER, '404.html'));

console.log('postbuild: 404.html');
