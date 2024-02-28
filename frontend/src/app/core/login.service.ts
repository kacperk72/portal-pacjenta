import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  username: string;
  password: string;
}

export interface UserRegister {
  username: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  proceedLogin(userData: User): Observable<any> {
    return this.http.post<{ token: string }>(
      'http://localhost:3000/user/login',
      userData
    );
  }
}
