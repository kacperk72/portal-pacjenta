import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { MatIconModule } from '@angular/material/icon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ai-doctor',
  standalone: true,
  imports: [
    TabViewModule,
    MatIconModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './ai-doctor.component.html',
  styleUrl: './ai-doctor.component.css',
})
export class AiDoctorComponent {}
