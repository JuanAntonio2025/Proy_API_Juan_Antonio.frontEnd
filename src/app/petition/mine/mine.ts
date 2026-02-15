import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetitionService } from '../../petition';
import { Petition } from '../../models/petition';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../core/config/api.config';
import { resolvePetitionImage } from '../../core/utils/image.util';

type PetitionVM = Petition & { image: string };

@Component({
  selector: 'app-mine',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mine.html',
  styleUrl: './mine.css',
})
export class MineComponent {
  private petitionService = inject(PetitionService);
  private apiUrl = inject(API_URL);

  petitions: PetitionVM[] = [];
  cargando = true;

  ngOnInit(): void {
    this.petitionService.getMine().subscribe({
      next: data => {
        this.petitions = data.map(p => ({
          ...p,
          image: resolvePetitionImage(this.apiUrl, p),
        }));
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}

