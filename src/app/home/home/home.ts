import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  terminoBusqueda: string = '';

  private chipSeleccionado = '';

  constructor(private router: Router) {}

  buscar() {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(
        ['/peticiones'],
        { queryParams: { q: this.terminoBusqueda } }
      );
    } else {
      this.router.navigate(['/peticiones']);
    }
  }

  activeChip() {
    return this.chipSeleccionado;
  }

  setChip(chip: string) {
    this.chipSeleccionado = chip;

    this.router.navigate(
      ['/peticiones'],
      { queryParams: { category: chip } }
    );
  }
}

