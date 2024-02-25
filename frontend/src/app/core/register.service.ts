import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface RegisterUser {
  name: string;
  surname: string;
  login: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor() {}

  registerUser(userData: RegisterUser): Observable<any> {
    const mockResponse = {
      success: true,
      message: 'Rejestracja zakończona sukcesem',
      data: { userId: '123', token: 'abc123' },
    };

    return of(mockResponse);
  }
}
