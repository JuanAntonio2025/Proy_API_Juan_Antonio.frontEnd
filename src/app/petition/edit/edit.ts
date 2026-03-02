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

  filesToUpload: File[] = [];
  deletedFiles: number[] = [];

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

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.filesToUpload = Array.from(input.files);
    }
  }

  toggleDeleteFile(fileId: number) {
    if (this.deletedFiles.includes(fileId)) {
      this.deletedFiles = this.deletedFiles.filter(id => id !== fileId);
    } else {
      this.deletedFiles.push(fileId);
    }
  }

  onSubmit() {
    this.itemForm.markAllAsTouched();
    if (this.itemForm.invalid || !this.id()) return;

    this.loading.set(true);

    const formData = new FormData();

    formData.append('title', this.itemForm.value.title ?? '');
    formData.append('description', this.itemForm.value.description ?? '');
    formData.append('addressee', this.itemForm.value.addressee ?? '');
    formData.append('category_id', this.itemForm.value.category_id ?? '');

    // Nuevas imágenes
    this.filesToUpload.forEach(file => {
      formData.append('files[]', file);
    });

    // Imágenes a eliminar
    this.deletedFiles.forEach(id => {
      formData.append('deleted_files[]', id.toString());
    });

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
}


