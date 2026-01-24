import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../auth/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import { Router } from '@angular/router';
import { IPedido } from '../../interface/ipedido';
import {
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonTitle,
  IonContent,
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonTextarea,
  IonText,
  IonFooter,
  IonNote,
} from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pedido.confirmar',
  templateUrl: './pedido.confirmar.component.html',
  imports: [
    IonNote,
    IonText,
    IonTextarea,
    IonButton,
    IonInput,
    IonIcon,
    IonItem,
    IonContent,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonToolbar,
    IonHeader,
    CurrencyPipe,
    ReactiveFormsModule,
  ],
  styleUrls: ['./pedido.confirmar.component.scss'],
})
export class PedidoConfirmarComponent implements OnInit {
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  public carritoService = inject(CarritoService);
  private pedidoService = inject(PedidoService);
  private interaction = inject(InteractionService);
  private router = inject(Router);

  // Formulario reactivo
  public frmCheckout!: FormGroup;

  // Estado de la ubicación
  public ubicacionLista = signal(false);

  ngOnInit() {
    this.createForm();
    this.cargarDatosUsuario();
  }

  // Inicialización
  createForm() {
    this.frmCheckout = this.fb.group({
      nombreCliente: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.minLength(8)]],
      direccionEnvio: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  // Validar si un control es válido
  isInvalid(controlName: string): boolean {
    const control = this.frmCheckout.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  // Cargar automáticamente nombre y teléfono del usuario
  cargarDatosUsuario() {
    const user = this.authService.getUsuarioLogueado();
    if (user) {
      this.frmCheckout.patchValue({
        nombreCliente: user.nombreCompleto,
        telefono: user.phoneNumber,
      });
    }
  }

  // Procesar pedido
  async enviarPedido() {
    if (this.frmCheckout.invalid) {
      this.frmCheckout.markAllAsTouched();
      this.interaction.showToast(
        'Por favor, selecciona tu ubicación en el mapa',
        'warning',
      );
      return;
    }

    const confirma = await this.interaction.presentAlert(
      'Confirmar Orden',
      '¿Deseas enviar tu pedido ahora?',
      'Cancelar',
      'Enviar Pedido',
    );

    if (!confirma) return;

    await this.interaction.showLoading('Procesando tu orden...');

    // Mapeamos al objeto IPedido que espera el Backend
    const pedido: IPedido = {
      idUsuario: this.authService.getUsuarioLogueado()!.id,
      nombreCliente: this.frmCheckout.value.nombreCliente,
      telefono: this.frmCheckout.value.telefono,
      direccionEnvio: this.frmCheckout.value.direccionEnvio,
      total: this.carritoService.montoTotal(),
      detalles: this.carritoService.itemsLista().map((i) => ({
        idProducto: i.idProducto,
        nombreProducto: i.nombreProducto,
        cantidad: i.cantidad,
        precioUnitario: i.precioUnitario,
      })),
    };

    this.pedidoService.crearPedido(pedido).subscribe({
      next: async () => {
        await this.interaction.dismissLoading();
        this.carritoService.limpiarCarrito();
        await this.interaction.presentAlert(
          '¡Pedido Recibido!',
          'Tu orden ya está en nuestra cocina. Puedes ver el estado en "Mis Pedidos".',
          null,
          'Entendido',
        );
        this.router.navigate(['/cliente/home'], { replaceUrl: true });
      },
      error: async (err) => {
        await this.interaction.dismissLoading();
        this.interaction.showToast(
          'No se pudo procesar el pedido. Intenta de nuevo.',
          'danger',
        );
      },
    });
  }
}
