import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonToggle,
  IonLabel,
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonBadge,
} from '@ionic/angular/standalone';
import { UsuarioService } from '../../services/usuario.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import { IUsuario } from '../../interface/iusuario';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-usuario.detalle',
  templateUrl: './usuario.detalle.component.html',
  styleUrls: ['./usuario.detalle.component.scss'],
  imports: [
    IonBadge,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonLabel,
    IonToggle,
    IonItem,
    IonIcon,
    IonButton,
    IonContent,
    DatePipe,
    CurrencyPipe,
    IonSpinner
],
})
export class UsuarioDetalleComponent implements OnInit {
  // Inyección de depencias
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private interaction = inject(InteractionService);

  // Signal para manejar el estado del usuario
  public user = signal<IUsuario | null>(null);
  public isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.cargarUsuario(id);
    else this.router.navigate(['/admin/usuario']);
  }

  // Cargar usuario
  async cargarUsuario(id: string) {
    this.isLoading.set(true);

    this.usuarioService.obtenerPorId(id).subscribe({
      next: async (res: IUsuario | null) => {
        this.user.set(res);
        this.isLoading.set(false);
      },
      error: async () => {
        await this.interaction.showToast('No se pudo cargar el perfil', 'danger');
        this.router.navigate(['/admin/usuario']);
      },
    });
  }

  // Cambiar estado de usuario
  async cambiarEstado(event: any) {
    const usuario = this.user();
    if (!usuario) return;

    // Guardamos la referencia al elemento HTML (el toggle)
    const toggleElement = event.target as HTMLIonToggleElement;
    const nuevoEstado = event.detail.checked;

    const ok = await this.interaction.presentAlert(
      'Confirmar Acción',
      `¿Desea ${nuevoEstado ? 'activar' : 'desactivar'} al cliente: ${usuario.nombreCompleto}?`,
      'Cancelar',
      'Confirmar',
    );

    if (!ok) {
      toggleElement.checked = !nuevoEstado;
      return;
    }

    await this.interaction.showLoading('Actualizando estado...');

    this.usuarioService.cambiarEstado(usuario.id, nuevoEstado).subscribe({
      next: async () => {
        // Actualizamos el estado localmente (Signal)
        this.user.update((u) => (u ? { ...u, esActivo: nuevoEstado } : null));

        await this.interaction.dismissLoading();
        this.interaction.showToast(
          'Estado actualizado',
          'success',
          'checkmark-circle-outline',
        );
      },
      error: async (err) => {
        await this.interaction.dismissLoading();
        this.user.set({ ...usuario }); // Revertimos en caso de error
        this.interaction.mostrarError(err);
      },
    });
  }

  // Helper para colores de pedidos
  getEstadoColor(estado: string): string {
    const e = estado.toLowerCase();
    if (e.includes('entregado')) return 'success';
    if (e.includes('pendiente')) return 'warning';
    if (e.includes('cancelado')) return 'danger';
    return 'primary';
  }

  // Navegar al detalle del pedido
  verPedido(id: number) {
    this.router.navigate(['/admin/pedido/detalle', id]);
  }

  // --- Acceso a whatsapp ---
  irAWhatsapp() {
    const usuario = this.user();
    if (!usuario?.phoneNumber) {
      this.interaction.showToast(
        'El usuario no tiene un teléfono registrado',
        'warning',
      );
      return;
    }
    // Limpiamos el número de caracteres no numéricos
    const tel = usuario.phoneNumber.replace(/\D/g, '');
    const mensaje = encodeURIComponent(
      `Hola ${usuario.nombreCompleto}, te contactamos de Rivas Express...`,
    );
    window.open(`https://wa.me/${tel}?text=${mensaje}`, '_system');
  }
}
