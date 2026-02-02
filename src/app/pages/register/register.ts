import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class RegisterComponent {
  formData = {
    name: '',
    email: '',
    password: '',
  };

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    this.auth.register(this.formData).subscribe({
      next: () => {this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Register error', err);
        alert('Error registering user');
      },
    });
  }
}
