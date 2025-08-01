import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async show(message: string, duration: number = 3000, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'top',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  async success(message: string) {
    await this.show(message, 3000, 'success');
  }

  async error(message: string) {
    await this.show(message, 3000, 'danger');
  }

  async warning(message: string) {
    await this.show(message, 3000, 'warning');
  }

  async info(message: string) {
    await this.show(message, 3000, 'medium');
  }
}
