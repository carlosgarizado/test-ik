import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { IRoute } from 'src/app/models/route.model';

@Component({
  selector: 'app-confirmation-route',
  templateUrl: './confirmation-route.page.html',
  styleUrls: ['./confirmation-route.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    CommonModule,
    FormsModule,
    FooterComponent,
  ],
})
export class ConfirmationRoutePage implements OnInit {
  public routeName?: string;
  public startDate?: string;
  public startTime?: string;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.routeName = params['name'];
      this.startDate = params['startDate'];
      this.startTime = params['startTime'];
    });
  }
  change() {
    this.router.navigate(['/module/dashboard']);
  }
}
