import { Component, inject, OnInit, signal } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import { IPedido } from '../../interface/ipedido';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonBadge,
  IonIcon,
} from '@ionic/angular/standalone';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-mis.pedidos',
  templateUrl: './mis.pedidos.component.html',
  styleUrls: ['./mis.pedidos.component.scss'],
  imports: [
    IonIcon,
    IonBadge,
    IonSpinner,
    IonRefresherContent,
    IonRefresher,
    IonContent,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    CurrencyPipe,
    DatePipe,
  ],
})
export class MisPedidosComponent implements OnInit {
  // Inyección de dependencias
  private pedidoService = inject(PedidoService);
  private interaction = inject(InteractionService);

  // Signal
  public pedidos = signal<IPedido[]>([]);
  public isLoading = signal(true);

  ngOnInit() {
    this.cargarMisPedidos();
  }

  cargarMisPedidos(event?: any) {
    this.pedidoService.misPedidos().subscribe({
      next: (res) => {
        this.pedidos.set(res.elementos);
        this.isLoading.set(false);
        if (event) event.target.complete();
      },
      error: () => {
        this.isLoading.set(false);
        if (event) event.target.complete();
        this.interaction.showToast('Error al cargar tu historial', 'danger');
      },
    });
  }

  getBadgeColor(estado: string): string {
    const e = estado.toLowerCase();
    if (e.includes('pendiente')) return 'warning';
    if (e.includes('camino')) return 'secondary';
    if (e.includes('entregado')) return 'success';
    if (e.includes('cancelado')) return 'danger';
    return 'primary';
  }
}
