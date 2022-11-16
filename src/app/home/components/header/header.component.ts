import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TokenStoreService } from 'src/app/core/services/token-store.service';
import { Func } from 'src/app/system/models/func.model';
import { SubSink } from 'subsink';
import { ProfileService } from '../../services/profile.service';

/**
 * 內容頁頭 元件
 * @author David
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges, OnInit, OnDestroy {
  /** 使用者選單 */
  @Input() funcs: Func[] = [];
  /** SubSink */
  subs = new SubSink();
  /** 功能路徑 */
  funcPath = '';
  /** 上次登入時間 */
  lastLoginDate: Date = new Date();

  constructor(
    private router: Router,
    private tokenStoreService: TokenStoreService,
    private profileService: ProfileService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.funcs) {
      this.setPath();
    }
  }

  ngOnInit(): void {
    this.setPath();

    this.subs.sink = this.router.events.subscribe((nav) => {
      if (nav instanceof NavigationEnd) {
        if (['/home', '/home/noAuthority'].indexOf(nav.url) >= 0) {
          this.funcPath = '';
        } else if (nav.url == '/home/profile') {
          this.funcPath = '個人資訊';
        } else {
          this.setPath();
        }
      }
    });

    this.subs.sink = this.profileService.getProfile().subscribe((d) => {
      this.lastLoginDate = d.lastLoginDate;
    });
  }
  /**
   * 設定功能路徑
   */
  setPath(): void {
    const func = this.funcs.find((x: any) => x.funcUrl == this.router.url);
    if (func != null) {
      this.funcPath = '';
      this.combinePath(func);
    }
  }

  /**
   * 組合選單名稱
   */
  combinePath(func: any): void {
    if (func.parentId == null || func.parentId == '') {
      return;
    }
    this.funcPath = func.funcCname + (this.funcPath == '' ? '' : ' > ') + this.funcPath;
    const parentFunc = this.funcs.find((x: any) => x.id == func.parentId);
    if (parentFunc != null) {
      this.combinePath(parentFunc);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
