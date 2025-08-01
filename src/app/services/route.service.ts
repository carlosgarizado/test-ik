import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRouteResponse } from '../models/route.model';
import { IBookingDashboardResponse } from '../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  getAvailableServicesByDate(date: string): Observable<IRouteResponse> {
    const url = `${this.apiUrl}/avaliable_services_by_date/?date=${date}`;
    const headers = new HttpHeaders({
      Accept: 'application/json; version=BookingV1',
      'Content-Type': 'application/json; version=BookingV1',
      Authorization: `token ${localStorage.getItem('authToken')}`,
    });
    return this.http.get<any>(url, { headers });
  }

  createBooking(routeId: number): Observable<any> {
    const url = `${this.apiUrl}/booking/create_boooking/`;
    const headers = new HttpHeaders({
      Accept: 'application/json; version=BookingV1',
      'Content-Type': 'application/json',
      Authorization: `token ${localStorage.getItem('authToken')}`,
    });

    const body = {
      service: routeId,
    };
    return this.http.post<any>(url, body, { headers });
  }

  getBookingDashboard(): Observable<IBookingDashboardResponse> {
    const url = `${this.apiUrl}/booking/history_services/`;
    const headers = new HttpHeaders({
      Accept: 'application/json; version=BookingV1',
      'Content-Type': 'application/json; version=BookingV1',
      Authorization: `token ${localStorage.getItem('authToken')}`,
    });
    return this.http.get<any>(url, { headers });
  }

  getServiceLocation(
    serviceId: number
  ): Observable<{ latitude: number; longitude: number; date: string }> {
    const url = `${this.apiUrl}/booking/get_service_location/?service_id=${serviceId}`;
    const headers = new HttpHeaders({
      Accept: 'application/json; version=BookingV1',
      'Content-Type': 'application/json; version=BookingV1',
      Authorization: `token ${localStorage.getItem('authToken')}`,
      skipLoading: 'true',
    });
    return this.http.get<{ latitude: number; longitude: number; date: string }>(
      url,
      { headers }
    );
  }

  completeBookingWithQR(serviceId: number, idNumber: string): Observable<any> {
    const url = `${this.apiUrl}/booking/complete_booking_with_QR/`;

    const headers = new HttpHeaders({
      Accept: 'application/json; version=BookingV1',
      'Content-Type': 'application/json; version=BookingV1',
      Authorization: `token ${localStorage.getItem('authToken')}`,
    });

    const body = {
      service_id: serviceId,
      id_number: idNumber,
    };

    return this.http.post(url, body, { headers });
  }
}
