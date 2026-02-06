import { Routes } from '@angular/router';
import { LoginPage } from './pages/auth/login/login.page';
import { RegisterPage } from './pages/auth/register/register.page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'auth/register',
    component: RegisterPage
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/routes/home.routes').then((h) => h.HOME_ROUTES),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
