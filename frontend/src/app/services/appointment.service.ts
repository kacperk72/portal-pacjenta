import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://localhost:3000/appointment';

  constructor(private http: HttpClient) {}

  bookAppointment(appointmentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, appointmentData);
  }

  getPatientAppointments(patientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/${patientId}`);
  }
}
