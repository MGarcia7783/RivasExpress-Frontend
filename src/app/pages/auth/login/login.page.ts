import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
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
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { lockClosed, personCircle, mail } from 'ionicons/icons';
import { AuthService } from 'src/app/core/auth/auth.service';
import { InteractionService } from 'src/app/shared/interaction.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
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
export class LoginPage {
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private interaction = inject(InteractionService);

  // Formulario reactivo para login
  loginForm: FormGroup = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    // Registrar iconos necesarios para ion-icon
    addIcons({
      mail: mail,
      'person-circle': personCircle,
      'lock-closed': lockClosed,
    });
  }

  async onSubmit(): Promise<void> {
    // Verificar si el formulario es válido
    if (this.loginForm.invalid) {
      await this.interaction.showToast(
        'Ingrese un correo y contraseña válidos.',
        2500
      );
      return;
    }

    const { userName, password } = this.loginForm.value;

    try {
      await this.interaction.showLoading('Iniciando sesión...');

      this.authService.login(userName, password).subscribe({
        next: async (response) => {
          await this.interaction.dismissLoading();

          // Mensaje de bienvenida
          await this.interaction.showToast(
            `Bienvenido de nuevo: ${response?.usuario.nombreCompleto ?? ''}`,
            2500
          );

          // Navegar a la página principal
          this.router.navigate(['/home']);
        },
        error: async (error) => {
          await this.interaction.dismissLoading();
          this.handeleLoginError(error);
        },
      });
    } catch (error) {
      await this.interaction.dismissLoading();
      this.handeleLoginError(error);
    }
  }

  private async handeleLoginError(error: any): Promise<void> {
    if (error.status === 401) {
      await this.interaction.presentAlert(
        'Error de autenticación',
        'Credenciales incorrectas. Por favor, intente de nuevo.'
      );
      return;
    }

    await this.interaction.presentAlert(
      'Error',
      'Ocurrió un error al iniciar sesión. Por favor, intente de nuevo más tarde.'
    );
  }

  loginWithGoogle(): void {
    console.log('Lógica con Google (pendiente)');
  }

  goToRegister(): void {
    const active = document.activeElement as HTMLElement | null;
    active?.blur();

    setTimeout(() => this.router.navigate(['/auth/register']), 200);
  }
}
