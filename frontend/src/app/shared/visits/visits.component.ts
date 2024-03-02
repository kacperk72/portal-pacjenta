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

@Component({
  selector: 'app-visits',
  standalone: true,
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
  ],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.css',
})
export class VisitsComponent implements OnInit {
  searchForm = new FormGroup({
    specialization: new FormControl(''),
    location: new FormControl(''),
    appointmentType: new FormControl(true),
  });
  specializations = ['Ginekolog'];
  locations = ['Kraków'];

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.searchForm.value);
  }
}
