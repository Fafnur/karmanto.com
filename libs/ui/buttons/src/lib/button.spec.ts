import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Button, ButtonVariant } from './button';

@Component({
  imports: [Button],
  template: `<a kmButton href="/support/" [variant]="$variant()">Support</a>`,
})
class TestHost {
  readonly $variant = signal<ButtonVariant>('primary');
}

describe('Button', () => {
  it('keeps static classes and switches variant classes', async () => {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');

    expect(link.classList).toContain('rounded-button');
    expect(link.classList).toContain('is-primary');
    expect(link.classList).toContain('bg-primary');

    fixture.componentInstance.$variant.set('ghost');
    await fixture.whenStable();

    expect(link.classList).toContain('rounded-button');
    expect(link.classList).toContain('is-ghost');
    expect(link.classList).not.toContain('bg-primary');
  });
});
