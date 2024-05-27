import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:3000/patients';
  private apiUrl2 = 'http://localhost:3000/doctor';

  constructor(private http: HttpClient) {}

  getUserProfileData(id: string) {
    return this.http.get(`${this.apiUrl}/profile/${id}`);
  }

  getDoctorSchedule(id: string) {
    return this.http.get(`${this.apiUrl2}/schedule/${id}`);
  }

  getDoctorProfileData(id: string) {
    return this.http.get(`${this.apiUrl2}/${id}`);
  }

  getFiltersData() {
    return this.http.get(`${this.apiUrl2}/filters`);
  }

  getVisits(body: any) {
    return this.http.post(`${this.apiUrl2}/visits`, body);
  }
}
