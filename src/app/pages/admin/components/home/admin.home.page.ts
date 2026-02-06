import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import { PedidoService } from 'src/app/core/features/pedido/services/pedido.service';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { interval, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin.home.page.html',
  styleUrls: ['./admin.home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
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
export class AdminHomePage {
  // Inyección de dependencias
  private router = inject(Router);
  private authService = inject(AuthService);
  private interaction = inject(InteractionService);
  private pedidoService = inject(PedidoService);

  // Nombre del usuario mostrado en la pantalla
  public userName: string = 'Administrador';

  // Variable para refrescar cada minuto
  private destroy$ = new Subject<void>();

  // Definición del menú de administración
  public adminModules = [
    {
      title: 'Categorías',
      label: 'Gestión de categorías',
      icon: 'list-outline',
      module: 'categoria',
      path: 'listado',
      color: '#6366f1',
    },
    {
      title: 'Productos',
      label: 'Menú y precios',
      icon: 'fast-food-outline',
      module: 'producto',
      path: 'listado',
      color: '#10b981',
    },
    {
      title: 'Pedidos',
      label: 'Pedidos activos',
      icon: 'bag-handle-outline',
      module: 'pedido',
      path: 'listado',
      color: '#f59e0b',
      badgeSignal: this.pedidoService.pendientesCount,
    },
    {
      title: 'Usuarios',
      label: 'Clientes y staff',
      icon: 'people-outline',
      module: 'usuario',
      path: 'listado',
      color: '#06b6d4',
    },
  ];

  // Inicializar componentes al cargar la página
  ngOnInit() {
    this.getUserInfo();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Refrescar el home
  ionViewWillEnter() {
    const cargar = () => {
      if (!this.authService.getToken()) return of(null);
      return this.pedidoService.cargarPedidos(1, 10);
    };

    interval(60000)
      .pipe(startWith(0), switchMap(cargar), takeUntil(this.destroy$))
      .subscribe();
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
  navTo(item: any) {
    this.router.navigate(['/home/admin', item.module, item.path]);
  }

  // Cerrar sesión
  logout() {
    this.interaction.blurActiveElement();

    this.destroy$.next(); // corta intervalos antes de salir
    this.authService.logout();
    this.router.navigate([`/login`]);
  }
}
