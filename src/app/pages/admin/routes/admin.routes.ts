import { Routes } from '@angular/router';
import { AdminComponent } from '../components/page/admin.component';
import { AuthGuard } from '../../../core/guards/auth-guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../components/home/admin.home.page').then(
            (h) => h.AdminHomePage,
          ),
      },
      {
        path: 'categoria',
        loadChildren: () =>
          import('../../../core/features/categoria/routes/categoria.routes').then(
            (c) => c.CATEGORIA_ROUTERS,
          ),
      },
      {
        path: 'producto',
        loadChildren: () =>
          import('../../../core/features/producto/routes/producto.routes').then(
            (p) => p.PRODUCTO_ROUTES,
          ),
      },
      {
        path: 'pedido',
        loadChildren: () =>
          import('../../../core/features/pedido/routes/pedido.routes').then(
            (p) => p.PEDIDO_ROUTES,
          ),
      },
      {
        path: 'usuario',
        loadChildren: () =>
          import('../../../core/features/usuario/routes/usuario.routes').then(
            (u) => u.USUARIO_ROUTES,
          ),
      },
    ],
  },
];
