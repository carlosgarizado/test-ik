import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonList,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';
import { CardReservationComponent } from 'src/app/components/card-reservation/card-reservation.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Router } from '@angular/router';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { RouteService } from 'src/app/services/route.service';
import { ToastService } from 'src/app/services/toast.service';
import { IBookingDashboardResponse } from 'src/app/models/booking.model';
import L from 'leaflet';
import { MapModalComponent } from 'src/app/components/map-modal/map-modal.component';
delete (L.Icon.Default.prototype as any)._getIconUrl;

const vehicleIcon = new L.Icon({
  iconUrl: 'assets/coche.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: '',
});

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonList,
    IonCardContent,
    IonIcon,
    IonCardSubtitle,
    IonCardHeader,
    IonCard,
    IonButton,
    IonContent,
    CommonModule,
    FormsModule,
    CardReservationComponent,
    HeaderComponent,
    FooterComponent,
  ],
})
export class DashboardPage implements OnInit, OnDestroy {
  public showReservations = false;
  public booking!: IBookingDashboardResponse;
  public mapInitialized = false;
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private intervalId: any;
  public location!: { latitude: number; longitude: number; date: string };

  constructor(
    private router: Router,
    private routeService: RouteService,
    private toastService: ToastService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getBooking();
    this.intervalId = setInterval(() => this.checkAndInitMap(), 30 * 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getBooking() {
    this.routeService.getBookingDashboard().subscribe({
      next: (data) => {
        this.booking = data;

        //   id: 5,
        //   service_id: 8,
        //   service: 'Servicio 2',
        //   booking_date: '2025-07-23',
        //   state: 'pending',
        //   start_date: '2025-07-24',
        //   end_date: '2025-07-31',
        //   start_time: '11:12:26',
        //   end_time: '06:00:00',
        //   route: {
        //     origin: 'Parque Fontanar',
        //     origin_arrival_time: null,
        //     destination: 'Parque Fontanar',
        //     destination_arrival_time: null,
        //   },
        //   contact: {
        //     additional_parameters: {
        //       placa: 'ABC123',
        //       Vehiculo: 'TOYOTA ',
        //       photo:
        //         'https://taskgostaging.s3.us-east-2.amazonaws.com/crm/photos/contacts/1/20250724171246228319.jpeg',
        //     },
        //   },
        // };
        this.checkAndInitMap();
        this.showReservations = !this.booking.next_booking;
      },
      error: () => {
        this.toastService.error('Error al obtener reservas');
      },
    });
  }

  async checkAndInitMap() {
    if (!this.booking?.next_booking) return;

    const el = await this.waitForElement('#map');
    if (!el) return;

    const serviceId = this.booking.next_booking.service_id;

    this.routeService.getServiceLocation(serviceId).subscribe({
      next: (location) => {
        this.location = location;
        if (!this.mapInitialized) {
          this.initMap(el, location.latitude, location.longitude);
          this.mapInitialized = true;
        } else {
          this.updateMarker(location.latitude, location.longitude);
        }
      },
      error: () => {
        this.toastService.error('No se pudo obtener la ubicación del bus');
      },
    });
  }

  initMap(container: HTMLElement, lat: number, lng: number) {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.map = L.map(container, {
      attributionControl: false,
    }).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(this.map);

    this.marker = L.marker([lat, lng], { icon: vehicleIcon }).addTo(this.map);
  }
  updateMarker(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    }
  }

  async waitForElement(
    selector: string,
    timeout = 3000
  ): Promise<HTMLElement | null> {
    const pollInterval = 100;
    let elapsed = 0;

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const el = document.querySelector(selector) as HTMLElement;
        if (el) {
          clearInterval(interval);
          resolve(el);
        }

        elapsed += pollInterval;
        if (elapsed >= timeout) {
          clearInterval(interval);
          resolve(null);
        }
      }, pollInterval);
    });
  }

  toggleList() {
    this.showReservations = !this.showReservations;
  }

  goQrScanner(idService: number) {
    this.router.navigate(['/module/qr-scanner'], {
      queryParams: {
        id_service: idService,
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

  goRoute() {
    this.router.navigate(['/module/select-route']);
  }

  async openMapModal() {
    if (!this.location) return;

    const modal = await this.modalCtrl.create({
      component: MapModalComponent,
      componentProps: {
        lat: this.location.latitude,
        lng: this.location.longitude,
        date: this.location.date,
      },
    });
    await modal.present();
  }
}
