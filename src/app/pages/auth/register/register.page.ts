import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
export class RegisterPage {
  // Preparación de un FormGroup listo para crecer (sin validaciones por ahora)
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    fullName: [''],
    email: [''],
    password: [''],
    confirmPassword: [''],
  });

  // Handler simple: por ahora solo marca el form como tocado y muestra valores
  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    console.log('Crear cuenta (pendiente):', this.registerForm.value);
  }

  goToLogin(): void {
    const active = document.activeElement as HTMLElement | null;
    if (active) {
      active.blur();
    }
    // Defer navegación para asegurar que el blur se aplique
    setTimeout(() => this.router.navigate(['/login']), 0);
  }
}
