import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // 2. --- SECCION DE AUTENTICACIÓN ---
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.page').then((m) => m.LoginPage),
  },

  {
    path: 'auth/register',
    loadComponent: () =>
      import('./pages/auth/register/register.page').then((m) => m.RegisterPage),
  },

  // --- SECCIÓN ADMINISTRADOR ---
  {
    path: 'admin/home',
    loadComponent: () =>
      import('./pages/admin/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
  },

  {
    path: 'admin/categoria',
    loadComponent: () =>
      import('./core/features/categoria/components/listado/categoria.listado.component').then(
        (m) => m.CategoriaListadoComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
  },

  {
    path: 'admin/categoria/registro',
    loadComponent: () =>
      import('./core/features/categoria/components/registro/categoria.registro.component').then(
        (m) => m.CategoriaRegistroComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
  },

  {
    path: 'admin/categoria/registro/:id',
    loadComponent: () =>
      import('./core/features/categoria/components/registro/categoria.registro.component').then(
        (m) => m.CategoriaRegistroComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
  },

  {
    path: 'admin/producto',
    loadComponent: () =>
      import('./core/features/producto/components/listado/producto.listado.component').then(
        (m) => m.ProductoListadoComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
  },

  {
    path: 'admin/producto/registro',
    loadComponent: () =>
      import('./core/features/producto/components/registro/producto.registro.component').then(
        (m) => m.ProductoRegistroComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
  },

  {
    path: 'admin/producto/registro/:id',
    loadComponent: () =>
      import('./core/features/producto/components/registro/producto.registro.component').then(
        (m) => m.ProductoRegistroComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
  },

  {
    path: 'admin/pedido',
    loadComponent: () =>
      import('./core/features/pedido/components/listado/pedido.listado.component').then(
        (m) => m.PedidoListadoComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
  },

  {
    path: 'admin/pedido/detalle/:id',
    loadComponent: () =>
      import('./core/features/pedido/components/detalle/pedido.detalle.admin.component').then(
        (m) => m.PedidoDetalleAdminComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
  },

  {
    path: 'admin/usuario',
    loadComponent: () =>
      import('./core/features/usuario/components/listado/usuario.listado.component').then(
        (m) => m.UsuarioListadoComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
  },

  {
    path: 'admin/usuario/:id',
    loadComponent: () =>
      import('./core/features/usuario/components/detalle/usuario.detalle.component').then(
        (m) => m.UsuarioDetalleComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Administrador' },
  },

  // --- SECCIÓN CLIENTE ---
  {
    path: 'cliente/home',
    loadComponent: () =>
      import('./pages/cliente/cliente.home.page.component').then(
        (m) => m.ClienteHomePageComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Cliente' },
  },

  // RUTA DEL CARRITO
  {
    path: 'cliente/carrito',
    loadComponent: () =>
      import('./core/features/pedido/components/carrito/carrito.component').then(
        (m) => m.CarritoComponent, // <--- Verifica que este sea el nombre de la clase en el .ts
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Cliente' },
  },

  {
    path: 'cliente/checkout',
    loadComponent: () =>
      import('./core/features/pedido/components/confirmar/pedido.confirmar.component').then(
        (m) => m.PedidoConfirmarComponent, // <--- Verifica que este sea el nombre de la clase en el .ts
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Cliente' },
  },

  {
    path: 'cliente/mis-pedidos',
    loadComponent: () =>
      import('./core/features/pedido/components/mis-pedidos/mis.pedidos.component').then(
        (m) => m.MisPedidosComponent,
      ),
    canActivate: [AuthGuard],
    data: { rol: 'Cliente' },
  },

  // 2. --- REDIRECCIONES Y FALLBACK ---
  {
    path: '',
    redirectTo: 'login',
    // redirectTo: 'cliente/home',
    pathMatch: 'full',
  },

  // Fallback a Login en caso de ruta no encontrada
  {
    path: '**',
    redirectTo: 'login',
  },
];
