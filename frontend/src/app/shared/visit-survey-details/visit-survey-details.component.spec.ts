import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitSurveyDetailsComponent } from './visit-survey-details.component';

describe('VisitSurveyDetailsComponent', () => {
  let component: VisitSurveyDetailsComponent;
  let fixture: ComponentFixture<VisitSurveyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitSurveyDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitSurveyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
