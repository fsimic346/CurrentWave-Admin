import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShirtsComponent } from './shirts/shirts.component';
import { EmailComponent } from './email/email.component';
import { OrdersComponent } from './orders/orders.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shirts', component: ShirtsComponent },
  { path: 'email', component: EmailComponent },
  { path: 'orders', component: OrdersComponent },
];
