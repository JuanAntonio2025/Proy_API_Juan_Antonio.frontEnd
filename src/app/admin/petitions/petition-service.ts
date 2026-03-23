import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Petition, Category, User } from '../../models/petition';

@Injectable({
  providedIn: 'root',
})
export class PetitionService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/admin/peticiones';

  getAll(): Observable<Petition[]> {
    return this.http.get<{ data: Petition[] }>(this.API_URL).pipe(
      map(res => res.data)
    );
  }

  getById(id: number): Observable<Petition> {
    return this.http.get<{ data: Petition }>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data)
    );
  }

  getMeta(): Observable<{ users: User[]; categories: Category[] }> {
    return this.http.get<{ data: { users: User[]; categories: Category[] } }>(`${this.API_URL}/meta`).pipe(
      map(res => res.data)
    );
  }

  create(formData: FormData) {
    return this.http.post<{ data: Petition }>(this.API_URL, formData).pipe(
      map(res => res.data)
    );
  }

  update(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Petition }>(`${this.API_URL}/${id}`, formData).pipe(
      map(res => res.data)
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  deleteFile(fileId: number) {
    return this.http.delete(`http://localhost:8000/api/admin/peticiones/file/${fileId}`);
  }
}
