import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Category, Petition, User } from '../../../models/petition';
import { PetitionFile } from '../../../models/petition-file';
import { PetitionService } from '../petition-service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class PetitionsForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminPetitionService = inject(PetitionService);

  isEditMode = false;
  petitionId: number | null = null;
  loading = true;

  petition: Petition | null = null;
  users: User[] = [];
  categories: Category[] = [];
  selectedFiles: File[] = [];

  form = {
    title: '',
    description: '',
    addressee: '',
    status: 'pending',
    user_id: '',
    category_id: ''
  };

  ngOnInit(): void {
    this.petitionId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.petitionId;

    this.loadMeta();

    if (this.isEditMode && this.petitionId) {
      this.loadPetition(this.petitionId);
    } else {
      this.loading = false;
    }
  }

  loadMeta(): void {
    this.adminPetitionService.getMeta().subscribe({
      next: (data) => {
        this.users = data.users;
        this.categories = data.categories;
      },
      error: (err) => {
        console.error('Error al cargar usuarios/categorías:', err);
      }
    });
  }

  loadPetition(id: number): void {
    this.adminPetitionService.getById(id).subscribe({
      next: (petition) => {
        this.petition = petition;

        this.form = {
          title: petition.title,
          description: petition.description,
          addressee: petition.addressee,
          status: petition.status ?? 'pending',
          user_id: String(petition.user_id ?? ''),
          category_id: String(petition.category_id ?? '')
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar petición:', err);
        this.loading = false;
      }
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.selectedFiles = Array.from(input.files);
  }

  save(): void {
    const formData = new FormData();

    formData.append('title', this.form.title);
    formData.append('description', this.form.description);
    formData.append('addressee', this.form.addressee);
    formData.append('status', this.form.status);
    formData.append('user_id', this.form.user_id);
    formData.append('category_id', this.form.category_id);

    this.selectedFiles.forEach(file => {
      formData.append('images[]', file);
    });

    if (this.isEditMode && this.petitionId) {
      this.adminPetitionService.update(this.petitionId, formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/peticiones/listado']);
        },
        error: (err) => {
          console.error('Error al actualizar petición:', err);
        }
      });
    } else {
      this.adminPetitionService.create(formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/peticiones/listado']);
        },
        error: (err) => {
          console.error('Error al crear petición:', err);
        }
      });
    }
  }

  deleteFile(fileId: number): void {
    const confirmed = confirm('¿Eliminar esta imagen?');
    if (!confirmed) return;

    this.adminPetitionService.deleteFile(fileId).subscribe({
      next: () => {
        if (this.petition?.files) {
          this.petition.files = this.petition.files.filter(file => file.id !== fileId);
        }
      },
      error: (err) => {
        console.error('Error al eliminar imagen:', err);
      }
    });
  }

  resolveImage(path: string): string {
    return `http://localhost:8000/storage/${path}`;
  }
}
