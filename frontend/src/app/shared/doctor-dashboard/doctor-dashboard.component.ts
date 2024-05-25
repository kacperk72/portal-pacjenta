import { Component, OnInit } from '@angular/core';
import { UserService, userLocalStorageData } from '../../core/user.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../core/data.service';
import { SurveyComponent } from '../survey/survey.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TimelineModule } from 'primeng/timeline';
import { TabViewModule } from 'primeng/tabview';
import { DoctorService } from '../../core/doctor.service';
import { CalendarModule } from 'primeng/calendar';

interface EventItem {
  status?: string;
  patient?: string;
  description?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    SurveyComponent,
    TabViewModule,
    MatIconModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    TimelineModule,
    CardModule,
    CommonModule,
    CalendarModule,
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css',
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
  userLocalStorageData: userLocalStorageData = {
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
  events: EventItem[] = [
    {
      status: 'Zaplanowana',
      patient: 'Dr. Jan Kowalski',
      description: 'konsultacje wyników badań',
      date: '16/05/2024 10:00-10:30',
      icon: 'pi pi-calendar',
      color: '#607D8B',
    },
    {
      status: 'Zaplanowana',
      patient: 'Dr. Jan Kowalski',
      description: 'konsultacje wyników badań',
      date: '16/05/2024 10:00-10:30',
      icon: 'pi pi-calendar',
      color: '#607D8B',
    },
  ];

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private dataService: DataService,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userLocalStorageData = this.userService.getUserData();

    this.dataService
      .getUserProfileData(this.userLocalStorageData.id)
      .subscribe((data) => {
        this.userData = data;
      });

    if (this.userLocalStorageData.id !== '') {
      console.log('Dane użytkownika: ', this.userLocalStorageData);
    } else {
      this.router.navigate(['/login']);
    }

    this.dataService
      .getDoctorProfileData(this.userLocalStorageData.id)
      .subscribe((data: any) => {
        this.doctorData = data;
      });

    this.dataService
      .getDocrotSchedule(this.userLocalStorageData.id)
      .subscribe((data: any) => {
        console.log('Grafik lekarza', data);
      });

    if (this.userLocalStorageData.id !== '') {
      console.log('Dane użytkownika: ', this.userLocalStorageData);
    } else {
      this.router.navigate(['/login']);
    }
  }

  editMode() {
    this.isInEditMode = true;
  }

  saveUserData() {
    this.isInEditMode = false;
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
    console.log('Grafik lekarza', form.value);
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
