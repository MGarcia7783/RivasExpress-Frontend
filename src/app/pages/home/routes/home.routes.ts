import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth-guard';
import { HomeComponent } from '../components/home.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'cliente',
        loadChildren: () =>
          import('../../cliente/routes/cliente.routes').then(
            (c) => c.CLIENTE_ROUTES,
          ),
        data: { rol: 'Cliente' },
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('../../admin/routes/admin.routes').then(
            (a) => a.ADMIN_ROUTES,
          ),
        data: { rol: 'Administrador' },
      },
    ],
  },
];
