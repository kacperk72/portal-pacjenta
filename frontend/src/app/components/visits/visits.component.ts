import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '../../pipes/date.pipe';
import { TimePipe } from '../../pipes/time.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { AppointmentService } from '../../services/appointment.service';
import { UserService, userLocalStorageData } from '../../services/user.service';

@Component({
    selector: 'app-visits',
    templateUrl: './visits.component.html',
    styleUrl: './visits.component.css',
    imports: [
        MatSelectModule,
        MatSlideToggleModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        InputTextModule,
        DropdownModule,
        InputSwitchModule,
        MatIconModule,
        ButtonModule,
        ToolbarModule,
        CardModule,
        CalendarModule,
        CommonModule,
        DatePipe,
        TimePipe,
    ]
})
export class VisitsComponent implements OnInit {
  searchForm = new FormGroup({
    specialization: new FormControl(''),
    location: new FormControl(''),
    appointmentType: new FormControl(true),
    date: new FormControl(new Date()),
  });
  specializations = [{}];
  locations = [{}];
  showDoctors: boolean = false;
  visits: any = [];
  userLocalStorageData: userLocalStorageData = {
    id: '',
    role: '',
    username: '',
    token: '',
  };

  constructor(
    private service: DataService,
    private modalService: NgbModal,
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.service.getFiltersData().subscribe((data: any) => {
      const specializations = new Set<string>();
      const cities = new Set<string>();

      data.forEach((el: any) => {
        specializations.add(el.Specialization);
        el.Cities.split(', ').forEach((city: any) => {
          cities.add(city);
        });
      });

      this.specializations = Array.from(specializations);
      this.locations = Array.from(cities);
    });
  }

  onSubmit() {
    this.showDoctors = true;
  }

  searchVisits() {
    this.service.getVisits(this.searchForm.value).subscribe((visits) => {
      this.visits = visits;
    });
  }

  bookVisit(visit: any) {
    this.userLocalStorageData = this.userService.getUserData();

    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.visit = visit;
    modalRef.result
      .then((res) => {
        if (res === 'confirmed') {
          const appointmentData = {
            PatientID: this.userLocalStorageData.id,
            DoctorID: visit.DoctorID,
            AppointmentDate: visit.AvailableDate + ' ' + visit.TimeSlotFrom,
            Status: 'zaplanowana',
            Diagnosis: visit.Diagnosis || null, // If applicable
            Treatment: visit.Treatment || null, // If applicable
            SurveyID: visit.SurveyID || null, // If applicable
            ScheduleID: visit.ScheduleID,
          };

          this.appointmentService.bookAppointment(appointmentData).subscribe(
            (response) => {
              console.log('Appointment booked successfully', response);
            },
            (error) => {
              console.error('Error booking appointment', error);
            }
          );
        }
      })
      .catch((error) => {
        console.log('Modal dismissed with error:', error);
      });
  }
}
