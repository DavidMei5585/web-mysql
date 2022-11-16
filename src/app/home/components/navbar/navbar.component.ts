import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Global } from 'src/app/core/common/constant';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TokenStoreService } from 'src/app/core/services/token-store.service';
import { Func } from 'src/app/system/models/func.model';

/**
 * navbar 元件
 * @author David
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnChanges, OnInit {
  /** 選單資料 */
  @Input() funcs: Func[] = [];
  /** 選單資料 */
  list: any[] = [];
  /** 姓名英文簡寫 */
  nameAbbr = '';
  /** ngx-bootstrap Modal */
  modalRef!: BsModalRef;
  /** root func's uuid */
  rootId = '';

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private tokenStoreService: TokenStoreService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.funcs) {
      this.rootId = this.funcs.find((x) => x.parentId == null || x.parentId == '')?.id ?? '';
      if (this.funcs != null) {
        this.list = this.genList(this.funcs.filter((x) => x.parentId == this.rootId));
      }
    }
  }

  ngOnInit(): void {
    const tokenPayload = this.tokenStoreService.getTokenPayload();
    if (tokenPayload != null) {
      const name = tokenPayload.name;
      if (name != null) {
        if (name.includes('.')) {
          const nameArr = name.split('.');
          if (nameArr.length == 2) {
            this.nameAbbr = nameArr[0].substring(0, 1) + nameArr[1].substring(0, 1);
          }
        } else if (name.length >= 1) {
          this.nameAbbr = name.substring(0, 1);
        }
      }
    }
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, Global.modalConfig);
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

  logout(): void {
    this.authenticationService.logout().subscribe();
    this.tokenStoreService.removeToken();
    this.router.navigate(['/login']);
  }
}
