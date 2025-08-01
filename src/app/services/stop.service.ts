import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IStopsResponse } from '../models/stop.model';

@Injectable({
  providedIn: 'root'
})
export class StopService {
  private apiUrl = `${environment.apiUrl}/`;
  constructor(private http: HttpClient) { }

  getStopsByService(serviceId: number | undefined): Observable<IStopsResponse> {
    const headers = new HttpHeaders({
      'Accept': 'application/json; version=BookingV1',
      'Content-Type': 'application/json; version=BookingV1',
      'Authorization': `token ${localStorage.getItem('authToken')}`
    });
    const url = `${this.apiUrl}stops_by_service/?service_id=${serviceId}`;
    return this.http.get<any>(url, { headers });
  } 
}