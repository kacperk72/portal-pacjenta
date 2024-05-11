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

  getFiltersData() {
    return this.http.get('http://localhost:3000/doctor/filters');
  }
}
