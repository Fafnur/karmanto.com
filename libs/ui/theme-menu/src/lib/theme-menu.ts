import { CdkMenu, CdkMenuItemRadio, CdkMenuTrigger } from '@angular/cdk/menu';
import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ThemeMode, ThemeService } from './theme.service';

interface Option {
  readonly mode: ThemeMode;
  readonly label: string;
}

/**
 * Theme switcher: the system one (the default), light or dark. The button icon follows the class on `<html>`, so it is
 * right before hydration too.
 */
@Component({
  selector: 'km-theme-menu',
  imports: [NgTemplateOutlet, CdkMenuTrigger, CdkMenu, CdkMenuItemRadio],
  templateUrl: './theme-menu.html',
})
export class ThemeMenu {
  protected readonly theme = inject(ThemeService);

  // Names as in the app's settings.
  protected readonly options: Option[] = [
    { mode: 'system', label: $localize`:Theme menu|Theme that follows the device settings, as in the app settings:System` },
    { mode: 'light', label: $localize`:Theme menu|Light theme, as in the app settings:Light` },
    { mode: 'dark', label: $localize`:Theme menu|Dark theme, as in the app settings:Dark` },
  ];

  onSelect(mode: ThemeMode): void {
    this.theme.set(mode);
  }
}
