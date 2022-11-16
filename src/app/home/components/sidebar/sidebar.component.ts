import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStoreService } from 'src/app/core/services/token-store.service';
import { Func } from 'src/app/system/models/func.model';

/**
 * Sidebar 元件
 * @author David
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  /** 選單資料 */
  @Input() funcs: Func[] = [];
  /** 選單資料 */
  list: any[] = [];

  constructor(private router: Router, private tokenStoreService: TokenStoreService) {}

  ngOnInit(): void {
    if (this.funcs != null)
      this.list = this.genList(
        this.funcs.filter((x) => x.parentId == 'B89E474A-1AF0-11EA-807C-0242AC110003')
      );
  }

  genList(funcs: Func[]) {
    const list: any = [];

    if (funcs === null || funcs.length <= 0) return [];

    funcs.forEach((f) => {
      const children = this.genList(this.funcs.filter((x) => x.parentId == f.id));
      list.push({
        id: f.id,
        cname: f.funcCname,
        ename: f.funcEname,
        url: f.funcUrl,
        pid: f.parentId,
        children: children
      });
    });
    return list;
  }
}
