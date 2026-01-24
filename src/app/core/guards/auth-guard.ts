import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { InteractionService } from 'src/app/shared/interaction.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private interaction: InteractionService
  ) {}

  // Determina si un usuario puede acceder a una ruta según su autenticación y rol
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // 1. Verificar auntenticación
    if (!this.authService.isAuthenticated()) {
      this.interaction.showToast('Por favor, inicie sesión para continuar.');

      this.router.navigate(['/login']);
      return false;
    }

    // 2. Obtener el rol requerido para la ruta
    const rolEsperado = route.data['rol'];
    const rolUsuario = this.authService.getRol();

    // 3. Validar permisos por rol
    if (rolEsperado && rolUsuario !== rolEsperado) {
      this.interaction.showToast(
        'No tiene permisos para acceder a esta sección.'
      );

      this.redirigirSegunRol(rolUsuario);
      return false;
    }

    return true; // Acceso concedido
  }

  // Redireccionar según rol del usuario
  private redirigirSegunRol(rol: string | null): void {
    if (rol === 'Administrador') {
      this.router.navigate(['/admin/home']);
    } else {
      this.router.navigate(['/cliente/home']);
    }
  }
}
