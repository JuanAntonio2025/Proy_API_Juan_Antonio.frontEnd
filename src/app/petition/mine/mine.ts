import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetitionService } from '../../petition';
import { Petition } from '../../models/petition';
import { API_URL } from '../../core/config/api.config';
import {RouterLink} from '@angular/router';

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
          image: this.resolveImage(p),
        }));
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  private resolveImage(p: Petition): string {
    const filePath = p.files?.[0]?.file_path;
    if (!filePath) return 'assets/images/placeholder.webp';

    const cleaned = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    return `${this.apiUrl}/storage/${cleaned}`;
  }
}

