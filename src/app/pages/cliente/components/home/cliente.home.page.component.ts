import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/core/features/categoria/services/categoria.service';
import { ProductoService } from 'src/app/core/features/producto/services/producto.service';
import { IProducto } from '../../../../core/features/producto/interface/iproducto';
import { ICategoria } from 'src/app/core/features/categoria/interface/icategoria';
import { InteractionService } from 'src/app/shared/interaction.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonRefresher,
  IonRefresherContent,
  IonModal, IonSpinner, IonBackButton } from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';
import { CarritoService } from 'src/app/core/features/pedido/services/carrito.service';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-cliente.home.page',
  templateUrl: './cliente.home.page.component.html',
  imports: [IonSpinner,
    IonModal,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonSearchbar,
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    CurrencyPipe,
    IonRefresher
],
  styleUrls: ['./cliente.home.page.component.scss'],
})
export class ClienteHomePageComponent implements OnInit {
  // Inyección de dependencias
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private interaction = inject(InteractionService);
  private authService = inject(AuthService);
  public carritoService = inject(CarritoService);
  public router = inject(Router);

  public isMenuOpen = signal(false);

  // Estados
  public productos = signal<IProducto[]>([]);
  public categorias = signal<ICategoria[]>([]);
  public isLoading = signal(true);

  // Filtros
  public filtro = signal('');
  public categoriaSeleccionada = signal<number | null>(null);

  // Paginación
  public paginaActual = signal(1);
  public totalPaginas = signal(1);
  public pageSize = 6;

  ngOnInit() {
    this.carritoService.inicializarCarrito(); // Asegurar que cargue el carrito del usuario actual
    this.cargarCategorias();
    this.cargarProductos();
  }

  // Cargar caterorías
  cargarCategorias() {
    this.categoriaService.cargarCategorias(1).subscribe({
      next: (res) => this.categorias.set(res.elementos ?? []),
    });
  }

  // Cargar productos
  async cargarProductos(event?: any) {
    this.isLoading.set(true);

    this.productoService
      .cargarProductos(
        this.paginaActual(),
        this.pageSize,
        this.filtro(),
        this.categoriaSeleccionada(),
      )
      .subscribe({
        next: async (res) => {
          this.productos.set(res.elementos ?? []);
          this.totalPaginas.set(res.totalPaginas);
          this.isLoading.set(false);
          event?.target?.complete();
        },
        error: async () => {
          (this.isLoading.set(false), event?.target?.complete());
        },
      });
  }

  // Filtros
  onSearch(event: any) {
    this.filtro.set(event.detail.value ?? '');
    this.paginaActual.set(1);
    this.cargarProductos();
  }

  // Categorías
  seleccionarCategoria(id: number | null) {
    this.categoriaSeleccionada.set(id);
    this.paginaActual.set(1);
    this.cargarProductos();
  }

  // Paginación
  nextPage() {
    if (this.paginaActual() < this.totalPaginas()) {
      this.paginaActual.update((p) => p + 1);
      this.cargarProductos();
    }
  }

  prevPage() {
    if (this.paginaActual() > 1) {
      this.paginaActual.update((p) => p - 1);
      this.cargarProductos();
    }
  }

  // Acciones del carrito de compra
  agregarAlCarrito(producto: IProducto) {
    this.carritoService.agregarProducto(producto);
  }

  // Abrir o cerrar modal
  setOpenMenu(isOpen: boolean) {
    this.interaction.blurActiveElement();
    this.isMenuOpen.set(isOpen);
  }

  irAlCarrito() {
    this.interaction.blurActiveElement();

    setTimeout(() => {
      // Espera a que el modal se cierre
      //this.router.navigate(['cliente/carrito']);
      this.router.navigate(['home/cliente/carrito']);
    }, 200);
  }

  irAMisPedidos() {
    this.interaction.blurActiveElement();
    this.setOpenMenu(false);

    setTimeout(() => {
      // Espera a que el modal se cierre
      this.router.navigate(['home/cliente/mis-pedidos']);
    }, 200);
  }

  async logout() {
    const ok = await this.interaction.presentAlert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas salir?',
      'Cancelar',
      'Salir',
    );
    if (ok) {
      this.authService.logout();
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
}
