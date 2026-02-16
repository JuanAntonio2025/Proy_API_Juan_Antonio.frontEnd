import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {PetitionService} from '../../petition';
import {Category, Petition} from '../../models/petition';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class EditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private petitionService = inject(PetitionService);

  readonly API_STORAGE = 'http://localhost:8000/storage/';

  id = signal<number | null>(null);
  loading = signal(false);

  petition = signal<Petition | null>(null);
  categories = signal<Category[]>([]);

  fileToUpload: File | null = null;
  fileError = '';

  itemForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    addressee: ['', [Validators.required]],
    category_id: ['', [Validators.required]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.id.set(Number(idParam));

    this.petitionService.fetchCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.categories.set([])
    });

    this.cargarDatos(this.id()!);
  }

  cargarDatos(id: number) {
    this.petitionService.getById(id).subscribe({
      next: (data) => {
        this.petition.set(data);

        this.itemForm.patchValue({
          title: data.title,
          description: data.description,
          addressee: data.addressee,
          category_id: String(data.category_id ?? '')
        });
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fileToUpload = input.files?.[0] ?? null;
  }

  onSubmit() {
    this.itemForm.markAllAsTouched();
    if (this.itemForm.invalid || !this.id()) return;

    this.loading.set(true);

    const formData = new FormData();
    formData.append('title', this.itemForm.get('title')?.value ?? '');
    formData.append('description', this.itemForm.get('description')?.value ?? '');
    formData.append('addressee', this.itemForm.get('addressee')?.value ?? '');
    formData.append('category_id', this.itemForm.get('category_id')?.value ?? '');

    if (this.fileToUpload) {
      formData.append('file', this.fileToUpload);
    }

    this.petitionService.update(this.id()!, formData).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/peticiones', this.id()!]);
      },
      error: (err) => {
        console.error('UPDATE ERROR', err);
        this.loading.set(false);
      }
    });

  }

  getImagenUrl(): string {
    const pet = this.petition();
    const files = pet?.files ?? [];
    const last = files.length ? files[files.length - 1] : null;
    const filePath = last?.file_path;

    if (!filePath) return 'assets/images/placeholder.webp';

    const cleaned = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    return `${this.API_STORAGE}${cleaned}`;
  }
}


