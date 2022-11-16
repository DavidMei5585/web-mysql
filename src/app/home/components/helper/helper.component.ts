import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Global } from 'src/app/core/common/constant';
import { HelperService } from 'src/app/system/services/helper.service';
import { SubSink } from 'subsink';

/**
 * 使用教學 元件
 * @author David
 */
@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss']
})
export class HelperComponent implements OnInit, OnDestroy {
  /** SubSink */
  subs = new SubSink();
  /** ngx-bootstrap Modal */
  modalRef!: BsModalRef;
  /** pdf 來源 */
  pdfSrc: any;
  /** 功能網址 */
  name = '';
  /** 判斷是否有無檔案 */
  noFile = false;

  constructor(private modalService: BsModalService, private helperService: HelperService) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {}

  /**
   * 顯示 Modal
   * @param template ng-template id
   */
  openModal(template: TemplateRef<any>) {
    this.name = '';
    let combine = false;
    let i = 0;
    document.location.href.split('/').forEach((item) => {
      if (item === 'home') combine = true;
      if (combine && i < 3) {
        this.name += '/' + item;
        i += 1;
      }
    });

    this.noFile = false;
    this.pdfSrc = null;
    this.modalRef = this.modalService.show(template, { ...Global.modalConfig, class: 'modal-lg' });
    this.subs.sink = this.helperService.getPdfByName(this.name).subscribe(
      (d) => {
        console.log(d);
        if (d != null && d.size > 0) this.pdfSrc = URL.createObjectURL(d);
        else this.noFile = true;
      },
      () => {
        this.noFile = true;
      }
    );
  }
}
