import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { MatIconModule } from '@angular/material/icon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SurveyComponent } from '../survey/survey.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/data.service';
import { UserService, userLocalStorageData } from '../../core/user.service';
import { Router } from '@angular/router';
import { AppointmentService } from '../../core/appointment.service';
import { CapitalizePipe } from '../capitalize.pipe';
import { catchError, of } from 'rxjs';

export interface EventItem {
  status?: string;
  doctor?: string;
  description?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
  AppointmentID?: string;
  PatientID?: string;
  DoctorID?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
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
    CapitalizePipe,
  ],
})
export class DashboardComponent implements OnInit {
  name: string = '';
  surname: string = '';
  adres: string = '';
  events: EventItem[] = [
    // {
    //   status: 'Zaplanowana',
    //   doctor: 'Dr. Jan Kowalski',
    //   description: 'Lekarz gastrolog - konsultacje wyników badań',
    //   date: '16/05/2024 10:00',
    //   icon: 'pi pi-calendar',
    //   color: '#607D8B',
    // },
  ];
  eventsHistory: EventItem[] = [
    // {
    //   status: 'Zakończona',
    //   doctor: 'Dr. Jan Kowalski',
    //   description: 'Lekarz internista - konsultacje',
    //   date: '10/10/2023 14:00',
    //   icon: 'pi pi-check',
    //   color: '#9C27B0',
    // },
  ];
  userLocalStorageData: userLocalStorageData = {
    id: '',
    role: '',
    username: '',
    token: '',
  };
  userData: any;
  isInEditMode: boolean = false;
  dataLoaded: boolean = false;
  prescriptions: any[] = [];

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private dataService: DataService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userLocalStorageData = this.userService.getUserData();

    if (this.userLocalStorageData && this.userLocalStorageData.id) {
      this.dataService
        .getUserProfileData(this.userLocalStorageData.id)
        .pipe(
          catchError((error) => {
            if (error.status === 404) {
              console.error('Profil pacjenta nie został znaleziony.');
              this.router.navigate(['/fill-profile']);
            }
            return of(null);
          })
        )
        .subscribe((data) => {
          if (data) {
            this.userData = data;
          }
        });

      this.appointmentService
        .getPatientAppointments(this.userLocalStorageData.id)
        .subscribe(
          (data) => {
            this.classifyAppointments(data);
            this.extractPrescriptions(data);
            this.dataLoaded = true;
          },
          (error) => {
            console.error('Error fetching patient appointments', error);
          }
        );
    }

    if (this.userLocalStorageData.id !== '') {
      console.log('Dane użytkownika: ', this.userLocalStorageData);
    } else {
      // console.log('Brak danych użytkownika w local storage.');
      this.router.navigate(['/login']);
    }
  }

  extractPrescriptions(appointments: any[]): void {
    appointments.forEach((appointment) => {
      if (appointment.Prescriptions && appointment.Prescriptions.length > 0) {
        appointment.Prescriptions.forEach((prescription: any) => {
          this.prescriptions.push({
            medicine: prescription.Medicine,
            dosage: prescription.Dosage,
            instructions: prescription.Instructions,
            appointmentDate: appointment.AppointmentDate,
          });
        });
      }
    });
  }

  classifyAppointments(appointments: any[]): void {
    const now = new Date();
    appointments.forEach((appointment) => {
      const eventItem = this.transformToEventItem(appointment);
      console.log('eventItem', eventItem);
      const appointmentDate = new Date(
        `${appointment.DoctorSchedule?.AvailableDate}T${appointment.DoctorSchedule?.TimeSlotFrom}`
      );
      if (appointmentDate < now) {
        console.log('true');
        this.eventsHistory.push(eventItem);
      } else {
        console.log('false');
        this.events.push(eventItem);
      }
    });
  }

  transformToEventItem(appointment: any): EventItem {
    console.log('appointment', appointment);
    return {
      status: appointment?.Status || '',
      doctor: `Dr. ${appointment?.Doctor?.DoctorProfile?.FirstName || ''} ${
        appointment?.Doctor?.DoctorProfile?.LastName || ''
      }`,
      description: `${appointment?.Doctor?.Specialization || ''} - ${
        appointment?.Treatment || 'Brak wskazówek leczenia'
      }`,
      date: this.formatDateTime(
        appointment?.DoctorSchedule?.AvailableDate || 'N/A',
        appointment?.DoctorSchedule?.TimeSlotFrom || 'N/A'
      ),
      icon:
        appointment?.Status === 'zaplanowana'
          ? 'pi pi-calendar'
          : 'pi pi-check',
      color: appointment?.Status === 'zaplanowana' ? '#607D8B' : '#FF5722',
      AppointmentID: appointment?.AppointmentID || 'N/A',
      PatientID: appointment?.PatientID || 'N/A',
      DoctorID: appointment?.DoctorID || 'N/A',
    };
  }

  formatDateTime(date: string, time: string): string {
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleString('pl-PL');
  }

  open(visit: any) {
    console.log('open', visit);
    const modalRef = this.modalService.open(SurveyComponent);
    modalRef.componentInstance.visitData = visit;
  }

  editMode() {
    this.isInEditMode = true;
  }

  saveUserData() {
    this.isInEditMode = false;

    this.dataService.updateUserProfile(this.userData).subscribe(
      (response) => {
        console.log('Dane użytkownika zostały zaktualizowane:', response);
      },
      (error) => {
        console.error('Wystąpił błąd podczas aktualizacji danych:', error);
      }
    );
  }
}
