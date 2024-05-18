import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../core/login.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

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

  ngOnInit(): void {}

  constructor(
    private router: Router,
    private service: LoginService,
    private renderer: Renderer2
  ) {
    this.getStatus();
  }

  getStatus() {
    this.service.getUsername().subscribe((username) => {
      this.username = username;
    });
  }

  logout() {
    this.service.logout();
    this.getStatus();
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
