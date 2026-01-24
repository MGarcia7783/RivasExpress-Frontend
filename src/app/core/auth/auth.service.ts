import { inject, Injectable } from '@angular/core';
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
  url = `${getApiUrl()}/usuario`;

  private carritoService = inject(CarritoService);

  // Usuario autenticado
  private usuarioAutenticado: ILogin | null = null;

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
      .pipe(tap((response) => this.setSession(response)));
  }

  loginConGoogle(idToken: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.url}/login-google`, { idToken })
      .pipe(tap((response) => this.setSession(response)));
  }

  // Establecer sesión con usuario y token
  private setSession(authResponse: AuthResponse): void {
    this.usuarioAutenticado = authResponse.usuario;
    this.token = authResponse.token;

    // Guardar token y usuario en storage
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('usuario', JSON.stringify(authResponse.usuario));

    // Cargar carrito con usuario logueado
    this.carritoService.inicializarCarrito();
  }

  // Cerrar sesión
  logout(): void {
    this.usuarioAutenticado = null;
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  // Retornar usuario autenticado
  getUsuarioLogueado(): ILogin | null {
    // Si ya lo tenemos en memoria, lo devolvemos sin consultar al storage
    if (this.usuarioAutenticado) {
      return this.usuarioAutenticado;
    }

    // Obtener usuario en el localStorage
    const user = localStorage.getItem('usuario');
    if (!user) return null; // no hay usuario autenticado

    try {
      // Convertirlo el JSON y guardarlo en memoria
      this.usuarioAutenticado = JSON.parse(user) as ILogin;
      return this.usuarioAutenticado; // devolver usuario autenticado
    } catch {
      localStorage.removeItem('usuario'); // eliminar el valor del storage
      return null; // indicamos que no hay usuario válido
    }
  }

  // Retornar token JWT
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Obtener el rol del usuario autenticado
  getRol(): string | null {
    const usuario = this.getUsuarioLogueado();
    return usuario ? usuario.rol : null;
  }

  // Decodifica el token almacenado y devuelve su contenido (Payload)
  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }
}
