import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  sendMessage(prompt: string): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/chat/one`, { prompt });
  }
}
