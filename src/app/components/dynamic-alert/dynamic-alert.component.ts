import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';

export type AlertType = 'success' | 'warning' | 'error';
export interface AlertButton {
  fill?: string;
  label: string;
  color?: string;
  role?: string;
  handler?: () => void;
}

@Component({
  selector: 'app-dynamic-alert',
  templateUrl: './dynamic-alert.component.html',
  styleUrls: ['./dynamic-alert.component.scss'],
  standalone: true,
  imports: [IonButton, CommonModule, IonIcon],
})
export class DynamicAlertComponent {
  @Input() type: AlertType = 'success';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttons: AlertButton[] = [];

  private modalCtrl = inject(ModalController); // ✅ habilitado

  typeIconMap = {
    success: 'checkmark-circle',
    warning: 'alert-circle',
    error: 'close-circle',
  };

  onButtonClick(btn: AlertButton): void {
    if (btn.handler) {
      btn.handler();
    }
    this.modalCtrl.dismiss(btn); // ✅ habilitado
  }
}
