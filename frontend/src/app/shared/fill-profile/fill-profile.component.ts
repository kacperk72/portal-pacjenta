import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fill-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './fill-profile.component.html',
  styleUrl: './fill-profile.component.css',
})
export class FillProfileComponent {
  profileForm: FormGroup = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.profileForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      DateOfBirth: ['', Validators.required],
      ContactInfo: ['', Validators.required],
      Address: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const profileData = this.profileForm.value;

      const UserID = localStorage.getItem('id');
      const fullProfileData = { ...profileData, UserID };

      this.dataService.saveUserProfile(fullProfileData).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
