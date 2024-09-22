import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegisterService } from '../../core/register.service';
import { Router } from '@angular/router';

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
    username: '',
    password: '',
    email: '',
  };
  username = '';
  userPassword = '';
  email = '';
  responsedata: any;
  actualRole = '';

  constructor(
    private fb: FormBuilder,
    private service: RegisterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: [this.username, Validators.required],
      password: [
        this.userPassword,
        [Validators.required, Validators.minLength(4)],
      ],
      email: [this.email, Validators.required],
    });
  }

  register() {
    this.username = this.registerForm.get('username')?.value;
    this.userPassword = this.registerForm.get('password')?.value;
    this.email = this.registerForm.get('email')?.value;

    this.daneUsera = {
      username: this.username,
      email: this.email,
      password: this.userPassword,
    };

    this.service.registerUser(this.daneUsera).subscribe((res) => {
      if (res != null) {
        this.responsedata = res;
        // localStorage.setItem('token', this.responsedata.token);
        // localStorage.setItem('rola', this.responsedata.user.Role);
        // localStorage.setItem('username', this.responsedata.user.Username);
        window.alert('Utworzono profil użytkownika, zaloguj się na konto');
        this.router.navigate(['/']);
      }
    });
  }
}
