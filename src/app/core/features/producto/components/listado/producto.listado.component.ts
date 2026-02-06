import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import { Router } from '@angular/router';
import { IProducto } from '../../interface/iproducto';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonSearchbar,
  IonContent,
  IonRefresherContent,
  IonRefresher,
  IonSkeletonText,
  IonList,
  IonIcon,
  IonLabel,
  IonButton,
  IonFab,
  IonFabButton, IonSpinner } from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-producto.listado',
  templateUrl: './producto.listado.component.html',
  styleUrls: ['./producto.listado.component.scss'],
  imports: [IonSpinner,
    IonFabButton,
    IonFab,
    IonButton,
    IonLabel,
    IonIcon,
    IonList,
    IonRefresher,
    IonContent,
    IonSearchbar,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    CurrencyPipe,
  ],
})
export class ProductoListadoComponent {
  // Inyección de depencias
  private productoService = inject(ProductoService);
  private interaction = inject(InteractionService);
  private router = inject(Router);

  // Estados usando signals
    productos = signal<IProducto[]>([]);
    isLoading = signal(true);

    // Filtro y paginación
    filtro = signal('');
    paginaActual = signal(1);
    totalPaginas = signal(1);
    pageSize = 10;

  // Hock de inonic que se ejucta cada vez que la vista entra en pantalla
  ionViewWillEnter() {
    this.cargarProductos();
  }

  // Cargar productos
   async cargarProductos(event?: any) {
    this.isLoading.set(true);

    this.productoService
      .cargarProductos(this.paginaActual(), this.pageSize, this.filtro())
      .subscribe({
        next: async (res) => {
          this.productos.set(res.elementos ?? []);
          this.totalPaginas.set(res.totalPaginas);
          this.isLoading.set(false);
          event?.target?.complete();
        },
        error: async (err) => {
          this.isLoading.set(false);
          event?.target.complete();

          if (err.status === 404) {
            this.productos.set([]);
            this.totalPaginas.set(1);
            return;
          }
          await this.interaction.mostrarError(err);
        },
      });
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

  // Actualiza el valor del filtro al escribir en el input
  setFiltro(event: any) {
    this.filtro.set(event.detail.value ?? '');
    this.paginaActual.set(1);
    this.cargarProductos();
  }

  // Eliminar un producto
  async eliminar(producto: IProducto) {
    const ok = await this.interaction.presentAlert(
      'Confirmar',
      `¿Seguro de eliminar el producto "${producto.nombreProducto}"?`,
      'Cancelar',
      'Eliminar',
      true,
    );

    if (!ok) return;

    await this.interaction.showLoading('Eliminando...');

    this.productoService.eliminarProducto(producto.idProducto).subscribe({
      next: async () => {
        await this.interaction.dismissLoading();
        await this.interaction.showToast('Producto eliminado.', 'success');
        this.cargarProductos();
      },
      error: async (err) => {
        await this.interaction.dismissLoading();
        await this.interaction.mostrarError(err);
      },
    });
  }

  // Abrir formulario
  abrirFormulario(producto?: IProducto) {
    this.interaction.blurActiveElement();
    this.router.navigate(
      producto
        ? ['/home/admin/producto/registro', producto.idProducto]
        : ['/home/admin/producto/registro'],
    );
  }
}
