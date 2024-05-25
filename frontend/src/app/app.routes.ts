import { Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { RegisterComponent } from './shared/register/register.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { VisitsComponent } from './shared/visits/visits.component';
import { AiDoctorComponent } from './shared/ai-doctor/ai-doctor.component';
import { DoctorDashboardComponent } from './shared/doctor-dashboard/doctor-dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'book-visit', component: VisitsComponent },
  { path: 'ai-doctor', component: AiDoctorComponent },
  { path: 'my-account', component: DashboardComponent },
  { path: 'doctor-dashboard', component: DoctorDashboardComponent },
];
