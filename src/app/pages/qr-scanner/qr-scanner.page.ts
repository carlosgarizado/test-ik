import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from 'src/app/services/route.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    IonIcon,
  ],
})
export class QrScannerPage implements OnInit, OnDestroy {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;

  public scannedResult: string = '';
  public showAlert!: boolean;
  private codeReader = new BrowserMultiFormatReader();
  private controls?: IScannerControls;
  private idService: number = 0;
  constructor(
    private route: ActivatedRoute,
    private routeService: RouteService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.idService = Number(params.get('id_service') ?? 0);
    });
    this.startScanner();
  }
  async startScanner() {
    try {
      const devices: MediaDeviceInfo[] =
        await BrowserMultiFormatReader.listVideoInputDevices();

      if (devices.length > 0) {
        this.controls = await this.codeReader.decodeFromVideoDevice(
          devices[0].deviceId,
          this.video.nativeElement,
          (result, error, control) => {
            if (result) {
              const text = result.getText();
              const parts = text.split('|');

              if (
                parts.length > 1 &&
                parts[0].toLowerCase().includes('taskgo')
              ) {
                this.scannedResult = parts[1].trim();
                this.showAlert = false;
              } else {
                this.scannedResult = text;
                this.showAlert = true;
              }
              control.stop();
            }
          }
        );
      } else {
        console.warn('No se encontraron cámaras disponibles.');
      }
    } catch (err) {
      console.error('Error al iniciar el escáner', err);
    }
  }

  completeBooking() {
    this.routeService
      .completeBookingWithQR(this.idService, this.scannedResult)
      .subscribe({
        next: (res) => {
          this.showTransactionSuccess(
            '¡Check-in exitoso!',
            `Tu reserva se ha validado correctamente y el ingreso al vehículo fue autorizado.<br><br>
             Gracias por utilizar la plataforma de reservas.<br><br>
            🚗 ¡Buen viaje!`
          );
        },
        error: (err) => {
          console.log('Errores:', err?.error?.error);

          const errorKey = (
            err?.error?.error ||
            err?.error?.message ||
            'default'
          ).toLowerCase();

          const errorMessages: { [key: string]: string } = {
            'service not found.': 'El servicio no fue encontrado.',
            'service is already finished.': 'El servicio ya esta terminado.',
            'contact not found.': 'Contacto no encontrado.',
          };
         
          console.log('errorMessages[errorKey]', errorMessages[errorKey]);
          console.log('errorKey', errorKey);

          let friendlyMessage =
            errorMessages[errorKey] ||
            'No fue posible completar tu solicitud en este momento. Por favor, verifica tu conexión o intenta nuevamente más tarde. <br><br>📩 Si el problema persiste, contacta al área de transporte para recibir asistencia.'
            ;
          if(errorKey === 'contact not found.'){
            friendlyMessage =   `Tu usuario no tiene una reserva activa para este vehículo o esta aún no ha sido procesada.<br><br>
            📩 Si ya hiciste la reserva, contacta al área de transporte:<br><br>
            • SSC: nelson.benavides@medtronic.com – 318 590 5232<br>
            • Chía: alexandra.zambrano@medtronic.com – 324 300 7172<br><br>
            ⏱️ Si no has reservado, regresa al inicio y selecciona “Programar servicio” para agendar tu transporte.`
          }

          this.showTransactionError(
            '¡No autorizado para abordar!',
            `${friendlyMessage}`
          );
        },
      });
  }

  goDashboard() {
    this.router.navigate(['/module/dashboard']);
  }

  async showTransactionError(title: string, message: string) {
    await this.alertService.showAlert({
      type: 'error',
      title,
      message: 'Oops! ' + message,
      buttons: [
        {
          label: 'Regresar',
          color: 'danger',
          handler: () => this.goDashboard(),
        },
      ],
    });
  }

  async showTransactionSuccess(title: string, message: string) {
    await this.alertService.showAlert({
      type: 'success',
      title,
      message: message,
      buttons: [
        {
          label: 'Ir a mis reservas',
          color: 'success',
          handler: () => this.goDashboard(),
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.controls?.stop();
  }
}
