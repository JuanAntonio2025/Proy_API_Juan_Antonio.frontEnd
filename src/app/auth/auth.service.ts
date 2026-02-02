import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { LoginResponse, User } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://127.0.0.1:8000/api';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<LoginResponse>(`${this.api}/login`, credentials)
      .pipe(tap(res => this.storeTokens(res)));
  }

  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.api}/register`, data);
  }
  /*
  logout() {
  return this.http.post(`${this.api}/logout`, {}).pipe(
  tap(() => this.clearTokens())
  );
  }
  */

  logout() {
    const token = this.getAccessToken();
    return this.http.post(`${this.api}/logout`, {}, {
      headers: { 'Authorization': `Bearer ${token}` } // <--- Forzamos el header aquí
    }).pipe(
      finalize(() => this.clearTokens())
    );
  }

  getProfile() {
    const token = localStorage.getItem('access_token');
    return this.http.get<User>(`${this.api}/userProfile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(
      tap(user => {
        console.log('Datos recibidos del backend:', user); // Revisa la consola del navegador
        this.userSubject.next(user); // <--- ESTO es lo que hace que se vea en el HTML
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  private storeTokens(res: LoginResponse) {
    localStorage.setItem('access_token', res.access_token);
  }

  private clearTokens() {
    localStorage.removeItem('access_token');
    this.userSubject.next(null);
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  refreshToken() {
    return this.http.post<{ access_token: string }>(
      `${this.api}/refresh`,
      {}
    ).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
      })
    );
  }

  loadUserIfNeeded() {
    if (this.getAccessToken() && !this.userSubject.value) {
      this.getProfile().subscribe({
        error: () => this.clearTokens()
      });
    }
  }
}

