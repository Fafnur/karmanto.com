import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'km-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  host: { class: 'flex min-h-screen flex-col' },
})
export class App {}
