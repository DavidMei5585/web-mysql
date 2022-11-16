import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Global } from 'src/app/core/common/constant';
import { RoleService } from 'src/app/system/services/role.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

/**
 * 角色維護 頁面
 * @author David
 */
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy {
  /** SubSink */
  subs = new SubSink();
  /** 響應式表單 */
  form: FormGroup = this.createForm();
  /** submit狀態 */
  submit = false;
  /** ngx-bootstrap Modal */
  modalRef!: BsModalRef;
  /** 角色資料 */
  list: any[] = [];
  /** ngx-easy-table 組態 */
  configuration!: Config;
  /** ngx-easy-table 欄位設定 */
  columns: Columns[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: 'roleCode', title: '角色代號', width: '35%' },
      { key: 'roleName', title: '角色名稱', width: '40%' },
      { key: '', title: '維護', width: '25%' }
    ];
    this.configuration.isLoading = true;
    this.subs.sink = this.roleService.getRoles().subscribe((d) => {
      this.configuration.isLoading = false;
      this.list = d;
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * 顯示 modal
   * @param template ng-template #id
   */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Global.modalConfig);
  }

  /**
   * 建立FormGroup
   */
  createForm(): FormGroup {
    return this.fb.group({
      id: null,
      roleCode: ['', Validators.required],
      roleName: ['', Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  /**
   * 往新增功能
   */
  toAdd(): void {
    this.submit = false;
    this.form.reset();
  }

  /**
   * 往編輯功能
   */
  toEdit(id: string): void {
    const role = this.list.find((d) => d.id === id);
    this.form.patchValue({
      id: role.id,
      roleCode: role.roleCode,
      roleName: role.roleName
    });
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
    const role = {
      id: formModel.id,
      roleCode: formModel.roleCode,
      roleName: formModel.roleName
    };

    this.subs.sink = this.roleService.saveRole(role).subscribe((d) => {
      if (role.id === null) {
        this.list = [...this.list, d];
      } else {
        const idx = this.list.findIndex((l) => l.id === role.id);
        this.list = [
          ...this.list.slice(0, idx),
          role,
          ...this.list.slice(idx + 1, this.list.length)
        ];
      }
      Swal.fire(Global.swalSuccess);
      this.modalRef.hide();
      this.submit = false;
    });
  }

  /**
   * 刪除
   * @param id uuid
   */
  del(id: string): void {
    this.subs.sink = this.roleService.delRole(id).subscribe(
      () => (this.list = this.list.filter((d) => d.id !== id)),
      (err) => console.log(err)
    );
  }

  /**
   * 下載角色清單PDF
   */
  download(): void {
    this.subs.sink = this.roleService.download().subscribe((d: any) => {
      saveAs(d, 'role_' + new Date().getTime() + '.pdf');
    });
  }

  /**
   * 下載角色清單PDF (含選單)
   */
  downloadWithFunc(): void {
    this.subs.sink = this.roleService.downloadWithFunc().subscribe((d: any) => {
      saveAs(d, 'role_func_' + new Date().getTime() + '.pdf');
    });
  }
}
