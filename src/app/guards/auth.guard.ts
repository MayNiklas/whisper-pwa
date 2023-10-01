import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

export function authGuard(): Observable<boolean | UrlTree> | boolean | UrlTree {
  const api: ApiService = inject(ApiService);
  const router: Router = inject(Router);
  return new Observable<boolean | UrlTree>((observer) => {
    api.isAuthenticated().subscribe((ans) => {
      ans ? observer.next(true) : observer.next(router.parseUrl('login'));
    });
  });
}
