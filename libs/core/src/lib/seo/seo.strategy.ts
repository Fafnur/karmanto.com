import { DOCUMENT, inject, LOCALE_ID, Service } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { getLocale, LOCALES, localeUrl } from '../locales/locales';
import { SITE } from '../site/site';

export interface SeoRouteData {
  /** `<meta name="description">`, translated. */
  readonly description?: string;
  /** Not indexed and without canonical/hreflang (404). */
  readonly noindex?: boolean;
}

/**
 * Page metadata from the route: `title` and `data` (`SeoRouteData`) → `<title>`, description, canonical,
 * `hreflang` for every locale + `x-default`, Open Graph and Twitter Card. Runs on prerender, so crawlers get it in the HTML.
 */
@Service({ autoProvided: false })
export class SeoStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly locale = getLocale(inject(LOCALE_ID));

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    const title = pageTitle ? `${pageTitle} — ${SITE.name}` : SITE.name;
    const data = this.collectData(snapshot);
    const url = SITE.origin + localeUrl(this.locale, snapshot.url);

    this.title.setTitle(title);
    this.setName('description', data.description);
    this.setName('robots', data.noindex ? 'noindex' : undefined);

    this.setLinks(data.noindex ? [] : this.buildLinks(snapshot.url));

    this.setProperty('og:type', 'website');
    this.setProperty('og:site_name', SITE.name);
    this.setProperty('og:title', title);
    this.setProperty('og:description', data.description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', SITE.origin + SITE.ogImage);
    this.setProperty('og:image:width', '1200');
    this.setProperty('og:image:height', '630');
    this.setProperty('og:locale', this.locale.region);
    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', title);
    this.setName('twitter:description', data.description);
    this.setName('twitter:image', SITE.origin + SITE.ogImage);
  }

  private collectData(snapshot: RouterStateSnapshot): SeoRouteData {
    let route = snapshot.root;
    let data: SeoRouteData = route.data;
    while (route.firstChild) {
      route = route.firstChild;
      data = { ...data, ...route.data };
    }

    return data;
  }

  private buildLinks(url: string): Array<Record<string, string>> {
    return [
      { rel: 'canonical', href: SITE.origin + localeUrl(this.locale, url) },
      ...LOCALES.map((locale) => ({ rel: 'alternate', hreflang: locale.id, href: SITE.origin + localeUrl(locale, url) })),
      { rel: 'alternate', hreflang: 'x-default', href: SITE.origin + localeUrl(LOCALES[0], url) },
    ];
  }

  private setLinks(links: Array<Record<string, string>>): void {
    this.document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach((link) => link.remove());

    for (const attributes of links) {
      const link = this.document.createElement('link');
      Object.entries(attributes).forEach(([name, value]) => link.setAttribute(name, value));
      this.document.head.appendChild(link);
    }
  }

  private setName(name: string, content: string | undefined): void {
    if (content) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.removeTag(`name="${name}"`);
    }
  }

  private setProperty(property: string, content: string | undefined): void {
    if (content) {
      this.meta.updateTag({ property, content });
    } else {
      this.meta.removeTag(`property="${property}"`);
    }
  }
}
