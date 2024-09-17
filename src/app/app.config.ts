import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { ToastModule } from 'primeng/toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    MessageService,
    importProvidersFrom(BrowserAnimationsModule, BrowserModule, ToastModule),
  ],
};
