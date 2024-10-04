import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface userLocalStorageData {
  id: string;
  role: string;
  username: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserData(): userLocalStorageData {
    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (id && role && username && token) {
      return { id, role, username, token };
    } else {
      return { id: '', role: '', username: '', token: '' };
    }
  }
}
