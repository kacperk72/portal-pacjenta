import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SurveyData } from '../components/survey/survey.component';
import { EventItem } from '../components/dashboard/dashboard.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private baseUrl = 'http://localhost:3000/survey';

  constructor(private http: HttpClient) {}

  saveSurvey(surveyData: SurveyData, visitData: EventItem): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, {
      surveyData,
      visitData,
    });
  }

  getAllSurveys(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getSurveyByAppointmentID(appointmentID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${appointmentID}`);
  }

  getSurveysByDoctorID(doctorID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctor/${doctorID}`);
  }
}
