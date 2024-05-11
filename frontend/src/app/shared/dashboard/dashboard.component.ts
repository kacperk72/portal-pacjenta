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

interface EventItem {
  status?: string;
  doctor?: string;
  description?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

@Component({
  selector: 'app-dashboard',
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  name: string = '';
  surname: string = '';
  adres: string = '';
  events: EventItem[] = [
    {
      status: 'Zaplanowana',
      doctor: 'Dr. Jan Kowalski',
      description: 'Lekarz gastrolog - konsultacje wyników badań',
      date: '16/05/2024 10:00',
      icon: 'pi pi-calendar',
      color: '#607D8B',
    },
    {
      status: 'Nadchodząca',
      doctor: 'Dr. Jan Kowalski',
      description: 'Lekarz gastrolog - konsultacje',
      date: '15/05/2024 16:15',
      icon: 'pi pi-calendar',
      color: '#FF9800',
    },
    {
      status: 'Zakończona',
      doctor: 'Dr. Jan Kowalski',
      description: 'Lekarz internista - konsultacje',
      date: '15/10/2023 10:30',
      icon: 'pi pi-check',
      color: '#9C27B0',
      image: 'game-controller.jpg',
    },
    {
      status: 'Zakończona',
      doctor: 'Dr. Jan Kowalski',
      description: 'Lekarz internista - konsultacje',
      date: '10/10/2023 14:00',
      icon: 'pi pi-check',
      color: '#9C27B0',
    },
  ];
  eventsHistory: EventItem[] = [
    {
      status: 'Zakończona',
      doctor: 'Dr. Jan Kowalski',
      description: 'Lekarz internista - konsultacje',
      date: '10/10/2023 14:00',
      icon: 'pi pi-check',
      color: '#9C27B0',
    },
    {
      status: 'Zakończona',
      doctor: 'Dr. Jan Kowalski',
      description: 'Lekarz internista - konsultacje',
      date: '10/10/2023 14:00',
      icon: 'pi pi-check',
      color: '#9C27B0',
    },
    {
      status: 'Zakończona',
      doctor: 'Dr. Jan Kowalski',
      description: 'Lekarz internista - konsultacje',
      date: '10/10/2023 14:00',
      icon: 'pi pi-check',
      color: '#9C27B0',
    },
  ];
  userLocalStorageData: userLocalStorageData = {
    id: '',
    role: '',
    username: '',
    token: '',
  };
  userData: any;
  isInEditMode: boolean = false;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userLocalStorageData = this.userService.getUserData();

    this.dataService
      .getUserProfileData(this.userLocalStorageData.id)
      .subscribe((data) => {
        console.log(data);
        this.userData = data;
      });

    if (this.userLocalStorageData.id !== '') {
      console.log('Dane użytkownika: ', this.userLocalStorageData);
    } else {
      // console.log('Brak danych użytkownika w local storage.');
      this.router.navigate(['/login']);
    }
  }

  open() {
    console.log('open');
    const modalRef = this.modalService.open(SurveyComponent);
  }

  editMode() {
    this.isInEditMode = true;
  }

  saveUserData() {
    this.isInEditMode = false;
  }
}
