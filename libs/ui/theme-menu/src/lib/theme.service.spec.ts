import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { LocalStorage } from '@karmanto/core';

import { THEME_COLORS, THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  let document: Document;

  beforeEach(() => {
    localStorage.clear();
    document = TestBed.inject(DOCUMENT);
    document.documentElement.className = '';
  });

  it('follows the system by default', () => {
    expect(TestBed.inject(ThemeService).$mode()).toBe('system');
  });

  it('restores the stored mode and ignores unknown values', () => {
    TestBed.inject(LocalStorage).setItem(THEME_STORAGE_KEY, 'dark');
    expect(TestBed.inject(ThemeService).$mode()).toBe('dark');

    TestBed.resetTestingModule();
    TestBed.inject(LocalStorage).setItem(THEME_STORAGE_KEY, 'sepia');
    expect(TestBed.inject(ThemeService).$mode()).toBe('system');
  });

  it('sets the class on <html>, stores the mode and updates theme-color', () => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
    const theme = TestBed.inject(ThemeService);

    theme.set('dark');
    expect(document.documentElement.classList.contains('theme-dark')).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(meta.getAttribute('content')).toBe(THEME_COLORS.dark);

    theme.set('light');
    expect(document.documentElement.classList.contains('theme-dark')).toBe(false);
    expect(document.documentElement.classList.contains('theme-light')).toBe(true);
    expect(meta.getAttribute('content')).toBe(THEME_COLORS.light);

    theme.set('system');
    expect(document.documentElement.className).toBe('');
    expect(theme.$mode()).toBe('system');
    meta.remove();
  });
});
