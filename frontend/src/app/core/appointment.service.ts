import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  bookAppointment(appointmentData: any): Observable<any> {
    return this.http.post(
      `http://localhost:3000/appointment/add`,
      appointmentData
    );
  }
}
