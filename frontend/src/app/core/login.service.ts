import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  login: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}

  proceedLogin(userData: User): Observable<any> {
    const mockResponse = {
      success: true,
      message: 'Logowanie zakończone sukcesem',
      data: { userId: '123', token: 'abc123' },
    };

    return of(mockResponse);
  }
}
