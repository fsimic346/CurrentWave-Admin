import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmailComponent } from './email/email.component';
import { OrdersComponent } from './orders/orders.component';
import { DesignsComponent } from './designs/designs.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'designs', component: DesignsComponent },
  { path: 'email', component: EmailComponent },
  { path: 'orders', component: OrdersComponent },
];
