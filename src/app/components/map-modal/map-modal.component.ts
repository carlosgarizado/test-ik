import { Component, Input, OnInit } from '@angular/core';
import {
  ModalController,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import L from 'leaflet';
const vehicleIcon = new L.Icon({
  iconUrl: 'assets/coche.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: '',
});
@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    CommonModule,
  ],
})
export class MapModalComponent implements OnInit {
  @Input() lat!: number;
  @Input() lng!: number;
  @Input() date!: string;

  private map!: L.Map;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    setTimeout(() => {
      this.map = L.map('modal-map').setView([this.lat, this.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
      }).addTo(this.map);

      L.marker([this.lat, this.lng], { icon: vehicleIcon }).addTo(this.map);
    }, 300);
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
  close() {
    this.modalCtrl.dismiss();
  }
}
