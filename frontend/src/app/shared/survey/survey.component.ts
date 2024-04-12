import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

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
  selectedVisitReason = this.visitOptions[0];

  symptomsTime = [
    { name: '3 dni' },
    { name: '1 tydzień' },
    { name: '2 tygodnie' },
    { name: '1 miesiąc' },
    { name: 'więcej niż 1 miesiąc' },
  ];
  symptomsTimeChoosen = this.symptomsTime[0];

  highTemperature = [{ name: 'Tak' }, { name: 'Nie' }];
  highTemperatureChoosen = this.highTemperature[0];

  haveCough = [{ name: 'Tak' }, { name: 'Nie' }];
  haveCoughChoosen = this.haveCough[0];

  haveNoBreath = [{ name: 'Tak' }, { name: 'Nie' }];
  haveNoBreathChoosen = this.haveNoBreath[0];

  haveThroatAche = [{ name: 'Tak' }, { name: 'Nie' }];
  haveThroatAcheChoosen = this.haveThroatAche[0];

  haveRunnyNose = [{ name: 'Tak' }, { name: 'Nie' }];
  haveRunnyNoseChoosen = this.haveRunnyNose[0];

  haveStomachAche = [{ name: 'Tak' }, { name: 'Nie' }];
  haveStomachAcheChoosen = this.haveStomachAche[0];

  haveOtherSymptoms = [{ name: 'Tak' }, { name: 'Nie' }];
  haveOtherSymptomsChoosen = this.haveOtherSymptoms[0];

  takeMedications = [{ name: 'Tak' }, { name: 'Nie' }];
  takeMedicationsChoosen = this.takeMedications[0];

  hasAllergy = [{ name: 'Tak' }, { name: 'Nie' }];
  hasAllergyChoosen = this.hasAllergy[0];

  hasChronicDiseases = [{ name: 'Tak' }, { name: 'Nie' }];
  hasChronicDiseasesChoosen = this.hasChronicDiseases[0];

  constructor() {}

  nextStep() {
    if (this.step < 4) {
      this.step++;
    }
  }

  previousStep() {
    if (this.step > 0 && this.step < 5) {
      this.step--;
    }
  }
}
