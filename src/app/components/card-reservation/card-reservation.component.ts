import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonCard,
  IonIcon,
  IonCardContent,
} from '@ionic/angular/standalone';
import { IBooking } from 'src/app/models/booking.model';

@Component({
  selector: 'app-card-reservation',
  templateUrl: './card-reservation.component.html',
  styleUrls: ['./card-reservation.component.scss'],
  standalone: true,
  imports: [
    IonCardContent,
    IonIcon,
    IonCard,
    IonCard,
    IonButton,
    IonIcon,
    CommonModule,
  ],
})
export class CardReservationComponent implements OnInit {
  @Input() reservations: IBooking[] = [];

  constructor(private router: Router) {}

  ngOnInit() {}

  goQrScanner(idService: number) {
    this.router.navigate(['/module/qr-scanner'], {
      queryParams: {
        id_service: idService
      }
    });
  }

  getStateClass(state: string): string {
    switch (state?.toLowerCase()) {
      case 'pending':
        return 'state-pending';
      case 'completed':
        return 'state-completed';
      case 'cancelled':
        return 'state-cancelled';
      default:
        return 'state-default';
    }
  }  

  getStateLabel(state: string): string {
    switch (state?.toLowerCase()) {
      case 'pending':
        return 'Pendiente';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  }

  formatDateTimeToAmPm(date: string, time: string): string {
    const fullString = `${date}T${time}`;
    const fullDate = new Date(fullString);
  
    const hours = fullDate.getHours();
    const minutes = fullDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const adjustedHour = hours % 12 || 12;
  
    return `${adjustedHour.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${ampm}`;
  }  
}
