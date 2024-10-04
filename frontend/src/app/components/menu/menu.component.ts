import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserLocalStorageData } from '../../types/surveyTypes';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    InputSwitchModule,
    FormsModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  username: string = '';
  checked: boolean = false;
  userRole: string = '';

  constructor(
    private router: Router,
    private service: LoginService,
    private renderer: Renderer2,
    private loginService: LoginService
  ) {
    this.getStatus();
  }

  ngOnInit(): void {
    this.toggleDarkTheme();
    this.loginService.getRole().subscribe((role) => {
      this.userRole = role;
    });
  }

  getStatus() {
    this.service.getUsername().subscribe((username) => {
      this.username = username;
    });
  }

  logout() {
    this.service.logout();
    this.getStatus();
    this.router.navigate(['/login']);
  }

  toggleDarkTheme() {
    if (this.checked) {
      this.renderer.addClass(document.body, 'dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}
