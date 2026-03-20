import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../search-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private searchService = inject(SearchService);
  public auth = inject(AuthService);
  public router: Router = inject(Router);

  // REFERENCIA A SIGNALS:
  // No las ejecutamos con (), pasamos la referencia para que el template las "escuche"
  public currentUser = this.authService.currentUser;
  public isLoggedIn = this.authService.isLoggedIn;

  public searchTerm: string = '';

  logout() {
    this.authService.logout().subscribe();
  }

  closeWelcome() {
    this.auth.showWelcome.set(false);
  }

  isInPetitionsList(): boolean {
    return this.router.url.startsWith('/peticiones');
  }

  searchPetitions() {
    const term = this.searchTerm.trim();

    this.searchService.setSearchTerm(term);

    this.router.navigate(['/peticiones'], {
      queryParams: {
        name: term || null
      },
      queryParamsHandling: 'merge'
    });
  }

  onSearchInput() {
    const term = this.searchTerm.trim();
    this.searchService.setSearchTerm(term);

    if (this.isInPetitionsList()) {
      this.router.navigate(['/peticiones'], {
        queryParams: {
          name: term || null
        },
        queryParamsHandling: 'merge'
      });
    }
  }
}
