import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Global } from 'src/app/core/common/constant';
import { CodeService } from 'src/app/system/services/code.service';
import { PersonService } from 'src/app/system/services/person.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { PersonStageService } from '../../services/person-stage.service';

@Component({
  selector: 'app-person-stage',
  templateUrl: './person-stage.component.html',
  styleUrls: ['./person-stage.component.scss']
})
export class PersonStageComponent implements OnInit {
  subs = new SubSink();
  list: any;
  configuration!: Config;
  columns: Columns[] = [];
  stageCodes: any;
  stageList: any;
  modalRef!: BsModalRef;
  form: FormGroup = this.createForm();
  submit = false;
  personList: any;

  constructor(
    private fb: FormBuilder,
    private personStageService: PersonStageService,
    private codeService: CodeService,
    private modalService: BsModalService,
    private personService: PersonService
  ) {}

  ngOnInit() {
    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: 'stageCode', title: '關卡', width: '35%' },
      { key: 'cname', title: '人員', width: '40%' },
      { key: '', title: '維護', width: '25%' }
    ];

    this.subs.sink = this.codeService.getCodeList('F01').subscribe((res) => {
      this.stageCodes = res.filter((d: any) => d.codePno == 'F01');
      this.stageList = this.stageCodes
        .filter((d: any) => d.codeNo != '00')
        .map((element: any) => {
          return { value: element.codeNo, label: element.codeName };
        });
    });
    this.personService.getPersons('', '', '', '', '', '').subscribe((d) => {
      this.personList = d.map((element: any) => {
        return { value: element.userId, label: element.cname };
      });
    });
    this.getList();
  }

  getList(): void {
    this.subs.sink = this.personStageService.getPersonStage().subscribe((d) => {
      this.list = d;
    });
  }

  get f() {
    return this.form.controls;
  }

  createForm(): FormGroup {
    return this.fb.group({
      stageCode: [null, Validators.required],
      userId: [null, Validators.required]
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Global.modalConfig);
  }

  toAdd(): void {
    this.submit = false;
    this.form.reset();
  }

  save(): void {
    this.submit = true;
    if (this.form.invalid) return;

    const formModel = this.form.value;
    const list = {
      stageCode: formModel.stageCode.value,
      userId: formModel.userId.map((d: any) => d.value)
    };

    if (
      this.list.some(
        (d: any) => list.userId.indexOf(d.userId) >= 0 && list.stageCode == d.stageCode
      )
    ) {
      Swal.fire(Global.swalWarnMessage('重覆設定!'));
      return;
    }

    this.personStageService.save(list).subscribe(() => {
      this.getList();
      Swal.fire(Global.swalSuccess);
      this.modalRef.hide();
      this.submit = false;
    });
  }

  del(id: string): void {
    this.subs.sink = this.personStageService.deleteById(id).subscribe(() => {
      Swal.fire(Global.swalDeleteSuccess);
      this.list = this.list.filter((d: any) => d.id != id);
    });
  }
}
