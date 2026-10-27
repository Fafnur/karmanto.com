import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '@karmanto/ui/footer';
import { Header } from '@karmanto/ui/header';
import { LanguageHint } from '@karmanto/ui/language-hint';

@Component({
  selector: 'km-root',
  imports: [RouterOutlet, Header, Footer, LanguageHint],
  templateUrl: './app.html',
  host: { class: 'flex min-h-screen flex-col' },
})
export class App {}
