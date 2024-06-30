import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SurveyService } from '../../core/survey.service';
import { EventItem } from '../dashboard/dashboard.component';

export interface SurveyData {
  visitReason: { name: string };
  symptomsTime: { name: string } | null;
  highTemperature: { name: string } | null;
  haveCough: { name: string } | null;
  haveNoBreath: { name: string } | null;
  haveThroatAche: { name: string } | null;
  haveRunnyNose: { name: string } | null;
  haveStomachAche: { name: string } | null;
  haveOtherSymptoms: { name: string } | null;
  takeMedications: { name: string };
  medicationsDetails: string | null;
  hasAllergy: { name: string };
  allergyDetails: string | null;
  hasChronicDiseases: { name: string };
  chronicDiseasesDetails: string | null;
  neededMedications: string | null;
  currentMedications: string | null;
  referralReason: string | null;
  referralCause: string | null;
  testResults: string | null;
}

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    MatIconModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.css',
})
export class SurveyComponent {
  @Input() visitData: EventItem = {};

  activeModal = inject(NgbActiveModal);
  step: number = 0;
  surveyFull: boolean = false;
  visitOptions = [
    { name: 'Odnowienie recepty' },
    { name: 'Objawy przeziębienia' },
    { name: 'Wystawienie skierowania' },
    { name: 'Konsultacja wyników badań' },
    { name: 'Inne' },
  ];

  symptomsTime = [
    { name: '3 dni' },
    { name: '1 tydzień' },
    { name: '2 tygodnie' },
    { name: '1 miesiąc' },
    { name: 'więcej niż 1 miesiąc' },
  ];

  highTemperature = [{ name: 'Tak' }, { name: 'Nie' }];

  haveCough = [
    { name: 'Tak, mokry' },
    { name: 'Tak, suchy' },
    { name: 'Nie' },
    { name: 'Nie wiem' },
  ];

  haveNoBreath = [{ name: 'Tak' }, { name: 'Nie' }];

  haveThroatAche = [{ name: 'Tak' }, { name: 'Nie' }];

  haveRunnyNose = [{ name: 'Tak' }, { name: 'Nie' }];

  haveStomachAche = [
    { name: 'Tak, ból nadbrzusza' },
    { name: 'Tak, ból podbrzusza' },
    { name: 'Tak, cały brzuch' },
    { name: 'Nie' },
    { name: 'Ciężko powiedzieć' },
  ];

  haveOtherSymptoms = [{ name: 'Tak' }, { name: 'Nie' }];

  takeMedications = [{ name: 'Tak' }, { name: 'Nie' }];

  hasAllergy = [{ name: 'Tak' }, { name: 'Nie' }];

  hasChronicDiseases = [{ name: 'Tak' }, { name: 'Nie' }];

  surveyData = {
    visitReason: { name: '' },
    symptomsTime: null,
    highTemperature: null,
    haveCough: null,
    haveNoBreath: null,
    haveThroatAche: null,
    haveRunnyNose: null,
    haveStomachAche: null,
    haveOtherSymptoms: null,
    takeMedications: { name: '' },
    medicationsDetails: null,
    hasAllergy: { name: '' },
    allergyDetails: null,
    hasChronicDiseases: { name: '' },
    chronicDiseasesDetails: null,
    neededMedications: null,
    currentMedications: null,
    referralReason: null,
    referralCause: null,
    testResults: null,
  };

  constructor(private surveyService: SurveyService) {}

  nextStep() {
    if (this.step < 2) {
      this.step++;
    }
  }

  previousStep() {
    if (this.step > 0 && this.step < 3) {
      this.step--;
    }
  }
  saveSurvey() {
    console.log('Survey data to save:', this.surveyData);
    this.surveyService
      .saveSurvey(this.surveyData, this.visitData)
      .subscribe((res: any) => {
        console.log('Survey data saved', res);
        this.activeModal.close('Close click');
      });
  }
}
