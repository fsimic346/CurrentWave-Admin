import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { ToastModule } from 'primeng/toast';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    MessageService,
    importProvidersFrom(BrowserAnimationsModule, BrowserModule, ToastModule),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'currentwave-563b3',
        appId: '1:214702271750:web:4bf5a93092d8b0757c8287',
        storageBucket: 'currentwave-563b3.appspot.com',
        //@ts-ignore
        locationId: 'europe-central2',
        apiKey: 'AIzaSyATMkQlyO2nL_yKV3uwz-OuY_IAMZtX_-A',
        authDomain: 'currentwave-563b3.firebaseapp.com',
        messagingSenderId: '214702271750',
        measurementId: 'G-12H1ZL3EYH',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
  ],
};
