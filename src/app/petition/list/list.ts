import { Component, inject } from '@angular/core';
import { PetitionService } from '../../petition';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Petition, Category } from '../../models/petition';
import { LucideAngularModule } from 'lucide-angular';
import { API_URL } from '../../core/config/api.config';
import { resolvePetitionImage } from '../../core/utils/image.util';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../search-service';

type PetitionVM = Petition & { image: string };

@Component({
  selector: 'app-list',
  standalone:true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class ListComponent {
  private apiUrl = inject(API_URL);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private searchService = inject(SearchService);

  public peticionService = inject(PetitionService);
  public petitions: PetitionVM[] = [];
  public categories: Category[] = [];
  public cargando: boolean = true;
  public currentPage = 1;
  public itemsPerPage = 4;

  public filters = {
    category_id: '',
    signatures: 'all',
    name: ''
  };

  ngOnInit(): void {
    this.loadCategories();

    this.route.queryParams.subscribe(params => {
      this.filters.category_id = params['category_id'] || '';
      this.filters.signatures = params['signatures'] || 'all';
      this.filters.name = params['name'] || this.searchService.searchTerm();

      this.searchService.setSearchTerm(this.filters.name);

      this.loadPetitions();
    });
  }

  loadCategories(): void {
    this.peticionService.fetchCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  loadPetitions(): void {
    this.cargando = true;

    this.peticionService.fetchPeticiones(this.filters).subscribe({
      next: (data: Petition[]) => {
        this.petitions = data.map(p => ({
          ...p,
          image: resolvePetitionImage(this.apiUrl, p),
        }));
        this.currentPage = 1;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar peticiones:', err);
        this.cargando = false;
      }
    });
  }

  onFiltersChange(): void {
    this.router.navigate(['/peticiones'], {
      queryParams: {
        category_id: this.filters.category_id || null,
        signatures: this.filters.signatures !== 'all' ? this.filters.signatures : null,
        name: this.searchService.searchTerm() || null
      }
    });
  }

  clearFilters(): void {
    this.filters = {
      category_id: '',
      signatures: 'all',
      name: this.searchService.searchTerm()
    };

    this.router.navigate(['/peticiones'], {
      queryParams: {
        name: this.searchService.searchTerm() || null
      }
    });
  }

  //Lógica de Paginación
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get totalPages(): number {
    return Math.ceil(this.petitions.length / this.itemsPerPage);
  }

  get paginatedPetitions(): PetitionVM[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.petitions.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
