import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { DateUtil } from 'src/app/core/utils/date-util';
import { CodeService } from 'src/app/system/services/code.service';
import { SubSink } from 'subsink';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  form: FormGroup = this.createForm();
  list: any[] = [];
  submit = false;
  query = false;
  configuration!: Config;
  columns: Columns[] = [];
  typeOpts: any[] = [];
  types: any[] = [];

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private codeService: CodeService,
    private dateUtil: DateUtil
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.subs.sink = this.codeService.getCodeList('B01').subscribe((d) => {
      this.types = d;
      this.typeOpts = d.map((element: any) => {
        return { value: element.codeNo, label: element.codeName };
      });
    });
    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: 'userId', title: '員工編號', width: '10%' },
      { key: 'cname', title: '中文姓名', width: '10%' },
      { key: 'name', title: '假別', width: '10%' },
      { key: 'email', title: '起日', width: '20%' },
      { key: 'arriveDate', title: '迄日', width: '20%' },
      { key: 'reason', title: '原因', width: '30%' }
    ];

    this.search();
  }

  createForm(): FormGroup {
    return this.fb.group({
      leaveType: '',
      startDate: '',
      endDate: ''
    });
  }

  get f() {
    return this.form.controls;
  }

  search() {
    const sdate: any = this.dateUtil.toDatetime(this.f.startDate.value);
    const edate: any = this.dateUtil.toDatetime(this.f.endDate.value);
    const startDate = new Date(sdate).getTime();
    const endDate = new Date(edate).getTime();
    const leaveType = this.f.leaveType.value ? this.f.leaveType.value.value : '';

    this.subs.sink = this.leaveService.getByQuery(leaveType, startDate, endDate).subscribe((d) => {
      this.list = d;
    });
  }
}
