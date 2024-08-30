import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { first, from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpHandleService extends HttpHandler {
  private auth: Auth = inject(Auth);
  constructor(private readonly next: HttpHandler) {
    super();
  }
  handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    return user(this.auth).pipe(
      first(),
      switchMap((userData) => {
        if (userData) {
          return from(userData.getIdToken());
        } else {
          return of(null);
        }
      }),
      switchMap((token) => {
        if (token) {
          const clone = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
          return this.next.handle(clone);
        } else {
          return this.next.handle(req);
        }
      }),
    );
  }
}
