import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast-service';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
const toast = inject(ToastService);
const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if(error.error.errors) {
              const modelsStateErrors = [];
              for(const key in error.error.errors) {
                if(error.error.errors[key]) {
                  modelsStateErrors.push(error.error.errors[key])
                }
              }
              throw modelsStateErrors.flat()
            } else {
              toast.error(error.error)
            }
            break;
          case 401:
            toast.error("Unauthroized");
            break;
          case 404:
            router.navigateByUrl("/not-found")
            break;
          case 500:
            const navigationExtra: NavigationExtras = {state: {error: error.error}}
            router.navigateByUrl("/server-error", navigationExtra)
            break;
          default:
            toast.error("Something went wrong");
            break;
        }
      }
      throw error;
    })
  )
};
