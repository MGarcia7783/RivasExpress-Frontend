import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { InteractionService } from 'src/app/shared/interaction.service';
import { UsuarioService } from 'src/app/core/features/usuario/services/usuario.service';
import { IRegistro } from 'src/app/core/features/usuario/interface/iregistro';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
const PASSW_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonIcon,
    IonButton,
    IonInput,
    IonItem,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class RegisterPage implements OnInit {
  // inyección de dependencias
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private interaction = inject(InteractionService);

  // Variable booleana
  public passwordToggle: boolean = false;

  // Formulario reactivo
  public frmUsuarioRegistro!: FormGroup;

  // Crear formulario reactivo
  createFormUsuario() {
    this.frmUsuarioRegistro = this.fb.group(
      {
        nombreCompleto: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(60),
          ],
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
          ],
        ],
        userName: [
          '',
          [Validators.required, Validators.pattern(EMAIL_PATTERN)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(PASSW_PATTERN),
          ],
        ],
        esActivo: [true, [Validators.required]],
      },
    );
  }

  // Alias para acceder a los controles
  get fr(): { [key: string]: AbstractControl } {
    return this.frmUsuarioRegistro.controls;
  }

  // Validar control
  isInvalid(controlName: string): boolean {
    const control = this.frmUsuarioRegistro.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  // Inicializar componente
  ngOnInit(): void {
    this.createFormUsuario();
  }

  // Liberar recursos
  ionViewWillLeave(): void {
    this.frmUsuarioRegistro.reset({ esActivo: true });
    this.interaction.blurActiveElement();
  }

  // Guardar nuevo registro
  async guardarRegistro(): Promise<void> {
    if (this.frmUsuarioRegistro.invalid) {
      this.frmUsuarioRegistro.markAllAsTouched();
      return;
    }

    await this.interaction.showLoading('Creando cuenta...');

    const usuario: IRegistro = {
      nombreCompleto: this.fr['nombreCompleto'].value,
      phoneNumber: this.fr['phoneNumber'].value,
      userName: this.fr['userName'].value,
      password: this.fr['password'].value,
      rol: 'Cliente',
      esActivo: this.fr['esActivo'].value,
    };

    const request$ = this.usuarioService.registrarUsuario(usuario);

    request$.subscribe({
      next: async () => {
        await this.interaction.dismissLoading();
        this.interaction.showToast(
          'Cuenta creada correctamente',
          'success',
          'checkmark-circle-outline',
        );
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        await this.interaction.dismissLoading();
        await this.interaction.mostrarError(err);
      },
    });
  }

  // Navegar a login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
