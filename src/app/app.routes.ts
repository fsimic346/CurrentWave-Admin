import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmailComponent } from './email/email.component';
import { OrdersComponent } from './orders/orders.component';
import { DesignsComponent } from './designs/designs.component';
import { LoginComponent } from './login/login.component';
import { authGuard, signInRedirectGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'designs', component: DesignsComponent, canActivate: [authGuard] },
  { path: 'email', component: EmailComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  {
    path: 'signin',
    component: LoginComponent,
    canActivate: [signInRedirectGuard],
  },
];
