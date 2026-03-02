import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PetitionService } from '../../petition';
import { Router } from '@angular/router';
import { Category } from '../../models/petition';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})

export class CreateComponent {
  private fb = inject(FormBuilder);
  private petitionService = inject(PetitionService);
  private router = inject(Router);

  loading = signal(false);
  categories = signal<Category[]>([]);

  selectedFiles: File[] = [];
  fileError: string = '';

  itemForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    addressee: ['', [Validators.required]],
    category_id: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.petitionService.fetchCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.categories.set([])
    });
  }

  onFileSelected(event: any) {
    this.fileError = '';

    const files = event.target.files;

    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
    }
  }

  onSubmit() {

    if (this.itemForm.valid && this.selectedFiles.length > 0) {

      this.loading.set(true);
      const formData = new FormData();

      formData.append('title', this.itemForm.value.title!);
      formData.append('description', this.itemForm.value.description!);
      formData.append('addressee', this.itemForm.value.addressee!);
      formData.append('category_id', this.itemForm.value.category_id!);

      // Añadir múltiples archivos
      this.selectedFiles.forEach(file => {
        formData.append('files[]', file);
      });

      this.petitionService.create(formData).subscribe({
        next: () => this.router.navigate(['/mis-peticiones']),
        error: () => this.loading.set(false)
      });

    } else {
      alert('Rellena todos los campos y al menos una imagen');
    }
  }
}
