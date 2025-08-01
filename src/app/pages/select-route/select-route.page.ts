import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Router } from '@angular/router';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { RouteService } from 'src/app/services/route.service';
import { IRoute } from 'src/app/models/route.model';
import { ModalRouteComponent } from 'src/app/components/modal-route/modal-route.component';
import { ToastService } from 'src/app/services/toast.service';
import { ConfigService } from 'src/app/services/config.service';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonCardTitle,
  IonContent,
  IonModal,
  IonPopover,
} from '@ionic/angular/standalone';
import { ModalConfirmationComponent } from 'src/app/components/modal-confirmation/modal-confirmation.component';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-select-route',
  templateUrl: './select-route.page.html',
  styleUrls: ['./select-route.page.scss'],
  standalone: true,
  imports: [
    IonPopover,
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonContent,
    IonModal,
    ModalRouteComponent,
    ModalConfirmationComponent,
    IonIcon,
  ],
})
export class SelectRoutePage implements OnInit {
  public selectedDate: string = '';
  public minDate: string = '';
  public maxDate: string = '';
  public routes: IRoute[] = [];
  public showAlert = false;
  public presentingEl = document.querySelector('ion-content');
  public routeId!: number;
  public tooltipText = '';
  @ViewChild('termsModal', { static: true }) termsModal!: IonModal;
  @ViewChild('confirmationModal', { static: true })
  confirmationModal!: IonModal;

  constructor(
    private router: Router,
    private routeService: RouteService,
    private toastService: ToastService,
    private configService: ConfigService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.disableDates();
    this.getwebsiteInfo();
  }

  change(route: IRoute) {
    this.router.navigate(['/module/confirmation-route'], {
      queryParams: {
        name: route.name,
        startDate: route.schedule_start_date,
        startTime: route.schedule_start_time,
      },
    });
  }

  getwebsiteInfo() {
    this.configService.loadColorsFromStorageIfAvailable();
  }

  private formatDateUTC(date: Date): string {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  disableDates() {
    const today = new Date();
    this.minDate = this.formatDateUTC(today);
  
    const nextFriday = new Date(today);
    const day = nextFriday.getUTCDay();
    const daysUntilNextFriday = ((5 + 7 - day) % 7) + 7;
    nextFriday.setUTCDate(today.getUTCDate() + daysUntilNextFriday);
    this.maxDate = this.formatDateUTC(nextFriday);
  }
  
  

  getRoutes() {
    this.routeService.getAvailableServicesByDate(this.selectedDate).subscribe({
      next: (data) => {
        this.routes = data.avaliable_services;
        this.showAlert = true;
      },
      error: (err) => {
        this.toastService.error('Error al obtener rutas');
      },
    });
  }

  createBooking(routeId: number, route: IRoute) {
    this.routeService.createBooking(routeId).subscribe({
      next: (data) => {
        this.change(route);
      },
      error: async (err) => {
        console.log(err.error.error);
        const error: string = err.error.error;
        if (error.includes('You already')) {
          await this.showTransactionError(
            'Reserva existente',
            `Ya tienes una reserva activa para este servicio.<br><br>
             Por favor, revisa tus reservaciones actuales antes de generar una nueva.<br><br>
             📅 Si necesitas hacer cambios, comunícate con el área encargada de transporte en <strong>Medtronic</strong>.`
          );
        } else {
          this.toastService.error('Error al reservar');
        }
      },
    });
  }

  async openStopModal(routeId: number) {
    this.routeId = routeId;
    await this.termsModal.present();
  }

  async openConfirmationModal(routeId: number, route: IRoute) {
    this.showAlertModal(
      'Confirma tu reserva',
      '¿Quieres confirmar esta reserva?',
      routeId,
      route
    );
  }

  async showTransactionError(title: string, message: string) {
    await this.alertService.showAlert({
      type: 'warning',
      title,
      message: 'Oops! ' + message,
      buttons: [
        {
          label: 'Aceptar',
          color: 'success',
          handler: () => {},
        },
      ],
    });
  }

  async showAlertModal(
    title: string,
    message: string,
    routeId: number,
    route: IRoute
  ) {
    await this.alertService.showAlert({
      type: 'warning',
      title,
      message,
      buttons: [
        {
          label: 'Cancelar',
          color: 'medium',
          handler: () => {},
          fill: 'outline',
        },
        {
          label: 'Continuar',
          color: 'success',
          handler: () => this.createBooking(routeId, route),
        },
      ],
    });
  }

  goDashboard() {
    this.router.navigate(['/module/dashboard']);
  }
}
