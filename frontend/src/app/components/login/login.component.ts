import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [MatFormFieldModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  userLogin = '';
  userPassword = '';
  loginData = {
    username: '',
    password: '',
  };
  subscription1$!: Subscription;
  responsedata: any;
  actualRole = '';

  constructor(
    private fb: FormBuilder,
    private service: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: [this.userLogin, Validators.required],
      password: [this.userPassword, Validators.required],
    });
  }

  logging() {
    this.userLogin = this.loginForm.get('login')?.value;
    this.userPassword = this.loginForm.get('password')?.value;
    this.loginData = { username: this.userLogin, password: this.userPassword };

    this.subscription1$ = this.service
      .proceedLogin(this.loginData)
      .subscribe((response: any) => {
        if (!response.errorCode) {
          this.responsedata = response;
          localStorage.setItem('token', this.responsedata.token);
          localStorage.setItem('role', this.responsedata.user.Role);
          localStorage.setItem('username', this.responsedata.user.Username);
          localStorage.setItem('id', this.responsedata.user.UserID);
          this.service.setLoggedIn(true);
          this.service.setUsername(this.responsedata.user.Username);
          this.service.setRole(this.responsedata.user.Role);
          this.router.navigate(['/']);
        } else {
          window.alert('nieudana próba logowania');
        }
      });
  }

  register() {
    this.router.navigate(['/register']);
  }
}
