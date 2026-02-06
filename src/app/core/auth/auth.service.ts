import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILogin } from './ilogin';
import { AuthResponse } from './auth-response';
import { tap } from 'rxjs/operators';
import { getApiUrl } from '../../shared/api-url';
import { jwtDecode } from 'jwt-decode';
import { CarritoService } from '../features/pedido/services/carrito.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private url = `${getApiUrl()}/usuario`;

  private carritoService = inject(CarritoService);

  private usuario: ILogin | null = null; // Usuario autenticado
  private token: string | null = null; // Token JWT

  constructor() {
    this.cargarSesion();
  }

  // Login / guardar usuario y token al iniciar sesión
  login(userName: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.url}/login`, { userName, password })
      .pipe(tap((res) => this.guardarSession(res)));
  }

  // Establecer sesión con usuario y token
  private guardarSession({ usuario, token }: AuthResponse): void {
    this.usuario = usuario;
    this.token = token;

    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);

    this.carritoService.inicializarCarrito(); // Cargar carrito con usuario logueado
  }

  // Sesión
  private cargarSesion(): void {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (token) this.token = token;

    if (usuario) {
      try {
        this.usuario = JSON.parse(usuario);
      } catch {
        this.logout();
      }
    }
  }

  logout(): void {
    this.usuario = null;
    this.token = null;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  // Retornar usuario autenticado
  getUsuario(): ILogin | null {
    return this.usuario;
  }

  // Retornar token JWT
  getToken(): string | null {
    return this.token;
  }

  // Obtener el rol del usuario autenticado
  getRol(): string | null {
    return this.getUsuario()?.rol ?? null;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Decodifica el token almacenado y devuelve su contenido (Payload)
  getDecodedToken(): any {
    try {
      return this.token ? jwtDecode(this.token) : null;
    } catch (error) {
      return null;
    }
  }
}
