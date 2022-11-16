import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TokenStoreService } from '../services/token-store.service';

/**
 * Http 攔截器 (Http Header中塞入Token)
 * @author David
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private tokenStoreService: TokenStoreService,
    private authenticationService: AuthenticationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.tokenStoreService.getToken();
    if (token) {
      const cloned = this.addTokenToRequest(req, token);

      return next.handle(cloned).pipe(
        catchError((err) => {
          if (err.status === 401) {
            this.tokenStoreService.removeToken();
            this.router.navigate(['/noAuthority']);
            //return this.handle401Error(req, next);

            //} else if (err.status === 500) {
          }
          return throwError(err);
        })
      );
    } else {
      return next.handle(req);
    }
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next('');

      return this.authenticationService.refreshToken().pipe(
        switchMap((d) => {
          if (d != null) {
            this.tokenStoreService.setToken(d.token);
          }
          return next.handle(request);
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    } else {
      this.isRefreshingToken = false;

      return this.tokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addTokenToRequest(request, token));
        })
      );
    }
  }
}
