import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {IWebsiteInfo } from '../models/website-info.model';
import { Title } from '@angular/platform-browser';
import { Color, ColorVariable, RGB } from '../models/color';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private apiUrl = `${environment.apiUrl}/`;
  private websiteInfo = new BehaviorSubject<IWebsiteInfo | null>(null);
  constructor(
    private http: HttpClient,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  getWebsiteInfo(): Observable<IWebsiteInfo> {
    const url = `${this.apiUrl}website_info_by_company/`;
    const headers = new HttpHeaders({
      Accept: 'application/json; version=BookingV1',
      'Content-Type': 'application/json; version=BookingV1',
    });

    return this.http.get<IWebsiteInfo>(url, { headers }).pipe(
      tap((info) => {
        this.websiteInfo.next(info);
        localStorage.setItem('website_info', JSON.stringify(info));
        this.setPageTitle(info.name + ' | Solicita tu servicio');
        this.loadMallColors(info);
      })
    );
  }

  getWebsiteInfoObservable(): Observable<IWebsiteInfo | null> {
    return this.websiteInfo.asObservable();
  }

  getStoredWebsiteInfo(): IWebsiteInfo | null {
    return this.websiteInfo.value;
  }

  setPageTitle(title: string) {
    this.titleService.setTitle(title);
  }

  loadMallColors(info: IWebsiteInfo) {
    let colorBrands: any = {};
    if (info && info.brand_colors) {
      colorBrands = info.brand_colors;
      localStorage.setItem('mall_brand_colors', JSON.stringify(colorBrands));
    } 
    for (let colorName in colorBrands) {
      let colorValue = colorBrands[colorName];
      try {
        this.loadWebsiteColor(colorName, colorValue);
      } catch (error) {
        console.warn('Error setting color', colorName, colorValue);
      }
    }
  }
  

  loadWebsiteColor(colorName: string, colorValue: string) {
    let colorData = this.generateColor(colorValue);
    this.document.documentElement.style.setProperty(
      '--ion-color-' + colorName,
      colorData.value ?? null
    );
    this.document.documentElement.style.setProperty(
      '--ion-color-' + colorName + '-rgb',
      colorData.valueRgb ?? null
    );
    this.document.documentElement.style.setProperty(
      '--ion-color-' + colorName + '-contrast',
      colorData.contrast ?? null
    );
    this.document.documentElement.style.setProperty(
      '--ion-color-' + colorName + '-contrast-rgb',
      colorData.contrastRgb ?? null
    );
    this.document.documentElement.style.setProperty(
      '--ion-color-' + colorName + '-shade',
      colorData.shade ?? null
    );
    this.document.documentElement.style.setProperty(
      '--ion-color-' + colorName + '-tint',
      colorData.tint ?? null
    );
  }
  private generateColor(value: string): ColorVariable {
    const color = new Color(value);
    const contrast = color.contrast();
    const tint = color.tint();
    const shade = color.shade();
    const formattedValue = value.startsWith('#') ? value : `#${value}`;

    return {
      value: formattedValue,
      valueRgb: this.rgbToString(color.rgb),
      contrast: contrast.hex,
      contrastRgb: this.rgbToString(contrast.rgb),
      tint: tint.hex,
      shade: shade.hex,
    };
  }

  loadColorsFromStorageIfAvailable() {
    const stored = localStorage.getItem('mall_brand_colors');
    if (stored) {
      const colors = JSON.parse(stored);
      for (let colorName in colors) {
        const colorValue = colors[colorName];
        try {
          this.loadWebsiteColor(colorName, colorValue);
        } catch (error) {
          console.warn('Error restaurando color', colorName, colorValue);
        }
      }
    }
  }

  restoreWebsiteInfoFromStorage() {
    const stored = localStorage.getItem('website_info');
    if (stored) {
      const info: IWebsiteInfo = JSON.parse(stored);
      this.websiteInfo.next(info);
      this.setPageTitle(info.name + ' | Solicita tu servicio');
      this.loadMallColors(info);
    }
  }  
  
  private rgbToString(c: RGB): string {
    return `${c.r},${c.g},${c.b}`;
  }
}
