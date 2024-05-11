import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

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
  private loggedIn = new BehaviorSubject<boolean>(false);
  private username = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.loadInitialState();
  }

  loadInitialState() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    this.loggedIn.next(!!token);
    if (username) {
      this.username.next(username);
    }
  }

  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  setUsername(name: string) {
    this.username.next(name);
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false);
    this.username.next('');
  }

  proceedLogin(userData: User): Observable<any> {
    return this.http.post<{ token: string }>(
      'http://localhost:3000/user/login',
      userData
    );
  }
}
