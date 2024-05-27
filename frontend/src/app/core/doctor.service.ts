import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiUrl = 'http://localhost:3000/doctor';

  constructor(private http: HttpClient) {}

  createSchedules(schedules: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/schedule/create`, schedules);
  }

  getScheduledVisits(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/scheduled-visits/${id}`);
  }
}
