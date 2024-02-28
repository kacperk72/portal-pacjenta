import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegister } from './login.service';

export interface RegisterUser {
  username: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  registerUser(userData: UserRegister): Observable<any> {
    return this.http.post<{ token: string }>(
      'http://localhost:3000/user/register',
      userData
    );
  }
}
