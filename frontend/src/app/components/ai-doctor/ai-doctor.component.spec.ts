import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiDoctorComponent } from './ai-doctor.component';

describe('AiDoctorComponent', () => {
  let component: AiDoctorComponent;
  let fixture: ComponentFixture<AiDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AiDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
