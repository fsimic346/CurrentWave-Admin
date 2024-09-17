import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'cw-navbar',
  standalone: true,
  imports: [MenubarModule, CommonModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Shirts',
        icon: 'pi pi-shopping-bag',
        command: () => {
          this.router.navigate(['/shirts']);
        },
      },
      {
        label: 'Email',
        icon: 'pi pi-envelope',
        command: () => {
          this.router.navigate(['/email']);
        },
      },
      {
        label: 'Orders',
        icon: 'pi pi-shopping-cart',
        command: () => {
          this.router.navigate(['/orders']);
        },
      },
    ];
  }

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
