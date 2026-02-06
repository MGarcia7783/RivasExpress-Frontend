import { Routes } from '@angular/router';
import { CategoriasComponent } from '../components/page/categorias.component';
import { AuthGuard } from 'src/app/core/guards/auth-guard';

export const CATEGORIA_ROUTERS: Routes = [
  {
    path: '',
    component: CategoriasComponent,
    children: [
      {
        path: 'listado',
        loadComponent: () =>
          import('../components/listado/categoria.listado.component').then(
            (c) => c.CategoriaListadoComponent,
          ),
      },
      {
        path: 'registro',
        loadComponent: () =>
          import('../components/registro/categoria.registro.component').then(
            (c) => c.CategoriaRegistroComponent,
          ),
      },
      {
        path: 'registro/:id',
        loadComponent: () =>
          import('../components/registro/categoria.registro.component').then(
            (c) => c.CategoriaRegistroComponent,
          ),
      },
    ],
  },
];
