import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../../auth/auth.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/admin/usuarios';

  getAll(): Observable<User[]> {
    return this.http.get<{ data: User[] }>(this.API_URL).pipe(
      map(res => res.data)
    );
  }

  getById(id: number): Observable<User> {
    return this.http.get<{ data: User }>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data)
    );
  }

  create(payload: {
    name: string;
    email: string;
    password: string;
    role: number;
  }): Observable<User> {
    return this.http.post<{ data: User }>(this.API_URL, payload).pipe(
      map(res => res.data)
    );
  }

  update(id: number, payload: {
    name: string;
    email: string;
    password?: string;
    role: number;
  }): Observable<User> {
    return this.http.put<{ data: User }>(`${this.API_URL}/${id}`, payload).pipe(
      map(res => res.data)
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
