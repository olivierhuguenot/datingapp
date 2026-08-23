import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { InitSevice } from '../core/services/init-sevice';
import { lastValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    provideAppInitializer(async() => {
      const initService = inject(InitSevice);

      return new Promise<void>((resolve) => {
        setTimeout(async() => {
          try {
            return lastValueFrom(initService.init())
          } finally {
            const splash = document.getElementById("initial-splash");
            if(splash) {
              splash.remove();
            }
            resolve()
          }
        }, 500)
      })

    })
  ]
};
