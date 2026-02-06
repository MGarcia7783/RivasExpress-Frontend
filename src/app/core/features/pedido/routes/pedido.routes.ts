import { Routes } from '@angular/router';
import { PedidosComponent } from '../components/page/pedidos.component';
import { AuthGuard } from 'src/app/core/guards/auth-guard';

export const PEDIDO_ROUTES: Routes = [
  {
    path: '',
    component: PedidosComponent,
    children: [
      {
        path: 'listado',
        loadComponent: () =>
          import('../components/listado/pedido.listado.component').then(
            (p) => p.PedidoListadoComponent,
          ),
      },
      {
        path: 'detalle/:id',
        loadComponent: () =>
          import('../components/detalle/pedido.detalle.admin.component').then(
            (d) => d.PedidoDetalleAdminComponent,
          ),
      },
    ],
  },
];
