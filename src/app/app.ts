import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './shared/navbar/navbar';
import {Footer} from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('myfrontend');
}
