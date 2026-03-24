import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/petition';
import { CategoryService } from '../category-service';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class CategoriesForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoryService = inject(CategoryService);

  isEditMode = false;
  categoryId: number | null = null;
  loading = true;

  category: Category | null = null;

  form = {
    name: ''
  };

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.categoryId;

    if (this.isEditMode && this.categoryId) {
      this.loadCategory(this.categoryId);
    } else {
      this.loading = false;
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getById(id).subscribe({
      next: (category) => {
        this.category = category;

        this.form = {
          name: category.name
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar categoría:', err);
        this.loading = false;
      }
    });
  }

  save(): void {
    const payload = {
      name: this.form.name
    };

    if (this.isEditMode && this.categoryId) {
      this.categoryService.update(this.categoryId, payload).subscribe({
        next: () => {
          this.router.navigate(['/admin/categorias/listado']);
        },
        error: (err) => {
          console.error('Error al actualizar categoría:', err);
        }
      });
    } else {
      this.categoryService.create(payload).subscribe({
        next: () => {
          this.router.navigate(['/admin/categorias/listado']);
        },
        error: (err) => {
          console.error('Error al crear categoría:', err);
        }
      });
    }
  }
}
