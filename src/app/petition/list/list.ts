import { Component, inject } from '@angular/core';
import { PetitionService } from '../../petition';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Petition } from '../../models/petition';
import {LucideAngularModule} from 'lucide-angular';
import { API_URL } from '../../core/config/api.config';
import { resolvePetitionImage } from '../../core/utils/image.util';

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
  private route = inject(ActivatedRoute);
  public peticionService = inject(PetitionService);
  public petitions: PetitionVM[] = [];
  public cargando: boolean = true;

  ngOnInit(): void { // Trae las peticiones usando el metodo "fetchPeticiones()" de PetitionService
    this.route.queryParams.subscribe(params => {
      //const busqueda = params['q'];
      this.cargando = true;
      this.peticionService.fetchPeticiones().subscribe({
        next: (data: Petition[]) => {
          this.petitions = data.map(p => ({
            ...p,
            image: resolvePetitionImage(this.apiUrl, p),
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
}
