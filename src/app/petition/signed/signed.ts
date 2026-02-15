import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PetitionService } from '../../petition';
import { Petition } from '../../models/petition';
import { API_URL } from '../../core/config/api.config';
import { resolvePetitionImage } from '../../core/utils/image.util';

type PetitionVM = Petition & { image: string };

@Component({
  selector: 'app-signed',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './signed.html',
})
export class SignedComponent implements OnInit {
  private petitionService = inject(PetitionService);
  private apiUrl = inject(API_URL);

  petitions: PetitionVM[] = [];
  loading = true;

  ngOnInit() {
    this.petitionService.getSignedPetitions().subscribe({
      next: data => {
        this.petitions = data.map(p => ({
          ...p,
          image: resolvePetitionImage(this.apiUrl, p),
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

