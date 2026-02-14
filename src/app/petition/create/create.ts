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
  fileToUpload: File | null = null;
  fileError: string = '';

  itemForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    addressee: ['', [Validators.required]],
    category_id: ['', [Validators.required]]
  });

  ngOnInit(): void {
    // Necesitas un endpoint tipo GET /categories
    this.petitionService.fetchCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.categories.set([])
    });
  }

  onFileSelected(event: any) {
    this.fileError = '';
    const file = event.target.files[0];
    if (file) this.fileToUpload = file;
  }

  onSubmit() {
    if (this.itemForm.valid && this.fileToUpload) {
      this.loading.set(true);
      const formData = new FormData();

      formData.append('title', this.itemForm.value.title!);
      formData.append('description', this.itemForm.value.description!);
      formData.append('addressee', this.itemForm.value.addressee!);
      formData.append('category_id', this.itemForm.value.category_id!);
      formData.append('file', this.fileToUpload);

      if (this.fileToUpload) {
        formData.append('file', this.fileToUpload);
      }

      this.petitionService.create(formData).subscribe({
        next: () => this.router.navigate(['/peticiones']),
        error: (err) => this.loading.set(false)
      });
    } else {
      alert('Rellena todos los campos e imagen');
    }
  }
}

