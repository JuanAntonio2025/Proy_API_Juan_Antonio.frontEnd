import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PetitionService } from '../../petition';
import { Petition } from '../../models/petition';
import { API_URL } from '../../core/config/api.config';
import { resolvePetitionImage } from '../../core/utils/image.util';

type PetitionVM = Petition & { image: string };

@Component({
  selector: 'app-signed',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './signed.html',
})
export class SignedComponent implements OnInit {
  private petitionService = inject(PetitionService);
  private apiUrl = inject(API_URL);

  public currentPage = 1;
  public itemsPerPage = 4;

  petitions: PetitionVM[] = [];
  loading = true;

  ngOnInit() {
    this.petitionService.getSignedPetitions().subscribe({
      next: data => {
        this.petitions = data.map(p => ({
          ...p,
          image: resolvePetitionImage(this.apiUrl, p),
        }));
        this.currentPage = 1;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  //Lógica de Paginación
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get totalPages(): number {
    return Math.ceil(this.petitions.length / this.itemsPerPage);
  }

  get paginatedPetitions(): PetitionVM[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.petitions.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}

