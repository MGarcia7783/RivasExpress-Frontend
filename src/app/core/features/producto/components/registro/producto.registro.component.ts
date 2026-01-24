import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
  IonText,
  IonTextarea,
  IonLabel,
  IonToggle,
  IonButton,
  IonSelectOption,
  IonSelect,
  IonItem,
  IonInput,
} from '@ionic/angular/standalone';
import { CategoriaService } from '../../../categoria/services/categoria.service';
import { ICategoria } from '../../../categoria/interface/icategoria';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

// Solo números (enteros o decimales con punto)
const PRICE_PATTERN = /^(?!0+(\.0{1,2})?$)\d+(\.\d{1,2})?$/;

@Component({
  selector: 'app-producto.registro',
  templateUrl: './producto.registro.component.html',
  styleUrls: ['./producto.registro.component.scss'],
  imports: [
    IonButton,
    IonToggle,
    IonLabel,
    IonTextarea,
    IonInput,
    IonItem,
    IonIcon,
    IonContent,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    ReactiveFormsModule,
    IonSelectOption,
    IonSelect,
  ],
})
export class ProductoRegistroComponent implements OnInit, OnDestroy {
  // Inyección de depencias
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);
  private interaction = inject(InteractionService);

  // Signals
  public imagePreview = signal<string | undefined>(undefined);
  public categorias = signal<ICategoria[]>([]);

  // Crear formulario reactivo
  public frmProductoRegistro!: FormGroup;

  createFormProducto(isEdit = false) {
    this.frmProductoRegistro = this.fb.group({
      id: [null],
      nombreProducto: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40),
        ],
      ],
      descripcionProducto: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      precio: [
        '',
        [
          Validators.required,
          Validators.min(0.01), // No permite <= 0
          Validators.pattern(PRICE_PATTERN),
        ],
      ],
      disponible: [true, Validators.required],
      esCombo: [false, Validators.required],
      idCategoria: ['', Validators.required],
      imagen: [null, isEdit ? [] : Validators.required],
    });
  }

  // Alias para acceder a los controles del formulario
  get fr(): { [key: string]: AbstractControl } {
    return this.frmProductoRegistro.controls;
  }

  // Validar si un control es válido
  isInvalid(controlName: string): boolean {
    const control = this.frmProductoRegistro.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  // Inicializar componente
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.createFormProducto(!!id); // <- Cambio: pasar flag edición
    this.cargarListaCategorias();

    if (id) this.cargarProducto(id);
  }

  // Liberar recursos
  ngOnDestroy(): void {
    this.frmProductoRegistro.reset();
    this.imagePreview.set(undefined);
  }

  // Cargar categorías
  private cargarListaCategorias() {
    this.categoriaService.cargarCategorias().subscribe({
      next: (res) => this.categorias.set(res.elementos ?? []),
    });
  }

  // ---------------- Selección de imagen (web + móvil) ----------------
  onSelectImage(fileInput: HTMLInputElement) {
    if (Capacitor.getPlatform() === 'web') {
      // Selector de archivos web
      fileInput.click();
    } else {
      // Móvil => cámara / galería
      this.seleccionarImagenMovil();
    }
  }

  // Web
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
      this.frmProductoRegistro.patchValue({ imagen: file });
    };
    reader.readAsDataURL(file);
  }

  // Móvil
  async seleccionarImagenMovil() {
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });
      if (image) {
        const blob = this.dataURLToBlob(image.dataUrl!);
        const file = new File([blob], 'imagen_producto.png', {
          type: 'image/png',
        });
        this.imagePreview.set(image.dataUrl);
        this.frmProductoRegistro.patchValue({ imagen: file });
      }
    } catch {
      this.interaction.showToast('Selección cancelada');
    }
  }

  // Covertir Base64 a Blob
  private dataURLToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  // Cargar producto para edición
  private cargarProducto(id: number): void {
    this.productoService.obtenerPorId(id).subscribe({
      next: (producto) => {
        if (!producto) return;

        this.imagePreview.set(producto.imagen);
        this.frmProductoRegistro.patchValue({
          id: producto.idProducto,
          nombreProducto: producto.nombreProducto,
          descripcionProducto: producto.descripcionProducto,
          precio: producto.precio,
          disponible: producto.disponible,
          esCombo: producto.esCombo,
          idCategoria: producto.idCategoria,
          imagen: producto.imagen,
        });
      },
      error: (err) => this.interaction.mostrarError(err),
    });
  }

  // Guardar registro
  async guardarRegistro() {
    if (this.frmProductoRegistro.invalid) {
      this.frmProductoRegistro.markAllAsTouched();
      return;
    }

    const id = this.fr['id'].value;
    await this.interaction.showLoading(id ? 'Actualizando...' : 'Guardando...');

    const formData = new FormData();
    formData.append('nombreProducto', this.fr['nombreProducto'].value);
    formData.append(
      'descripcionProducto',
      this.fr['descripcionProducto'].value,
    );
    formData.append('precio', String(this.fr['precio'].value));
    formData.append('disponible', String(this.fr['disponible'].value));
    formData.append('esCombo', String(this.fr['esCombo'].value));
    formData.append('idCategoria', String(this.fr['idCategoria'].value));

    // Imagen
    const imagen = this.fr['imagen'].value;

    if (!id) {
      // cear → imagen obligatoria
      if (!(imagen instanceof File)) {
        await this.interaction.dismissLoading();
        this.interaction.showToast('Debes seleccionar una imagen.');
        return;
      }
      formData.append('imagen', imagen);
    } else {
      // editar → solo si el usuario cambió la imagen
      if (imagen instanceof File) {
        formData.append('imagen', imagen);
      }
    }

    const request$ = id
      ? this.productoService.actualizarProducto(id, formData)
      : this.productoService.crearProducto(formData);

    request$.subscribe({
      next: async () => {
        await this.interaction.dismissLoading();
        this.interaction.showToast(
          id ? 'Producto actualizado' : 'Producto creado',
          'success',
          'checkmark-circle-outline'
        );
        this.interaction.blurActiveElement();
        this.router.navigate(['/admin/producto']);
      },
      error: async (err) => {
        await this.interaction.dismissLoading();
        await this.interaction.mostrarError(err);
      },
    });
  }
}
