import { Routes } from '@angular/router';
import { ProductosComponent } from '../components/page/productos.component';
import { AuthGuard } from 'src/app/core/guards/auth-guard';

export const PRODUCTO_ROUTES: Routes = [
  {
    path: '',
    component: ProductosComponent,
    children: [
      {
        path: 'listado',
        loadComponent: () =>
          import('../components/listado/producto.listado.component').then(
            (p) => p.ProductoListadoComponent,
          ),
      },
      {
        path: 'registro',
        loadComponent: () =>
          import('../components/registro/producto.registro.component').then(
            (p) => p.ProductoRegistroComponent,
          ),
      },
      {
        path: 'registro/:id',
        loadComponent: () =>
          import('../components/registro/producto.registro.component').then(
            (p) => p.ProductoRegistroComponent,
          ),
      },
    ],
  },
];
