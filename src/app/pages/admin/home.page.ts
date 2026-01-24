import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import { PedidoService } from 'src/app/core/features/pedido/services/pedido.service';
import { Icon } from 'ionicons/dist/types/components/icon/icon';

@Component({
  selector: 'app-admin-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonButton,
    IonButtons,
    CommonModule,
    FormsModule,
  ],
})
export class HomePage {
  // Inyección de dependencias
  private router = inject(Router);
  private authService = inject(AuthService);
  private interaction = inject(InteractionService);
  private pedidoService = inject(PedidoService);

  // Nombre del usuario mostrado en la pantalla
  public userName: string = 'Administrador';

  // Variable para refrescar cada minuto
  private intervalId: any;

  // Definición del menú de administración
  public adminModules = [
    {
      title: 'Categorías',
      label: 'Organizar menú',
      icon: 'list-outline',
      path: 'categoria',
      color: '#6366f1',
    },
    {
      title: 'Productos',
      label: 'Precios y stock',
      icon: 'fast-food-outline',
      path: 'producto',
      color: '#10b981',
    },
    {
      title: 'Pedidos',
      label: 'Órdenes hoy',
      icon: 'bag-handle-outline',
      path: 'pedido',
      color: '#f59e0b',
      badgeSignal: this.pedidoService.pendientesCount,
    },
    {
      title: 'Usuarios',
      label: 'Staff y clientes',
      icon: 'people-outline',
      path: 'usuario',
      color: '#06b6d4',
    },
  ];

  // Inicializar componentes al cargar la página
  ngOnInit() {
    this.getUserInfo();
  }

  // Refrescar el home
  ionViewWillEnter() {
    this.pedidoService.cargarPedidos(1, 10).subscribe();

    // Refrescar cada 1 minuto automáticamente
    this.intervalId = setInterval(() => {
      this.pedidoService.cargarPedidos(1, 10).subscribe();
    }, 60000);
  }

  // Obtener información del usuario desde el token
  getUserInfo() {
    const decodedToken = this.authService.getDecodedToken();

    if (decodedToken) {
      // El nombre suele venir en el claim 'unique_name', 'name' o el que definieras en .NET
      // Si en tu JWT guardaste el nombre, asígnaselo aquí:
      this.userName =
        decodedToken.unique_name || decodedToken.name || 'Administrador';
    }
  }

  // Navegar a otra ruta del menú
  navTo(path: string) {
    this.router.navigate([`/admin/${path}`]);
  }

  // Cerrar sesión
  logout() {
    this.authService.logout();
    this.router.navigate([`/login`]);
  }

  // Limpiar enfoque al salir de la página
  ionViewWillLeave(): void {
    this.interaction.blurActiveElement();
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
