import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  login(documentNumber: string, captcha?: string): Observable<boolean> {
    let body: any = { document: documentNumber.trim() };
    const url = `${this.apiUrl}/login_website_by_document/`;
    if (captcha != null && captcha !== '') {
      body['recaptcha'] = captcha;
    }
    const headers = new HttpHeaders({
      Accept: 'application/json; version=BookingV1',
      'Content-Type': 'application/json; version=BookingV1',
    });

    return this.http.post<{ token: string }>(url, body, { headers }).pipe(
      map((response) => {
        if (response?.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('document', documentNumber);
          return true;
        }
        return false;
      }),
      catchError((err) => {
        console.error('Login error:', err);
        return of(false);
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('document');
  }

  getUser(): string | null {
    return localStorage.getItem('document');
  }
}
