import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Category } from '../../models/petition';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/admin/categorias';

  getAll(): Observable<Category[]> {
    return this.http.get<{ data: Category[] }>(this.API_URL).pipe(
      map(res => res.data)
    );
  }

  getById(id: number): Observable<Category> {
    return this.http.get<{ data: Category }>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data)
    );
  }

  create(payload: { name: string }): Observable<Category> {
    return this.http.post<{ data: Category }>(this.API_URL, payload).pipe(
      map(res => res.data)
    );
  }

  update(id: number, payload: { name: string }): Observable<Category> {
    return this.http.put<{ data: Category }>(`${this.API_URL}/${id}`, payload).pipe(
      map(res => res.data)
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
