/**
 * nginx serves `/privacy/index.html` at `/privacy/` and redirects `/privacy` there (301). The router keeps URLs
 * without the slash (`router.url` is `/privacy`); `TrailingSlashPathLocationStrategy` adds it to links and the address
 * bar, these helpers — to URLs built by hand.
 */
export function addTrailingSlash(url: string): string {
  const [, path, rest] = /^([^?#]*)(.*)$/.exec(url) ?? ['', url, ''];

  return path.endsWith('/') ? url : `${path}/${rest}`;
}

/**
 * For `router.navigateByUrl()`: `/privacy/` would be parsed with an empty last segment that matches no route.
 */
export function removeTrailingSlash(url: string): string {
  return url.replace(/^(.+?)\/+(?=[?#]|$)/, '$1');
}
