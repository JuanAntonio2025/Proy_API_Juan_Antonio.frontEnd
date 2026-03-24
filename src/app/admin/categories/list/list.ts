import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../../models/petition';
import { CategoryService } from '../category-service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class CategoriesList {
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  loading = true;

  currentPage = 1;
  itemsPerPage = 5;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;

    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.currentPage = 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.loading = false;
      }
    });
  }

  deleteCategory(id: number): void {
    const confirmed = confirm('¿Estás seguro de eliminar esta categoría?');
    if (!confirmed) return;

    this.categoryService.delete(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(category => category.id !== id);

        if (this.currentPage > this.totalPages) {
          this.currentPage = Math.max(1, this.totalPages);
        }
      },
      error: (err) => {
        console.error('Error al eliminar categoría:', err);
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.categories.length / this.itemsPerPage);
  }

  get paginatedCategories(): Category[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.categories.slice(start, end);
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
