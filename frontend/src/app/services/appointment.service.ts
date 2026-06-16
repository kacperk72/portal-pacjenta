import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookAppointmentPayload, PatientAppointment } from '../types/appointmentTypes';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://localhost:3000/appointment';

  constructor(private http: HttpClient) {}

  bookAppointment(payload: BookAppointmentPayload): Observable<PatientAppointment> {
    return this.http.post<PatientAppointment>(`${this.apiUrl}/add`, payload);
  }

  getPatientAppointments(patientId: string): Observable<PatientAppointment[]> {
    return this.http.get<PatientAppointment[]>(`${this.apiUrl}/patient/${patientId}`);
  }
}
