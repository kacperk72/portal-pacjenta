import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { LoginService } from './services/login.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, MenuComponent]
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  username$: Observable<string>;

  constructor(private loginService: LoginService) {
    this.isLoggedIn$ = this.loginService.isLoggedIn();
    this.username$ = this.loginService.getUsername();
  }

  ngOnInit(): void {}
}
