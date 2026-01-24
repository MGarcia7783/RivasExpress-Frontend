import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/**
 * AuthInterceptor
 * Responsabilidad: añadir headers de autenticación a peticiones salientes.
 * Nota: implementación mínima (passthrough). No se añade lógica real todavía.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Excluir endpoint del login si es necesario
    if (req.url.includes('/usuario/login')) {
      return next.handle(req);
    }

    // Obtener el token desde el AuthService
    const token = this.authService.getToken();

    // Si existe token, clonamos la request y agregamos el header Authorization
    if(token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Continuamos con la petición modificada
      return next.handle(authReq);
    }

    // Si no hay token, la petición continúa sin modificaciones
    return next.handle(req);
  }
}
