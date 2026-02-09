import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PetitionService } from '../../petition';
import { Petition } from '../../models/petition';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit.html'
})
export class EditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private petitionService = inject(PetitionService);
  readonly API_URL = 'http://localhost:8000/storage/';
  id = signal<number | null>(null);
  loading = signal(false);
  fileToUpload: File | null = null;
  petition: Petition | null = null;
  itemForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    addressee: ['', [Validators.required]],
    category_id: ['', [Validators.required]]
  });
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.cargarDatos(this.id()!);
    }
  }
  cargarDatos(id: number) {
    this.petitionService.getById(id).subscribe({
      next: (res: any) => {
        const data = res.data ? res.data : res;
        this.petition = data as Petition;
        this.itemForm.patchValue({
          title: data.title,
          description: data.description,
          addressee: data.addressee,
          category_id: String(data.category_id)
        });
      }
    });
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.fileToUpload = file;
  }
  onSubmit() {
    if (this.itemForm.invalid || !this.id()) return;
    this.loading.set(true);
    const formData = new FormData();
    formData.append('title', this.itemForm.get('title')?.value || '');
    formData.append('description', this.itemForm.get('description')?.value || '');
    formData.append('addressee', this.itemForm.get('addressee')?.value || '');
    formData.append('category_id', this.itemForm.get('category_id')?.value || '');
    if (this.fileToUpload) {
      formData.append('file', this.fileToUpload);
    }
    this.petitionService.update(this.id()!, formData).subscribe({
      next: () => this.router.navigate(['/peticiones']),
      error: () => this.loading.set(false)
    });
  }
  getImagenUrl(): string {
    if (this.petition && this.petition.files && this.petition.files.length > 0) {
      return `${this.API_URL}${this.petition.files[0].file_path}`;
    }
    return 'assets/no‐image.png';
  }
}

