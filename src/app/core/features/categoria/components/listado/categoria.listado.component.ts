import { ICategoria } from '../../interface/icategoria';
import { Component, inject, signal } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonLabel,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonFab,
  IonFabButton,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoria.page',
  templateUrl: './categoria.listado.component.html',
  styleUrls: ['./categoria.listado.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonRefresherContent,
    IonRefresher,
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonLabel,
    IonButton,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonFab,
    IonFabButton,
    CommonModule,
  ],
})
export class CategoriaListadoComponent {
  // Inyección de depencias
  private categoriaService = inject(CategoriaService);
  private interaction = inject(InteractionService);
  private router = inject(Router);

  // Estados usando signals
  categorias = signal<ICategoria[]>([]);
  isLoading = signal(true);

  // Filtro y paginación
  filtro = signal('');
  paginaActual = signal(1);
  totalPaginas = signal(1);
  pageSize = 10;

  // Hock de inonic que se ejucta cada vez que la vista entra en pantalla
  ionViewWillEnter() {
    this.cargarCategorias();
  }

  // Cargar categorias
  async cargarCategorias(event?: any) {
    this.isLoading.set(true);

    this.categoriaService
      .cargarCategorias(this.paginaActual(), this.pageSize, this.filtro())
      .subscribe({
        next: (res) => {
          this.categorias.set(res.elementos ?? []);
          this.totalPaginas.set(res.totalPaginas);
          this.isLoading.set(false);
          event?.target?.complete();
        },
        error: async (err) => {
          this.isLoading.set(false);
          event?.target.complete();

          if (err.status === 404) {
            this.categorias.set([]);
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
      this.cargarCategorias();
    }
  }

  prevPage() {
    if (this.paginaActual() > 1) {
      this.paginaActual.update((p) => p - 1);
      this.cargarCategorias();
    }
  }

  // Actualiza el valor del filtro al escribir en el input
  setFiltro(event: any) {
    this.filtro.set(event.detail.value ?? '');
    this.paginaActual.set(1);
    this.cargarCategorias();
  }

  // Eliminar una categoría
  async eliminar(categoria: ICategoria) {
    const ok = await this.interaction.presentAlert(
      'Confirmar',
      `¿Estás seguro de eliminar la categoría "${categoria.nombreCategoria}"?`,
      'Cancelar',
      'Eliminar',
      true,
    );

    if (!ok) return;

    await this.interaction.showLoading('Eliminando...');

    this.categoriaService.eliminarCategoria(categoria.idCategoria).subscribe({
      next: async () => {
        await this.interaction.dismissLoading();
        await this.interaction.showToast('Categoría eliminada.', 'success');
        this.cargarCategorias();
      },
      error: async (err) => {
        await this.interaction.dismissLoading();
        await this.interaction.mostrarError(err);
      },
    });
  }

  // Abrir formulario
  abrirFormulario(categoria?: ICategoria) {
    this.interaction.blurActiveElement();
    this.router.navigate(
      categoria
        ? ['/admin/categoria/registro', categoria.idCategoria]
        : ['/admin/categoria/registro'],
    );
  }
}
