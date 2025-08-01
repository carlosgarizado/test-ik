import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TermsAndConditionsComponent } from 'src/app/components/terms-and-conditions/terms-and-conditions.component';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { ConfigService } from 'src/app/services/config.service';
import { IWebsiteInfo } from 'src/app/models/website-info.model';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import {
  IonCheckbox,
  IonModal,
  IonContent,
  IonToast,
} from '@ionic/angular/standalone';
import { AlertService } from 'src/app/services/alert.service';
import { NgRecaptcha3Service } from 'ng-recaptcha3';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FormsModule,
    TermsAndConditionsComponent,
    ReactiveFormsModule,
    FooterComponent,
    IonModal,
    IonContent,
    IonCheckbox,
  ],
})
export class LoginPage implements OnInit {
  @ViewChild('modalTerms', { static: true }) modalTerms!: IonModal;

  public loginForm!: FormGroup;
  public websiteInfo?: IWebsiteInfo;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private configService: ConfigService,
    private alertService: AlertService,
    private recaptcha3: NgRecaptcha3Service
  ) {}

  async ngOnInit() {
    this.loginForm = this.fb.group({
      documentNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^[0-9\-]+$/),
        ],
      ],
      terms: [false, [Validators.requiredTrue]],
      personalData: [false, [Validators.requiredTrue]],
    });
    this.authService.logout();

    this.getwebsiteInfo();
  }

  getwebsiteInfo() {
    this.configService.getWebsiteInfoObservable().subscribe((info) => {
      if (info) {
        this.websiteInfo = info;
      }
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { documentNumber } = this.loginForm.value;
    this.recaptcha3.getToken().then((token) => {
      this.authService.login(documentNumber.trim(), token).subscribe(
        async (success) => {
          if (success) {
            this.toastService.success('Autenticación exitosa.');
            this.router.navigate(['/module/dashboard']);
          } else {
            await this.showTransactionError(
              '¡Acceso no autorizado!',
              `Tu usuario no se encuentra habilitado para ingresar a esta plataforma.<br><br>
                Por favor, comunícate con el área encargada de transporte en <strong>Medtronic</strong> para solicitar la activación de tu acceso.<br><br>
                📩 Si ya hiciste la solicitud, espera la confirmación del equipo responsable antes de intentar nuevamente.<br><br>
                📞 Contactos para soporte:<br>
                • SSC: nelson.benavides@medtronic.com – 318 590 5232<br>
                • Chía: alexandra.zambrano@medtronic.com – 324 300 7172`
            );
          }
        },
        async (error) => {
          console.error('Error en login:', error);
          await this.showTransactionError(
            '¡Acceso no autorizado!',
            'Hubo un problema con el servidor. Intenta más tarde.'
          );
        }
      );
    });
  }

  async showTransactionError(title: string, message: string) {
    await this.alertService.showAlert({
      type: 'error',
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

  openTermsModal() {
    this.modalTerms.present();
  }

  getDocumentErrorMessage(): string {
    const control = this.loginForm.get('documentNumber');

    if (control?.touched || control?.dirty) {
      if (control.hasError('required')) {
        return 'El número es obligatorio';
      }

      if (control.hasError('pattern')) {
        return 'Solo se permiten números y guiones';
      }

      if (control.hasError('minlength')) {
        return 'Debe tener al menos 5 caracteres';
      }
    }
    return '';
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  async test() {
    // const modal = await this.modalCtrl.create({
    //   component: DynamicAlertComponent,
    //   componentProps: {},
    //   cssClass: 'custom-alert-modal',
    //   backdropDismiss: false,
    // });
  }
}
