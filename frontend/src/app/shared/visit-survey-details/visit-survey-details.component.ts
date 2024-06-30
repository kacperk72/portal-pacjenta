import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-visit-survey-details',
  standalone: true,
  imports: [],
  templateUrl: './visit-survey-details.component.html',
  styleUrl: './visit-survey-details.component.css',
})
export class VisitSurveyDetailsComponent implements OnInit {
  @Input() event: any;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    console.log(this.event);
  }
}
