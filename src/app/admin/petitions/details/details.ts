import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Petition } from '../../../models/petition';
import { PetitionService } from '../petition-service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  private route = inject(ActivatedRoute);
  private adminPetitionService = inject(PetitionService);

  petition: Petition | null = null;
  loading = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) return;

    this.adminPetitionService.getById(id).subscribe({
      next: (data) => {
        this.petition = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle de petición:', err);
        this.loading = false;
      }
    });
  }

  resolveImage(path: string): string {
    return `http://localhost:8000/storage/${path}`;
  }
}
