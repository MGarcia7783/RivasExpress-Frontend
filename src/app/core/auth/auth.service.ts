import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';
import { AuthResponse } from './auth-response';
import { tap } from 'rxjs/operators';
import { getApiUrl } from '../config/api-url';


@Injectable({ providedIn: 'root' })
export class AuthService {
  url = `${getApiUrl()}/usuario`;

  // Usuario autenticado
  private usuarioAutenticado: Usuario | null = null;

  // Token JWT
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  /* Método de login
  login(userName: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/login`, { userName, password })
  }*/

   // Guardar usuario y token al iniciar sesión
  login(userName: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.url}/login`, { userName, password })
      .pipe(
        tap((response) => {
          this.setSession(response);
        })
      );
  }



  // Establecer sesión con usuario y token
  private setSession(authResponse: AuthResponse): void {
    this.usuarioAutenticado = authResponse.usuario;
    this.token = authResponse.token;

    // Persistencia
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('usuario', JSON.stringify(authResponse.usuario));
  }

  // Retornar usuario autenticado
  getUsuario(): Usuario | null {
    if (!this.usuarioAutenticado) {
      const user = localStorage.getItem('usuario');
      this.usuarioAutenticado = user ? JSON.parse(user) : null;
    }
    return this.usuarioAutenticado;
  }

  // Retornar token JWT
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  // Cerrar sesión
  logout(): void {
    this.usuarioAutenticado = null;
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
