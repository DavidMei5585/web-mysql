import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import * as moment from 'moment-mini';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TokenStoreService } from 'src/app/core/services/token-store.service';
import { SubSink } from 'subsink';

/**
 * 登出計時 元件
 * @author David
 */
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  /** SwalComponent  */
  @ViewChild('timerSwal') private timerSwal!: SwalComponent;
  /** SubSink */
  subs = new SubSink();
  /** 計時 Observable */
  timer$: Observable<any> = new Observable<any>();
  /** 是否出現 SweetAlert 狀態 */
  isTimerSwal = false;

  constructor(
    private router: Router,
    private tokenStoreService: TokenStoreService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.timer$ = timer(0, 1000).pipe(
      map(() => {
        const tokenPayload = this.tokenStoreService.getTokenPayload();
        const expireDate = new Date(tokenPayload.exp * 1000);
        const diffTime = moment(expireDate).diff(moment());
        const duration = moment.duration(diffTime);
        const hours = duration.hours();
        const mins = duration.minutes();
        const secs = duration.seconds();
        const time = `${('00' + mins.toString()).slice(-2)}:${('00' + secs.toString()).slice(-2)}`;

        if (hours == 0 && mins != 0 && mins < 5 && !this.isTimerSwal) {
          //show alert
          this.isTimerSwal = true;
          this.timerSwal.fire();
        } else if (hours <= 0 && mins <= 0 && secs <= 0) {
          //登出
          this.tokenStoreService.removeToken();
          this.router.navigate(['/login']);
        }
        return time;
      })
    );
  }

  /**
   * 重設Token
   */
  refreshToken(): void {
    this.subs.sink = this.authenticationService.refreshToken().subscribe((d) => {
      this.tokenStoreService.setToken(d.token);
    });
  }
}
