import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { TokenStoreService } from '../services/token-store.service';

/**
 * 路由權限守衛
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStoreService: TokenStoreService,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = this.tokenStoreService.getToken();
    if (token == null || token == '') {
      this.router.navigate(['/login']);
      return of(false);
    } else {
      if (['/home', '/home/profile'].indexOf(state.url) >= 0) {
        return of(true);
      }
      return this.authenticationService.getPermission(state.url).pipe(
        map((d) => {
          if (!d.permission) {
            this.router.navigate(['/home/noAuthority']);
          }
          return d.permission;
        }),
        catchError(() => {
          this.router.navigate(['/home/noAuthority']);
          return of(false);
        })
      );
    }
  }
}
