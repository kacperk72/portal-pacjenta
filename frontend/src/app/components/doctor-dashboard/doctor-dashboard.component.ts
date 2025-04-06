import { Component, OnInit } from '@angular/core';
import { UserService, userLocalStorageData } from '../../services/user.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../services/data.service';
import { SurveyComponent } from '../survey/survey.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TimelineModule } from 'primeng/timeline';
import { TabViewModule } from 'primeng/tabview';
import { DoctorService } from '../../services/doctor.service';
import { CalendarModule } from 'primeng/calendar';
import { TimePipe } from '../../pipes/time.pipe';
import { DatePipe } from '../../pipes/date.pipe';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { SurveyService } from '../../services/survey.service';
import { CombinedData, EventItem, Survey, UserLocalStorageData } from '../../types/surveyTypes';
import { VisitSurveyDetailsComponent } from '../visit-survey-details/visit-survey-details.component';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css',
  imports: [
    TabViewModule,
    MatIconModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    TimelineModule,
    CardModule,
    CommonModule,
    CalendarModule,
    TimePipe,
    DatePipe,
    CapitalizePipe,
  ],
})
export class DoctorDashboardComponent implements OnInit {
  name: string = '';
  surname: string = '';
  adres: string = '';
  cities: string = '';
  specializations: string = '';
  date: Date = new Date();
  startTime: Date = new Date();
  endTime: Date = new Date();
  userLocalStorageData: UserLocalStorageData = {
    id: '',
    role: '',
    username: '',
    token: '',
  };
  userData: any;
  doctorData: any;
  isInEditMode: boolean = false;
  today: Date = new Date();
  duration: number = 0;
  events: any[] = [];
  historyEvents: any[] = [];
  surveys: Survey[] = [];
  combinedData: CombinedData[] = [];

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private dataService: DataService,
    private doctorService: DoctorService,
    private router: Router,
    private surveyService: SurveyService
  ) {}

  ngOnInit(): void {
    this.userLocalStorageData = this.userService.getUserData();

    this.dataService.getUserProfileData(this.userLocalStorageData.id).subscribe((data) => {
      this.userData = data;
    });

    if (this.userLocalStorageData.id !== '') {
    } else {
      this.router.navigate(['/login']);
    }

    this.dataService.getDoctorProfileData(this.userLocalStorageData.id).subscribe((data: any) => {
      this.doctorData = data;
    });

    this.dataService.getDoctorSchedule(this.userLocalStorageData.id).subscribe((data: any) => {});

    this.doctorService.getScheduledVisits(this.userLocalStorageData.id).subscribe(
      (data: any) => {
        data.forEach((event: any) => {
          event.icon = 'pi pi-calendar';
          event.color = '#607D8B';
          if (event.Appointment?.Status === 'zaplanowana') {
            this.events.push(event);
          } else if (event.Appointment?.Status === 'zakończona') {
            this.historyEvents.push(event);
          }
        });

        this.combineVisitsAndSurveys();
      },
      (error) => {
        console.error('Error fetching scheduled visits', error);
      }
    );

    if (this.userLocalStorageData.id !== '') {
      console.log('Dane użytkownika: ', this.userLocalStorageData);
    } else {
      this.router.navigate(['/login']);
    }

    this.loadSurveysByDoctorID(this.userLocalStorageData.id);
  }

  loadSurveysByDoctorID(doctorID: string): void {
    this.surveyService.getSurveysByDoctorID(doctorID).subscribe({
      next: (data: Survey[]) => {
        this.surveys = data;
        // console.log('Surveys for doctor:', this.surveys);
        this.combineVisitsAndSurveys();
      },
      error: (err) => {
        console.error('Error loading surveys by DoctorID:', err);
      },
    });
  }

  combineVisitsAndSurveys(): void {
    if (this.events.length && this.surveys.length) {
      this.combinedData = this.events.map((event) => {
        const survey = this.surveys.find((s) => s.AppointmentID === event.AppointmentID);
        return survey ? { ...event, survey } : event;
      });
      // console.log('Combined Data:', this.combinedData);
    }
  }

  editMode() {
    this.isInEditMode = true;
  }

  saveUserData() {
    this.isInEditMode = false;
  }

  showDetails(details: any) {
    const modalRef = this.modalService.open(VisitSurveyDetailsComponent);
    modalRef.componentInstance.event = details;
  }

  // HISTORY

  // PRESCRIPTIONS

  // NEW SCHEDULE
  isFormValid(): boolean {
    if (!this.date || !this.startTime || !this.endTime || !this.duration) {
      return false;
    }
    const start = this.startTime.getHours() * 60 + this.startTime.getMinutes();
    const end = this.endTime.getHours() * 60 + this.endTime.getMinutes();
    return end - start >= this.duration;
  }

  onSubmit(form: any) {
    const { duration } = form.value;
    const date = this.formatDate(this.date);
    const startTime = this.formatTime(this.startTime);
    const endTime = this.formatTime(this.endTime);

    const schedules = {
      DoctorID: this.userLocalStorageData.id,
      AvailableDate: date,
      TimeSlotFrom: startTime,
      TimeSlotTill: endTime,
      Duration: duration,
    };

    this.doctorService.createSchedules(schedules).subscribe(
      (response) => {
        console.log('Schedules saved successfully', response);
      },
      (error) => {
        console.error('Error saving schedules', error);
      }
    );
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
