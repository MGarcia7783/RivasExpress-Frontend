import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
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
import { AuthService } from 'src/app/core/auth/auth.service';
import { InteractionService } from 'src/app/shared/interaction.service';
import { isPlatform } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
const PASSW_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage implements OnInit {
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private interaction = inject(InteractionService);

  // Variable booleana
  public passwordToggle: boolean = false;

  // Formulario reactivo para login
  public frmLogin!: FormGroup;

  // Crear formulario
  createFormLogin() {
    this.frmLogin = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(PASSW_PATTERN),
        ],
      ],
    });
  }

  // Alias para acceder a los controles del formulario
  get fr(): { [key: string]: AbstractControl } {
    return this.frmLogin.controls;
  }

  // Validar si un control es inválido
  isInvalid(controlName: string): boolean {
    const control = this.frmLogin.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  // Inicializar componentes
  ngOnInit(): void {
    this.createFormLogin();
  }

  // Liberar recursos
  ionViewWillLeave(): void {
    this.frmLogin.reset();
    this.interaction.blurActiveElement();
  }

  // Login normal
  public async login(): Promise<void> {
    if (this.frmLogin.invalid) {
      this.frmLogin.markAllAsTouched();
      return;
    }

    const { userName, password } = this.frmLogin.value;

    await this.interaction.showLoading('Iniciando sesión...');

    this.authService.login(userName, password).subscribe({
      next: async (response) => {
        await this.interaction.dismissLoading();

        await this.interaction.showToast(
          `Bienvenido: ${response?.usuario.nombreCompleto ?? ''}`,
          'success',
          'person-circle-outline',
          2500,
        );

        // Redirigir según rol
        if (response.usuario.rol === 'Administrador') {
          this.router.navigate(['/admin/home']);
        } else {
          this.router.navigate(['/cliente/home']);
        }
      },
      error: async (err) => {
        await this.interaction.dismissLoading();
        await this.interaction.mostrarError(err);
      },
    });
  }

  // Login con google (solo movil)
  async loginWithGoogle() {
    if (!isPlatform('capacitor')) {
      await this.interaction.showToast(
        'Solo disponible en la app móvil.',
        'warning',
      );
      return;
    }

    await this.interaction.showLoading('Conectando con Google...');

    // 1. Abrir ventana de Google
    const googleUser = await GoogleAuth.signIn();
    const idToken = googleUser.authentication.idToken;

    // 2. Enviar token a tu API de C#
    this.authService.loginConGoogle(idToken).subscribe({
      next: async (res) => {
        await this.interaction.dismissLoading();

        await this.interaction.showToast(
          `Bienvenido: ${res.usuario.nombreCompleto}`,
          'success',
          'person-circle-outline',
        );

        // 3. Redirigir según rol
        if (res.usuario.rol === 'Administrador') {
          this.router.navigate(['/admin/home']);
        } else {
          this.router.navigate(['/cliente/home']);
        }
      },
      error: async (err) => {
        await this.interaction.dismissLoading();
        await this.interaction.mostrarError(err);
      },
    });
  }

  // Navegar a la página de registro
  goToRegister(): void {
    setTimeout(() => this.router.navigate(['/auth/register']), 200);
  }
}
