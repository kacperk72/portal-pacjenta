import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VisitsComponent } from './components/visits/visits.component';
import { AiDoctorComponent } from './components/ai-doctor/ai-doctor.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { FillProfileComponent } from './components/fill-profile/fill-profile.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'fill-profile', component: FillProfileComponent },
  { path: 'book-visit', component: VisitsComponent },
  { path: 'ai-doctor', component: AiDoctorComponent },
  { path: 'my-account', component: DashboardComponent },
  { path: 'doctor-dashboard', component: DoctorDashboardComponent },
];
