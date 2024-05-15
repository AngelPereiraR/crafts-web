import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environments } from 'src/environments/environments.prod';
import { Craft } from '../interfaces/craft.interface';

@Injectable({
  providedIn: 'root',
})
export class CraftsService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);

  private _currentPage = signal<string | null>(null);
  public currentPage = computed(() => this._currentPage());

  setPage(page: string) {
    this._currentPage.set(page);
  }

  getCrafts(): Observable<Craft[]> {
    const url = `${this.baseUrl}/crafts`;

    return this.http.get<Craft[]>(url).pipe(
      map((crafts) => {
        return crafts;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  getCraft(id: string): Observable<Craft> {
    const url = `${this.baseUrl}/crafts/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Craft>(url, { headers }).pipe(
      map((craft) => {
        return craft;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  removeCraft(id: string) {
    const url = `${this.baseUrl}/crafts/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .delete<Craft>(url, { headers })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  addCraft(name: string, description: number) {
    const url = `${this.baseUrl}/crafts`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = {
      name,
      description,
    };

    return this.http.post<Craft>(url, body, { headers }).pipe(
      map((craft) => {
        return craft;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  updateCraft(id: string, name: string, description: string) {
    const url = `${this.baseUrl}/crafts/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = {
      name,
      description,
    };

    return this.http.patch<Craft>(url, body, { headers }).pipe(
      map((craft) => {
        return craft;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  uploadCraftImage(craftId: string, file: File): Observable<any> {
    const url = `${this.baseUrl}/crafts/uploadImage/${craftId}`;
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(url, formData, { headers }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
