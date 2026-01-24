import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTextarea,
  IonTitle,
  IonText,
} from '@ionic/angular/standalone';
import { CategoriaService } from '../../services/categoria.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import { ICategoria } from '../../interface/icategoria';

@Component({
  selector: 'app-categoria.registro',
  templateUrl: './categoria.registro.component.html',
  styleUrls: ['./categoria.registro.component.scss'],
  imports: [
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonContent,
    IonTextarea,
    ReactiveFormsModule,
  ],
})
export class CategoriaRegistroComponent implements OnInit {
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private categoriaService = inject(CategoriaService);
  private interaction = inject(InteractionService);
  private route = inject(ActivatedRoute);

  // Formulario reactivo
  public frmCategoriaRegistro!: FormGroup;

  // Crear formulario
  createFormCategoria(isEdit = false) {
    this.frmCategoriaRegistro = this.fb.group({
      id: [null],
      nombreCategoria: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40),
        ],
      ],
      descripcionCategoria: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
    });
  }

  // Alias para acceder a los controles del formulario
  get fr(): { [key: string]: AbstractControl } {
    return this.frmCategoriaRegistro.controls;
  }

  // Validar si un control es válido
  isInvalid(controlName: string): boolean {
    const control = this.frmCategoriaRegistro.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  // Inicializar componentes
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.createFormCategoria(!!id);

    if (id) this.cargarCategoria(id);
  }

  // Liberar recursos
  ngOnDestroy(): void {
    this.frmCategoriaRegistro.reset();
  }

  //  Cargar categoría para edición
  private cargarCategoria(id: number): void {
    this.categoriaService.obtenerPorId(id).subscribe({
      next: (categoria) => {
        if (!categoria) return;

        this.frmCategoriaRegistro.patchValue({
          id: categoria.idCategoria,
          nombreCategoria: categoria.nombreCategoria,
          descripcionCategoria: categoria.descripcionCategoria,
        });
      },
      error: (err) => this.interaction.mostrarError(err),
    });
  }

  // Guardar registro
  async guardarRegistro() {
    if (this.frmCategoriaRegistro.invalid) {
      this.frmCategoriaRegistro.markAllAsTouched();
      return;
    }

    const id = this.fr['id'].value;
    await this.interaction.showLoading(id ? 'Actualizando...' : 'Guardando...');

    const categoria: ICategoria = {
      idCategoria: id,
      nombreCategoria: this.fr['nombreCategoria'].value,
      descripcionCategoria: this.fr['descripcionCategoria'].value,
    };

    const request$ = !id
      ? this.categoriaService.crearCategoria(categoria)
      : this.categoriaService.actualizarCategoria(id, categoria);

    request$.subscribe({
      next: async () => {
        await this.interaction.dismissLoading();
        await this.interaction.showToast(
          id ? 'Registro actualizado con éxito.' : 'Categoría creada.',
          'success',
          'checkmark-circle-outline',
        );
        this.interaction.blurActiveElement();
        this.router.navigate(['/admin/categoria']);
      },
      error: async (err) => {
        await this.interaction.dismissLoading();
        this.interaction.mostrarError(err);
      },
    });
  }
}
