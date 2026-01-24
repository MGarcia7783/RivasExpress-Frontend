import { routes } from './../../../../../app.routes';
import { Component, inject, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
} from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';
import { InteractionService } from 'src/app/shared/interaction.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  imports: [
    IonFooter,
    IonContent,
    IonIcon,
    IonButton,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    CurrencyPipe
  ],
})
export class CarritoComponent {
  // Inyección de dependencias
  public carritoService = inject(CarritoService);
  private router = inject(Router);
  private interaction = inject(InteractionService);

  // Navegar a la pantalla de chekout para confirmar orden
  irAlCheckout() {
    this.interaction.blurActiveElement();
    this.router.navigate(['/cliente/checkout']);
  }

  // Volver a la lista de productos
  seguirComprando() {
    this.router.navigate(['/cliente/home']);
  }
}
