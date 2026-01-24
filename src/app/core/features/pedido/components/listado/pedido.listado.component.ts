import { Component, inject, OnInit, signal } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import { Router } from '@angular/router';
import { IPedido } from '../../interface/ipedido';
import {
  ActionSheetController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonButton,
  IonSearchbar,
  IonChip,
  IonLabel,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonBadge,
  IonIcon,
  IonBackButton,
} from '@ionic/angular/standalone';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pedido.listado',
  templateUrl: './pedido.listado.component.html',
  styleUrls: ['./pedido.listado.component.scss'],
  imports: [
    IonBackButton,
    IonIcon,
    IonBadge,
    IonSkeletonText,
    IonRefresherContent,
    IonRefresher,
    IonContent,
    IonSearchbar,
    IonButton,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    CurrencyPipe,
    DatePipe,
  ],
})
export class PedidoListadoComponent {
  // Inyección de depencias
  private pedidoService = inject(PedidoService);
  private interaction = inject(InteractionService);
  private router = inject(Router);
  private actionSheetCrl = inject(ActionSheetController);

  // Estados usando signals
  pedidos = signal<IPedido[]>([]);
  isLoading = signal(true);

  // Filtros y paginación
  filtro = signal('');
  paginaActual = signal(1);
  totalPaginas = signal(1);
  pageSize = 10;

  // Cargar al entrar
  ionViewWillEnter() {
    this.cargarPedidos();
  }

  // Cargar pedidos
  async cargarPedidos(event?: any) {
    this.isLoading.set(true);

    this.pedidoService
      .cargarPedidos(this.paginaActual(), this.pageSize, this.filtro())
      .subscribe({
        next: (res) => {
          this.pedidos.set(res.elementos ?? []);
          this.totalPaginas.set(res.totalPaginas);
          this.isLoading.set(false);
          event?.target?.complete();
        },
        error: async (err) => {
          this.isLoading.set(false);
          event?.target?.complete();

          if (err.status === 404) {
            this.pedidos.set([]);
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
      this.cargarPedidos();
    }
  }

  prevPage() {
    if (this.paginaActual() > 1) {
      this.paginaActual.update((p) => p - 1);
      this.cargarPedidos();
    }
  }

  setFiltro(event: any) {
    this.filtro.set(event.detail.value ?? '');
    this.paginaActual.set(1);
    this.cargarPedidos();
  }

  // Badge
  getBadgeColor(estado: string) {
    return (
      {
        Pendiente: 'warning',
        'En Camino': 'secondary',
        Entregado: 'success',
        Cancelado: 'danger',
      }[estado] ?? 'medium'
    );
  }

  // Detalle
  verDetalle(id: number) {
    this.interaction.blurActiveElement();
    this.router.navigate(['/admin/pedido/detalle', id]);
  }

  // Cambiar estado
  async gestionEstado(pedido: IPedido, ev: Event) {
    ev.stopPropagation(); // No abrir detalle

    const sheet = await this.actionSheetCrl.create({
      header: `Pedido #${pedido.idPedido}`,
      subHeader: 'Cambiar estado de la orden',
      mode: 'ios',
      buttons: [
        {
          text: 'Pendiente',
          icon: 'time-outline',
          handler: () => this.confirmarCambio(pedido, 'Pendiente'),
        },
        {
          text: 'En Camino',
          icon: 'bicycle-outline',
          handler: () => this.confirmarCambio(pedido, 'En Camino'),
        },
        {
          text: 'Entregado',
          icon: 'checkmark-done-outline',
          handler: () => this.confirmarCambio(pedido, 'Entregado'),
        },
        {
          text: 'Cancelar',
          role: 'destructive',
          icon: 'close-circle',
          handler: () => this.confirmarCambio(pedido, 'Cancelado'),
        },
        { text: 'Cerrar', role: 'cancel' },
      ],
    });

    await sheet.present();
  }

  // Confirmar cambio
  private async confirmarCambio(pedido: IPedido, estado: string) {
    const ok = await this.interaction.presentAlert(
      'Confirmar',
      `¿Mover estado a "${estado}"?`,
      'No',
      'Sí',
    );

    if (!ok) return;

    this.pedidoService.cambiarEstado(pedido.idPedido!, estado).subscribe({
      next: async () => {
        await this.interaction.showToast(
          'Estado actualizado',
          'success',
          'checkmark-circle-outline',
        );
        this.cargarPedidos();
      },
      error: async (err) => {
        this.interaction.blurActiveElement();
        this.interaction.mostrarError(err);
      },
    });
  }
}
