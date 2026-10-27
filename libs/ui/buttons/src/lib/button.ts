import { computed, Directive, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'is-primary border-transparent bg-primary text-on-primary hover:bg-primary/90',
  secondary: 'is-secondary border-outline text-ink hover:border-primary',
  ghost: 'is-ghost border-transparent text-primary hover:bg-primary/10',
};

/**
 * Button styles on a native `<button>` or `<a>`: semantics and keyboard behaviour stay native.
 *
 * @usageNotes
 * ```html
 * <button kmButton type="submit">Send</button>
 * <a kmButton variant="secondary" href="/support/">Support</a>
 * ```
 */
@Directive({
  selector: 'button[kmButton], a[kmButton]',
  host: {
    class:
      'inline-flex items-center justify-center gap-2 rounded-button border px-6 py-3 text-base font-semibold leading-tight no-underline transition-colors hover:no-underline disabled:pointer-events-none disabled:opacity-50',
    '[class]': '$variantClasses()',
  },
})
export class Button {
  readonly $variant = input<ButtonVariant>('primary', { alias: 'variant' });

  protected readonly $variantClasses = computed(() => VARIANT_CLASSES[this.$variant()]);
}
