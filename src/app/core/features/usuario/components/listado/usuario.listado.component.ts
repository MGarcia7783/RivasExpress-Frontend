import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonSearchbar,
  IonContent,
  IonIcon,
  IonToggle,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonList,
  IonLabel,
  IonButton,
} from '@ionic/angular/standalone';
import { UsuarioService } from '../../services/usuario.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario.listado',
  templateUrl: './usuario.listado.component.html',
  styleUrls: ['./usuario.listado.component.scss'],
  imports: [
    IonButton,
    IonList,
    IonSkeletonText,
    IonRefresherContent,
    IonRefresher,
    IonIcon,
    IonContent,
    IonSearchbar,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonHeader,
  ],
})
export class UsuarioListadoComponent {
  // Inyección de depencias
  private usuarioService = inject(UsuarioService);
  private interaction = inject(InteractionService);
  private router = inject(Router);

  // Estados usando signals
  filtro = signal('');
  isLoading = signal(true);

  // Estados de paginación
  paginaActual = signal(1);
  pageSize = 10;
  usuarios = this.usuarioService.usuarios;
  totalPaginas = this.usuarioService.totalPaginas;

  // Hock de inonic que se ejucta cada vez que la vista entra en pantalla
  ionViewWillEnter() {
    this.cargarUsuarios();
  }

  // Cargar usuarios
  async cargarUsuarios(event?: any) {
    this.isLoading.set(true);

    this.usuarioService
      .cargarUsuarios(this.paginaActual(), this.pageSize, this.filtro())
      .subscribe({
        next: (usuarios) => {
          this.isLoading.set(false);
          event?.target.complete();

          // Si la lista viene vacía
          if (!usuarios || usuarios.length === 0) {
            return;
          }
        },
        error: async (err) => {
          this.isLoading.set(false);
          event?.target.complete();

          if (err.status === 404) {
            this.usuarios.set([]);
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
      this.cargarUsuarios();
    }
  }

  prevPage() {
    if (this.paginaActual() > 1) {
      this.paginaActual.update((p) => p - 1);
      this.cargarUsuarios();
    }
  }

  // Filtrar usuarios
  usuariosFiltrados = computed(() => {
    const term = this.filtro().toLowerCase().trim();
    return this.usuarios().filter(
      (u) =>
        u.nombreCompleto.toLowerCase().includes(term) ||
        u.userName?.toLowerCase().includes(term) ||
        u.phoneNumber?.toLocaleLowerCase().includes(term),
    )
    .sort((a, b) => b.totalPedidos - a.totalPedidos);
  });

  // Actualiza el valor del filtro al escribir en el input
  setFiltro(event: any) {
    this.filtro.set(event.detail.value || '');
    this.paginaActual.set(1);
    this.cargarUsuarios();
  }

  verDetalle(id: string) {
    this.router.navigate(['/admin/usuario', id]);
  }
}
