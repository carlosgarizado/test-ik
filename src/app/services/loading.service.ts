import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  async show() {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        message: 'Cargando...',
        spinner: 'crescent',
        cssClass: 'custom-loading' 
      });
      await this.loading.present();
    }
  }

  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}