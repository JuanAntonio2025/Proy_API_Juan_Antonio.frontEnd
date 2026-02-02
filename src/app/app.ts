import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RegisterComponent} from './pages/register/register';
import {LoginComponent} from './pages/login/login';
import {ProfileComponent} from './pages/profile/profile';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RegisterComponent, LoginComponent, ProfileComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('myfrontend');
}
