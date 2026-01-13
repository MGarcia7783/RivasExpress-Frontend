import { Routes } from '@angular/router';

export const routes: Routes = [
  // Login (pantalla inicial)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.page')
        .then((m) => m.LoginPage),
  },

  // Register
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./pages/auth/register/register.page')
        .then((m) => m.RegisterPage),
  },

  // Ruta por defecto
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Fallback a Login en caso de ruta no encontrada
  {
    path: '**',
    redirectTo: 'login',
  },
];
