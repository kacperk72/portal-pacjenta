import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private http: HttpClient) {}

  createSchedules(schedules: any): Observable<any> {
    return this.http.post(`http://localhost:3000/doctor/schedule`, schedules);
  }
}
