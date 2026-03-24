import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user-service';
import { User } from '../../../auth/auth.model';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class UsersForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  isEditMode = false;
  userId: number | null = null;
  loading = true;

  form = {
    name: '',
    email: '',
    password: '',
    role: 0
  };

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.userId;

    if (this.isEditMode && this.userId) {
      this.loadUser(this.userId);
    } else {
      this.loading = false;
    }
  }

  loadUser(id: number): void {
    this.userService.getById(id).subscribe({
      next: (user: User) => {
        this.form = {
          name: user.name,
          email: user.email,
          password: '',
          role: user.role
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.loading = false;
      }
    });
  }

  save(): void {
    const payload: {
      name: string;
      email: string;
      password?: string;
      role: number;
    } = {
      name: this.form.name,
      email: this.form.email,
      role: this.form.role
    };

    if (this.form.password.trim() !== '') {
      payload.password = this.form.password;
    }

    if (this.isEditMode && this.userId) {
      this.userService.update(this.userId, payload).subscribe({
        next: () => this.router.navigate(['/admin/usuarios/listado']),
        error: (err) => console.error('Error al actualizar usuario:', err)
      });
    } else {
      if (!this.form.password.trim()) {
        alert('La contraseña es obligatoria al crear un usuario.');
        return;
      }

      this.userService.create({
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
        role: this.form.role
      }).subscribe({
        next: () => this.router.navigate(['/admin/usuarios/listado']),
        error: (err) => console.error('Error al crear usuario:', err)
      });
    }
  }
}
