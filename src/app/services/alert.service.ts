import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { DynamicAlertComponent } from '../components/dynamic-alert/dynamic-alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private modalCtrl: ModalController) {}

  async showAlert(config: {
    type: 'success' | 'warning' | 'error';
    title: string;
    message: string;
    buttons: {
      label: string;
      fill?: string;
      role?: string;
      color?: string;
      handler?: () => void;
    }[];
  }): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: DynamicAlertComponent,
      componentProps: config,
      cssClass: 'custom-alert-modal',
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    return data;
  }
}
