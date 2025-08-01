import { Component, Input, OnInit } from '@angular/core';
import {
  IonLabel,
  ModalController,
  IonIcon,
  IonCard,
  IonContent,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonButton,
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { StopService } from 'src/app/services/stop.service';
import { IStop } from 'src/app/models/stop.model';

@Component({
  selector: 'app-modal-route',
  templateUrl: './modal-route.component.html',
  styleUrls: ['./modal-route.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonCard,
    IonContent,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonButton,
    IonLabel,
  ],
  providers: [ModalController],
})
export class ModalRouteComponent implements OnInit {
  public stops: IStop[] = [];
  @Input() rutaId?: number;

  constructor(
    private modalCtrl: ModalController,
    private stopService: StopService
  ) {}

  ngOnInit() {
    this.getStop();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  getStop() {
    this.stopService.getStopsByService(this.rutaId).subscribe({
      next: (response) => {
        this.stops = response.stops;
      },
      error: (err) => {
        console.error('Error al obtener paradas', err);
      },
    });
  }

  formatHourToAmPm(time: string | null | undefined): string {
    if (!time) return '';

    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    return `${hour.toString().padStart(2, '0')}:${minuteStr.padStart(
      2,
      '0'
    )} ${ampm}`;
  }
}
