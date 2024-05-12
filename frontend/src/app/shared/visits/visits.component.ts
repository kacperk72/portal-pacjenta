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
import { DataService } from '../../core/data.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '../date.pipe';
import { TimePipe } from '../time.pipe';

@Component({
  selector: 'app-visits',
  standalone: true,
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
  ],
})
export class VisitsComponent implements OnInit {
  searchForm = new FormGroup({
    specialization: new FormControl(''),
    location: new FormControl(''),
    appointmentType: new FormControl(true),
    date: new FormControl(''),
  });
  specializations = [{}];
  locations = [{}];
  showDoctors: boolean = false;
  visits: any = [];

  constructor(private service: DataService) {}

  ngOnInit(): void {
    this.service.getFiltersData().subscribe((data: any) => {
      console.log(data);
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
    console.log(this.searchForm.value);
  }

  searchVisits() {
    this.service.getVisits(this.searchForm.value).subscribe((visits) => {
      this.visits = visits;
    });
    console.log(this.searchForm.value);
  }
}
