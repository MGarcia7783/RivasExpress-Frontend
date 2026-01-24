import { Injectable } from '@angular/core';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class InteractionService {
  private loadingElement: HTMLIonLoadingElement | null = null;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertController: AlertController,
  ) {}

  // Cargando
  async showLoading(message: string = 'Cargando...') {
    this.loadingElement = await this.loadingCtrl.create({
      message,
      spinner: 'crescent',
      duration: 10000,
      cssClass: 'custom-loading',
      translucent: true,
      backdropDismiss: false,
    });
    await this.loadingElement.present();
  }

  async dismissLoading() {
    if (this.loadingElement) {
      await this.loadingElement.dismiss();
    }
    this.loadingElement = null;
  }

  // Toast
  async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary' = 'primary',
    icon: string = 'information-circle-outline',
    duration: number = 2000,
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'bottom',
      icon,
      cssClass: `modern-toast ${color}-toast`, // Clase dinámica
      mode: 'ios',
      swipeGesture: 'vertical',
    });
    await toast.present();
  }

  // Alerta
  async presentAlert(
    header: string,
    message: string,
    textCANCEL: string | null = null,
    textOK: string = 'OK',
    isDestructive: boolean = false,
    tipoMensaje: 'info' | 'success' | 'warning' | 'danger' = 'info',
  ): Promise<boolean> {
    let result = false;
    const buttons: any[] = [];

    if (textCANCEL) {
      buttons.push({
        text: textCANCEL,
        role: 'cancel',
        cssClass: 'alert-button-cancel',
        handler: () => {
          result = false;
        },
      });
    }

    buttons.push({
      text: textOK,
      cssClass: isDestructive
        ? 'alert-button-confirm-delete'
        : 'alert-button-confirm',
      handler: () => {
        result = true;
      },
    });

    // Mapeo de clase según tipo de mensaje
    const tipoClase =
      {
        info: 'alert-info',
        success: 'alert-success',
        warning: 'alert-warning',
        danger: 'alert-danger',
      }[tipoMensaje] || 'alert-info';

    const alert = await this.alertController.create({
      header,
      message: new IonicSafeString(message).value,
      buttons,
      mode: 'ios',
      backdropDismiss: false,
      cssClass: 'custom-alert',
    });

    await alert.present();

    await alert.onDidDismiss();
    return result;
  }

  // Input activo
  blurActiveElement() {
    const active = document.activeElement as HTMLElement | null;
    active?.blur();
  }

  // Manejar errores
  async mostrarError(err: any) {
    const backendMessage =
      err?.error?.detail ||
      err?.error?.message ||
      err?.error?.title ||
      err?.message;

    await this.presentAlert(
      'Error',
      backendMessage || 'Ocurrió un problema al procesar la solicitud.',
      null,
      'Cerrar',
      false,
      'danger',
    );
  }
}
