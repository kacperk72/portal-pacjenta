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
  private role = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.loadInitialState();
  }

  loadInitialState() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    this.loggedIn.next(!!token);
    if (username) {
      this.username.next(username);
    }
    if (role) {
      this.role.next(role);
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

  setRole(role: string) {
    this.role.next(role);
    localStorage.setItem('role', role);
  }

  getRole(): Observable<string> {
    return this.role.asObservable();
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false);
    this.username.next('');
    window.location.reload();
  }

  proceedLogin(userData: User): Observable<any> {
    return this.http.post<{ token: string }>(
      'http://localhost:3000/user/login',
      userData
    );
  }
}
