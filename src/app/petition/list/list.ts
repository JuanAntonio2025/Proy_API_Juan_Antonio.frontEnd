import { Component, inject } from '@angular/core';
import { PetitionService } from '../../petition';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Petition } from '../../models/petition';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-list',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class ListComponent {
  peticionService = inject(PetitionService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  public petitions: Petition[] = [];
  public cargando: boolean = true;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const busqueda = params['q'];
      this.cargando = true;
      this.peticionService.fetchPeticiones().subscribe({
        next: (data) => {
          if (busqueda) {
            this.petitions = data.filter((p: any) =>
              p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
              p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
            );
          } else {
            this.petitions = data;
          }
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
