import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ConfigService } from './services/config.service';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { NgRecaptcha3Service } from 'ng-recaptcha3';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  public loading = false;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private recaptcha3: NgRecaptcha3Service
  ) {
    this.getWebsiteInfo();
  }

  getWebsiteInfo() {
    this.loading = true;
    this.configService
      .getWebsiteInfo()
      .pipe(
        catchError((error: any) => {
          console.error('Error:', error.error.error);
          const errorData = error.error.error;

          this.loading = false;

          if (
            typeof errorData === 'string' &&
            errorData.includes('Company not found')
          ) {
            this.router.navigate(['/error'], {
              queryParams: { message: 'company_not_found' },
            });
          }

          return of(null); // o throwError(() => error) si quieres re-lanzarlo
        })
      )
      .subscribe((data) => {
        if (data) {
          const captcha_key = data.captcha_key
            ? data?.captcha_key
            : environment.captcha_key;
          this.recaptcha3.init(captcha_key);
        }
      });
    this.loading = false;
  }
}
