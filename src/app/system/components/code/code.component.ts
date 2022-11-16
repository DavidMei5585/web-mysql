import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { switchMap, tap } from 'rxjs/operators';
import { Global } from 'src/app/core/common/constant';
import { CodeService } from 'src/app/system/services/code.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

/**
 * 代碼維護 頁面
 * @author David
 */
@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit, OnDestroy {
  /** SubSink */
  subs = new SubSink();
  /** 響應式表單 */
  form: FormGroup = this.createForm();
  /** submit狀態 */
  submit = false;
  /** ngx-bootstrap Modal */
  modalRef!: BsModalRef;
  /** 父代碼 參數 */
  pno = '';
  /** 父代碼名稱 參數 */
  name = '';
  /** 代碼資料 */
  list: any = [];
  /** ngx-easy-table 組態 */
  configuration!: Config;
  /** ngx-easy-table 欄位設定 */
  columns: Columns[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private modalService: BsModalService,
    private codeService: CodeService
  ) {}

  ngOnInit() {
    this.subs.sink = this.route.params
      .pipe(
        tap((v) => (this.pno = v['pno'] ? v['pno'] : '')),
        tap((v) => (this.name = v['name'] ? v['name'] : '')),
        switchMap(() => this.codeService.getCodes(this.pno))
      )
      .subscribe((d) => (this.list = d));

    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: 'codeNo', title: '代碼', width: '15%' },
      { key: 'codeName', title: '名稱', width: '15%' },
      { key: 'codeDesc', title: '說明', width: '15%' },
      { key: 'codeNote', title: '備註', width: '15%' },
      { key: 'sort', title: '排序', width: '10%' },
      { key: '', title: '維護', width: '30%' }
    ];
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * 建立FormGroup
   */
  createForm(): FormGroup {
    return this.fb.group({
      id: null,
      codePno: '',
      codeNo: ['', Validators.required],
      codeName: ['', Validators.required],
      codeDesc: '',
      codeNote: '',
      sort: null
    });
  }

  get f() {
    return this.form.controls;
  }

  /**
   * 顯示 modal
   * @param template ng-template #id
   */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Global.modalConfig);
  }

  /**
   * 往新增功能
   */
  toAdd(): void {
    this.submit = false;
    this.form.reset();
  }

  /**
   * 儲存
   */
  save(): void {
    this.submit = true;
    if (this.form.invalid) {
      return;
    }

    const formModel = this.form.value;
    const code = {
      id: formModel.id,
      codeNo: formModel.codeNo,
      codeName: formModel.codeName,
      codeDesc: formModel.codeDesc,
      codeNote: formModel.codeNote,
      codePno: this.pno,
      sort: formModel.sort
    };

    this.subs.sink = this.codeService.saveCode(code).subscribe(
      (d) => {
        if (code.id === null) {
          this.list = [...this.list, d];
        } else {
          const idx = this.list.findIndex((l: any) => l.id === code.id);
          this.list = [
            ...this.list.slice(0, idx),
            code,
            ...this.list.slice(idx + 1, this.list.length)
          ];
        }
        Swal.fire(Global.swalSuccess);
        this.modalRef.hide();
        this.submit = false;
      },
      () => {
        Swal.fire(Global.swalError);
      }
    );
  }

  /**
   * 往編輯功能
   */
  toEdit(id: string): void {
    const code = this.list.find((d: any) => d.id === id);
    this.form.patchValue({
      id: code.id,
      codeNo: code.codeNo,
      codeName: code.codeName,
      codeDesc: code.codeDesc,
      codeNote: code.codeNote,
      sort: code.sort
    });
  }

  del(id: string): void {
    this.subs.sink = this.codeService.delCode(id).subscribe(
      () => (this.list = this.list.filter((d: any) => d.id !== id)),
      (err) => console.log(err)
    );
  }

  back(): void {
    this.location.back();
  }
}
