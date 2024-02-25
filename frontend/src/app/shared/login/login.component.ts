import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { LoginService } from '../../core/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  userLogin = '';
  userPassword = '';
  loginData = {
    login: '',
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
    this.loginData = { login: this.userLogin, password: this.userPassword };

    this.subscription1$ = this.service
      .proceedLogin(this.loginData)
      .subscribe((response: any) => {
        if (response != null) {
          this.responsedata = response;
          // console.log(this.responsedata);
          this.actualRole = this.responsedata.result.role;
          // console.log(this.actualRole);
          localStorage.setItem('token', this.responsedata.token);
          localStorage.setItem('rola', this.actualRole);
          this.router.navigate(['/']);
        } else {
          window.alert('nieudana próba logowania');
        }
      });
  }
}
