import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import { IPedido } from '../../interface/ipedido';
import {
  IonHeader,
  IonBackButton,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonIcon,
  IonBadge,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/angular/standalone';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pedido.detalle.admin',
  templateUrl: './pedido.detalle.admin.component.html',
  styleUrls: ['./pedido.detalle.admin.component.scss'],
  imports: [
    IonButton,
    IonLabel,
    IonItem,
    IonBadge,
    IonIcon,
    IonSpinner,
    IonContent,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonHeader,
    DatePipe,
    CurrencyPipe,
  ],
})
export class PedidoDetalleAdminComponent implements OnInit {
  // Inyección de dependencias
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pedidoService = inject(PedidoService);
  private interaction = inject(InteractionService);

  // Signal
  public pedido = signal<IPedido | null>(null);
  public isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.cargarPedido(Number(id));
    else this.router.navigate(['admin/pedido']);
  }

  // Cargar pedido
  async cargarPedido(id: number) {
    this.isLoading.set(true);

    this.pedidoService.obtenerPorId(id).subscribe({
      next: (res) => {
        this.pedido.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.interaction.showToast('Error al cargar el pedido', 'danger');
        this.router.navigate(['admin/pedido']);
      },
    });
  }

  // Acciones del pedido
  async irAWhatsapp() {
    const p = this.pedido();

    if (!p?.telefono) {
      await this.interaction.showToast(
        'Pedido sin teléfono registrado',
        'warning',
      );
      return;
    }
    const tel = p.telefono.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Hola ${p.nombreCliente}, tu pedido #${p.idPedido} de Rivas Express está siendo procesado.`,
    );
    window.open(`https://wa.me/${tel}?text=${msg}`, '_system');
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
}
