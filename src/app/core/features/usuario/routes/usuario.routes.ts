import { Routes } from '@angular/router';
import { UsuariosComponent } from '../components/page/usuarios.component';

export const USUARIO_ROUTES: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    children: [
      {
        path: 'listado',
        loadComponent: () =>
          import('../components/listado/usuario.listado.component').then(
            (u) => u.UsuarioListadoComponent,
          ),
      },
      {
        path: 'detalle/:id',
        loadComponent: () =>
          import('../components/detalle/usuario.detalle.component').then(
            (d) => d.UsuarioDetalleComponent,
          ),
      },
    ],
  },
];
