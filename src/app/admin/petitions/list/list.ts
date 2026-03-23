import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Petition } from '../../../models/petition';
import { PetitionService } from '../petition-service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  private adminPetitionService = inject(PetitionService);

  petitions: Petition[] = [];
  loading = true;

  currentPage = 1;
  itemsPerPage = 5;

  ngOnInit(): void {
    this.loadPetitions();
  }

  loadPetitions(): void {
    this.loading = true;

    this.adminPetitionService.getAll().subscribe({
      next: (data) => {
        this.petitions = data;
        this.currentPage = 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar peticiones admin:', err);
        this.loading = false;
      }
    });
  }

  deletePetition(id: number): void {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar esta petición?');
    if (!confirmed) return;

    this.adminPetitionService.delete(id).subscribe({
      next: () => {
        this.petitions = this.petitions.filter(p => p.id !== id);

        if (this.currentPage > this.totalPages) {
          this.currentPage = Math.max(1, this.totalPages);
        }
      },
      error: (err) => {
        console.error('Error al eliminar petición:', err);
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.petitions.length / this.itemsPerPage);
  }

  get paginatedPetitions(): Petition[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.petitions.slice(start, end);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
