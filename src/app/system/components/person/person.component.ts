import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { from } from 'rxjs';
import { groupBy, map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { Global } from 'src/app/core/common/constant';
import { DateUtil } from 'src/app/core/utils/date-util';
import { CodeService } from 'src/app/system/services/code.service';
import { PersonService } from 'src/app/system/services/person.service';
import { RoleService } from 'src/app/system/services/role.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

/**
 * 人員維護 頁面
 * @author David
 */
@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit, OnDestroy {
  /** SubSink */
  subs = new SubSink();
  /** 查詢 響應式表單 */
  queryForm: FormGroup = this.createQueryForm();
  /** 編輯 響應式表單 */
  form: FormGroup = this.createForm();
  /** 人員資料 */
  list: any[] = [];
  /** submit狀態 */
  submit = false;
  /** 查詢狀態 */
  query = false;
  /** ngx-bootstrap Modal */
  modalRef!: BsModalRef;
  /** 組織 option  */
  orgs: any[] = [];
  /** 單位 option  */
  depts: any[] = [];
  /** 角色 option  */
  roleOpts: any[] = [];
  /** ngx-easy-table 組態 */
  configuration!: Config;
  /** ngx-easy-table 欄位設定 */
  columns: Columns[] = [];
  /** 編輯的組織 option  */
  editOrgs: any[] = [];
  /** 編輯的單位 option  */
  editDepts: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private personService: PersonService,
    private codeService: CodeService,
    private roleService: RoleService,
    private dateUtil: DateUtil
  ) {}

  ngOnInit() {
    this.subs.sink = this.codeService
      .getCodeLike('D')
      .pipe(
        map((d) =>
          d
            .filter((c: any) => c.codePno == 'D')
            .map((element: any) => {
              return {
                value: element.codeNo,
                label: element.codeName,
                children: d
                  .filter((c: any) => c.codePno == element.codePno + element.codeNo)
                  .map((el: any) => {
                    return {
                      value: el.codeNo,
                      label: el.codeName
                    };
                  })
              };
            })
        )
      )
      .subscribe((d) => {
        this.orgs = d;
        this.editOrgs = [...this.orgs];
      });

    this.subs.sink = this.roleService.getRoles().subscribe((d) => {
      this.roleOpts = d.map((element) => {
        return { value: element.id, label: element.roleName };
      });
    });

    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: 'userId', title: '員工編號', width: '10%' },
      { key: 'name', title: '英文姓名', width: '20%' },
      { key: 'cname', title: '中文姓名', width: '15%' },
      { key: 'email', title: 'Email', width: '20%' },
      { key: '', title: '角色', width: '15%' },
      { key: '', title: '維護', width: '15%' }
    ];
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * 建立查詢 FormGroup
   */
  createQueryForm(): FormGroup {
    return this.fb.group({
      orgCode: null,
      deptCode: null,
      userId: '',
      name: '',
      cname: '',
      roleId: ''
    });
  }

  /**
   * 建立FormGroup
   */
  createForm(): FormGroup {
    return this.fb.group({
      id: null,
      userId: ['', Validators.required],
      name: ['', Validators.required],
      cname: ['', Validators.required],
      email: ['', Validators.required],
      orgCode: '',
      deptCode: '',
      roleIds: []
    });
  }

  get qf() {
    return this.queryForm.controls;
  }
  get f() {
    return this.form.controls;
  }

  /**
   * 查詢
   */
  search(): void {
    this.query = true;
    const orgCode = this.qf.orgCode.value?.value ?? '';
    const deptCode = this.qf.deptCode.value?.value ?? '';
    const userId = this.qf.userId.value ?? '';
    const name = this.qf.name.value ?? '';
    const cname = this.qf.cname.value ?? '';
    const roleId = this.qf.roleId.value?.value ?? '';

    this.configuration.isLoading = true;
    this.subs.sink = this.personService
      .getPersons(orgCode, deptCode, userId, name, cname, roleId)
      .pipe(
        switchMap((d) =>
          from(d).pipe(
            groupBy((item: any) => item.userId),
            mergeMap((group$) => group$.pipe(toArray())),
            map((array) => {
              return {
                id: array[0].id,
                userId: array[0].userId,
                orgCode: array[0].orgCode,
                deptCode: array[0].deptCode,
                name: array[0].name,
                cname: array[0].cname,
                email: array[0].email,
                roleIds: array
              };
            }),
            toArray()
          )
        )
      )
      .subscribe((d) => {
        this.list = d;
        this.configuration.isLoading = false;
      });
  }

  /**
   * 顯示 modal
   * @param template ng-template id
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
   * 往編輯功能
   */
  toEdit(userId: string): void {
    const person = this.list.find((d) => d.userId == userId);
    if (person.orgCode !== null)
      this.onSelectEdit(this.editOrgs.find((d) => d.value == person.orgCode));

    this.subs.sink = this.personService.getRoles(userId).subscribe((d) => {
      this.f.roleIds.patchValue(
        this.roleOpts.filter((v) => d.some((k: any) => k.roleId == v.value))
      );
    });

    this.form.patchValue({
      id: person.id,
      userId: person.userId,
      name: person.name,
      cname: person.cname,
      email: person.email,
      orgCode: this.editOrgs.find((d) => d.value == person.orgCode),
      deptCode: this.editDepts ? this.editDepts.find((d) => d.value == person.deptCode) : null
    });
  }

  /**
   * 儲存
   */
  save(): void {
    this.submit = true;
    if (this.form.invalid) return;

    const formModel = this.form.value;
    const person = {
      id: formModel.id,
      userId: formModel.userId,
      name: formModel.name,
      cname: formModel.cname,
      email: formModel.email,
      orgCode: formModel.orgCode ? formModel.orgCode.value : '',
      deptCode: formModel.deptCode ? formModel.deptCode.value : '',
      roleIds: formModel.roleIds ? formModel.roleIds.map((v: any) => v.value) : []
    };

    this.subs.sink = this.personService.savePerson(person).subscribe(
      () => {
        Swal.fire(Global.swalSuccess);
        this.modalRef.hide();
        this.search();
      },
      (error) => {
        Swal.fire(error.message);
      }
    );
  }

  /**
   * 刪除
   * @param id uuid
   */
  del(userId: string): void {
    this.subs.sink = this.personService.delPerson(userId).subscribe(() => {
      this.list = this.list.filter((d) => d.userId !== userId);
      Swal.fire(Global.swalDeleteSuccess);
    });
  }

  /**
   * 組織選取時
   * @param event
   */
  onSelect(event: any): void {
    if (event != null) {
      this.depts = this.orgs.find((d) => d.value == event.value).children;
    }
  }

  /**
   * 編輯的組織選取時
   * @param event
   */
  onSelectEdit(event: any): void {
    if (event != null) {
      this.editDepts = this.editOrgs.find((d) => d.value == event.value).children;
    }
  }

  /**
   * 重設表單
   */
  reset(): void {
    this.query = false;
    this.submit = false;
    this.form.reset();
    this.queryForm.reset();
  }
}
