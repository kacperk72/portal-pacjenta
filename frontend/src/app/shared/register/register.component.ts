import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegisterService } from '../../core/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  selected = 'pacjent';
  daneUsera = {
    name: '',
    surname: '',
    login: '',
    password: '',
  };
  userId = '';
  userName = '';
  userSurname = '';
  userLogin = '';
  userPassword = '';
  userRole = '';

  constructor(private fb: FormBuilder, private service: RegisterService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: [this.userName, Validators.required],
      surname: [this.userSurname, Validators.required],
      login: [this.userLogin, [Validators.required, Validators.minLength(3)]],
      password: [
        this.userPassword,
        [Validators.required, Validators.minLength(4)],
      ],
    });
  }

  register() {
    this.userName = this.registerForm.get('name')?.value;
    this.userSurname = this.registerForm.get('surname')?.value;
    this.userLogin = this.registerForm.get('login')?.value;
    this.userPassword = this.registerForm.get('password')?.value;
    this.daneUsera = {
      name: this.userName,
      surname: this.userSurname,
      login: this.userLogin,
      password: this.userPassword,
    };

    this.service.registerUser(this.daneUsera).subscribe(() => {});
  }
}
