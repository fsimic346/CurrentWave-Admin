import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ToastModule } from 'primeng/toast';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { Auth, authState, User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Admin-Panel';
  user$: Observable<User | null>;

  constructor(private primengConfig: PrimeNGConfig, private auth: Auth) {
    this.user$ = authState(this.auth);
  }
  ngOnInit(): void {}
}
