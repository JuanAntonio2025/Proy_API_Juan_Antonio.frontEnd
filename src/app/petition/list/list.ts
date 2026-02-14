import { Component, inject } from '@angular/core';
import { PetitionService } from '../../petition';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Petition } from '../../models/petition';
import { API_URL } from '../../core/config/api.config';
import { AuthService } from '../../auth/auth.service';
import {LucideAngularModule} from 'lucide-angular';

type PetitionVM = Petition & { image: string };


@Component({
  selector: 'app-list',
  standalone:true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class ListComponent {
  private apiUrl = inject(API_URL);
  peticionService = inject(PetitionService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  public petitions: PetitionVM[] = [];
  public cargando: boolean = true;

  private resolveImage(p: Petition): string {
    const filePath = p.files?.[0]?.file_path;

    if (!filePath) return 'assets/images/placeholder.webp';

    // Si ya es URL absoluta
    if (/^https?:\/\//i.test(filePath)) return filePath;

    // file_path viene como "fotos/xxx.jpg"
    // lo servimos como /storage/fotos/xxx.jpg
    const cleaned = filePath.startsWith('/') ? filePath.slice(1) : filePath;

    return `${this.apiUrl}/storage/${cleaned}`;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const busqueda = params['q'];
      this.cargando = true;
      this.peticionService.fetchPeticiones().subscribe({
        next: (data: Petition[]) => {
          this.petitions = data.map(p => ({
            ...p,
            image: this.resolveImage(p)
          }));
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar peticiones:', err);
          this.cargando = false;
        }
      });

    });
  }

  delete(id: number) {
    if(confirm('¿Seguro?')) {
      this.peticionService.delete(id).subscribe({
        error: (err) => alert('No puedes borrar esto (quizás no eres el dueño)'),
        next: () => this.petitions = this.petitions.filter(p => p.id !== id)
      });
    }
  }
}
