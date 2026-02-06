import { Routes } from '@angular/router';
import { ClienteComponent } from '../components/page/cliente.component';
import { AuthGuard } from 'src/app/core/guards/auth-guard';

export const CLIENTE_ROUTES: Routes = [
  {
    path: '',
    component: ClienteComponent,
    canActivate: [AuthGuard],
    data: { rol: 'Cliente' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../../cliente/components/home/cliente.home.page.component').then(
            (c) => c.ClienteHomePageComponent,
          ),
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('../../../core/features/pedido/components/carrito/carrito.component').then(
            (c) => c.CarritoComponent,
          ),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('../../../core/features/pedido/components/confirmar/pedido.confirmar.component').then(
            (c) => c.PedidoConfirmarComponent,
          ),
      },
      {
        path: 'mis-pedidos',
        loadComponent: () =>
          import('../../../core/features/pedido/components/mis-pedidos/mis.pedidos.component').then(
            (c) => c.MisPedidosComponent,
          ),
      },
    ],
  },
];
