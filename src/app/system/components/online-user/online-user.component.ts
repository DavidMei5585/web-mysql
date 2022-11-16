import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SubSink } from 'subsink';

/**
 * 線上使用者 頁面
 * @author David
 */
@Component({
  selector: 'app-online-user',
  templateUrl: './online-user.component.html',
  styleUrls: ['./online-user.component.scss']
})
export class OnlineUserComponent implements OnInit {
  /** SubSink */
  subs = new SubSink();
  /** 線上使用者資料 */
  list: any[] = [];
  /** ngx-easy-table 組態 */
  configuration!: Config;
  /** ngx-easy-table 欄位設定 */
  columns: Columns[] = [];

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.subs.sink = this.authenticationService.getOnlineUsers().subscribe((d) => (this.list = d));

    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: 'userId', title: '使用者代號', width: '25%' },
      { key: 'cname', title: '使用者名稱', width: '20%' },
      { key: 'loginDate', title: '啟始時間', width: '35%' },
      { key: '', title: '維護', width: '10%' }
    ];
  }

  /**
   * 刪除
   * @param id uuid
   */
  del(id: string): void {
    this.subs.sink = this.authenticationService.suspendUser(id).subscribe(() => {
      this.list = this.list.filter((d) => d.id !== id);
    });
  }
}
