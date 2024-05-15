import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environments } from 'src/environments/environments.prod';

import {
  User,
  AuthStatus,
  LoginResponse,
  CheckTokenResponse,
} from '../interfaces';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Al mundo exterior
  public currentUser: User | null;
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('user')!);
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(
    user: User,
    token: string
  ): boolean {
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ user }));
    this.currentUser = JSON.parse(localStorage.getItem('user')!);

    return true;
  }

  getUsers(): Observable<User[]> {
    const url = `${this.baseUrl}/user`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(url, { headers }).pipe(
      map((users) => {
        return users;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  getUser(id: string): Observable<User> {
    const url = `${this.baseUrl}/user/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(url, { headers }).pipe(
      map((user) => {
        return user;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  login(email: string, password: string): Observable<User> {
    const url = `${this.baseUrl}/user/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => {
        this.setAuthentication(user, token);
        Swal.fire(
          'Inicio de sesión',
          `Sea bienvenid@ administrador/a ${name}.`,
          'success'
        );
        this.router.navigateByUrl('/admin');

        return user;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }
  checkAuthStatus(): Observable<boolean | void> {
    const url = `${this.baseUrl}/user/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => {
        this.setAuthentication( user, token);
      }),
      catchError(() => {
        this.logout();
        this.router.navigateByUrl('/');
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._authStatus.set(AuthStatus.notAuthenticated);
    localStorage.removeItem('user');
    this.currentUser = null;
  }
}
