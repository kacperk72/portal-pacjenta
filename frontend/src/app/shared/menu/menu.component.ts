import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../core/login.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatIconModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  username: string = '';

  ngOnInit(): void {}

  constructor(private router: Router, private service: LoginService) {
    this.getStatus();
  }

  getStatus() {
    this.service.getUsername().subscribe((username) => {
      console.log(username);
      this.username = username;
    });
  }

  logout() {
    this.service.logout();
    this.getStatus();
  }
}
