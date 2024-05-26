import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getUserProfileData(id: string) {
    return this.http.get(`http://localhost:3000/patients/profile/${id}`);
  }

  getDoctorSchedule(id: string) {
    return this.http.get(`http://localhost:3000/doctor/schedule/${id}`);
  }

  getDoctorProfileData(id: string) {
    return this.http.get(`http://localhost:3000/doctor/${id}`);
  }

  getFiltersData() {
    return this.http.get('http://localhost:3000/doctor/filters');
  }

  getVisits(body: any) {
    return this.http.post('http://localhost:3000/doctor/visits', body);
  }
}
