import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IWebsiteInfo } from 'src/app/models/website-info.model';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class HeaderComponent implements OnInit {
  public websiteInfo?: IWebsiteInfo | null;
  constructor(private configService: ConfigService, private router: Router) {}

  ngOnInit() {
    this.getwebsiteInfo();
  }

  getwebsiteInfo() {
    this.configService.restoreWebsiteInfoFromStorage();
    this.websiteInfo = this.configService.getStoredWebsiteInfo();
  }

  onlyOneImage(): boolean {
    const info = this.websiteInfo;
    return (
      !!info &&
      ((!!info.banner && !info.secondary_logo) ||
        (!info.banner && !!info.secondary_logo))
    );
  }

  hasBothImages(): boolean {
    const info = this.websiteInfo;
    return !!info && !!info.banner && !!info.secondary_logo;
  }

  goDashboard() {
    this.router.navigate(['/module/dashboard']);
  }
}
