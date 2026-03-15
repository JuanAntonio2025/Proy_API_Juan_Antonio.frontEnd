import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Petition } from './models/petition';
import { tap, map } from 'rxjs';
import { Category } from './models/petition';

@Injectable({ providedIn: 'root' })

export class PetitionService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/peticiones';

  // ‐‐‐ State (Signals) ‐‐‐
  // Store privado de peticiones
  #peticiones = signal<Petition[]>([]);
  loading = signal<boolean>(false);

  // ‐‐‐ Selectors ‐‐‐
  // Exponemos las peticiones como solo lectura
  allPeticiones = this.#peticiones.asReadonly();

  fetchPeticiones(filters?: {
    category_id?: string;
    signatures?: string;
    name?: string;
  }) {
    this.loading.set(true);

    let params = new HttpParams();

    if (filters?.category_id) {
      params = params.set('category_id', filters.category_id);
    }

    if (filters?.signatures && filters.signatures !== 'all') {
      params = params.set('signatures', filters.signatures);
    }

    if (filters?.name) {
      params = params.set('name', filters.name);
    }

    return this.http.get<{ data: Petition[] }>(this.API_URL, { params }).pipe(
      map(res => res.data),
      tap(data => {
        this.#peticiones.set(data);
        this.loading.set(false);
      })
    );
  }

  getById(id: number) {
    return this.http.get<{ data: Petition }>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data)
    );
  }

  create(formData: FormData) {
    return this.http.post<{ data: Petition }>(this.API_URL, formData).pipe(
      tap(res => {
        // Añadimos la nueva petición al principio de la lista local
        this.#peticiones.update(list => [res.data, ...list]);
      })
    );
  }

  update(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Petition }>(`${this.API_URL}/${id}`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        // Eliminamos la petición de la lista local
        this.#peticiones.update(list => list.filter(p => p.id !== id));
      })
    );
  }

  firmar(id: number) {
    return this.http.put<{ success: boolean, message: string }>(
      `${this.API_URL}/firmar/${id}`,
      {}
    );
  }

  fetchCategories() {
    return this.http.get<{ data: Category[] }>('http://localhost:8000/api/categorias')
      .pipe(map(res => res.data));
  }

  getMine() {
    return this.http
      .get<{ data: Petition[] }>('http://localhost:8000/api/mispeticiones')
      .pipe(map(res => res.data));
  }

  getSignedPetitions() {
    return this.http
      .get<{ data: Petition[] }>('http://localhost:8000/api/misfirmas')
      .pipe(map(res => res.data));
  }

}

