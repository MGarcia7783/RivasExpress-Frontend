import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * AuthGuard
 * Responsabilidad: proteger rutas que requieren autenticación.
 * Nota: se proporciona la firma y dependencias; la lógica queda como TODO.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // TODO: comprobar token/estado de sesión y redirigir si es necesario
    return true; // placeholder
  }
}
