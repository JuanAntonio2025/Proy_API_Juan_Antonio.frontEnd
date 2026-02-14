import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PetitionService } from '../../petition';
import { Petition } from '../../models/petition';

type PetitionVM = Petition & { image: string };

@Component({
  selector: 'app-signed',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './signed.html',
})
export class SignedComponent implements OnInit {
  private petitionService = inject(PetitionService);

  petitions: PetitionVM[] = [];
  loading = true;

  ngOnInit() {
    this.petitionService.getSignedPetitions().subscribe({
      next: data => {
        this.petitions = data.map(p => ({
          ...p,
          image: p.files?.length
            ? `http://localhost:8000/storage/${p.files[0].file_path}`
            : 'assets/images/placeholder.webp'
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

