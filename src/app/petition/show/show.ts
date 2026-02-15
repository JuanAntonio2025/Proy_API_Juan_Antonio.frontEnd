import { Component, OnInit, inject, signal } from '@angular/core';
import { PetitionService } from '../../petition';
import { Petition } from '../../models/petition';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './show.html',
  styleUrls: ['./show.css']
})
export class ShowComponent implements OnInit {
  private petitionService = inject(PetitionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  public isLoggedIn = this.authService.isLoggedIn;


  peticion = signal<Petition | null>(null);
  loading = signal(true);

  public currentUserId: number | null = null;
  readonly API_STORAGE = 'http://localhost:8000/storage/';

  errorMessage = '';
  successMessage = '';

  //Helper para los botones "Editar" y "Borrar"
  private getUserIdFromStorage(): number | null {
    const raw = localStorage.getItem('user_data');
    if (!raw) return null;
    try {
      const u = JSON.parse(raw);
      return typeof u?.id === 'number' ? u.id : null;
    } catch {
      return null;
    }
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.cargarPeticion(Number(id));

    this.currentUserId = this.getUserIdFromStorage();

    this.authService.user$.subscribe(user => {
      this.currentUserId = user?.id ?? null;
    });

    this.authService.loadUserIfNeeded();
  }

  cargarPeticion(id: number) {
    this.petitionService.getById(id).subscribe({
      next: (pet) => {
        this.peticion.set(pet);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getImagenUrl(): string {
    const pet = this.peticion();
    const files = pet?.files ?? [];
    const last = files.length ? files[files.length - 1] : null;
    const filePath = last?.file_path;

    if (!filePath) {
      return 'assets/images/placeholder.webp';
    }

    const cleaned = filePath.startsWith('/')
      ? filePath.slice(1)
      : filePath;

    return `http://localhost:8000/storage/${cleaned}`;
  }

  delete() {
    const pet = this.peticion();
    if (!pet?.id) return;
    if (confirm('¿Eliminar petición?')) {
      this.petitionService.delete(pet.id).subscribe(() => {
        this.router.navigate(['/mis-peticiones']);
      });
    }
  }

  isOwner(): boolean {
    const pet = this.peticion();
    if (!pet) return false;

    const ownerId = Number(pet.user_id ?? pet.user?.id);
    const me = Number(this.currentUserId);

    return !!ownerId && !!me && ownerId === me;
  }

  firmar() {
    const pet = this.peticion();
    if (!pet?.id) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.petitionService.firmar(pet.id).subscribe({
      next: () => {
        this.successMessage = 'Has firmado la petición correctamente.';
        this.peticion.set({
          ...pet,
          signatories: (pet.signatories ?? 0) + 1
        });
      },
      error: (err) => {
        const msg = (err.error?.message || '').toLowerCase();

        if (err.status === 401) {
          this.errorMessage = 'Tienes que iniciar sesión para firmar.';
        } else if (msg.includes('ya') && msg.includes('firm')) {
          this.errorMessage = 'Ya has firmado esta petición.';
        } else if (err.status === 403) {
          this.errorMessage = 'No puedes firmar esta petición.';
        } else if (err.status === 409) {
          this.errorMessage = 'Ya has firmado esta petición.';
        } else {
          this.errorMessage = err.error?.message ?? 'Error al firmar la petición';
        }
      }

    });
  }

}

