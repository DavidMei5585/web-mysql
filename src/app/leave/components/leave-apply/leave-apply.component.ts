import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Global } from 'src/app/core/common/constant';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { TokenStoreService } from 'src/app/core/services/token-store.service';
import { DateUtil } from 'src/app/core/utils/date-util';
import { CodeService } from 'src/app/system/services/code.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave-apply',
  templateUrl: './leave-apply.component.html',
  styleUrls: ['./leave-apply.component.scss']
})
export class LeaveApplyComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  form: FormGroup = this.createForm();
  types: any[] = [];
  submit = false;
  modalRef!: BsModalRef;
  todo: any;
  items: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private codeService: CodeService,
    private tokenStoreService: TokenStoreService,
    private dataStoreService: DataStoreService,
    private dateUtil: DateUtil,
    private leaveService: LeaveService,
    private modalService: BsModalService
  ) {
    const tokenPayload = this.tokenStoreService.getTokenPayload();
    if (tokenPayload != null) {
      this.f.orgCode.patchValue(tokenPayload.orgCode);
      this.f.deptCode.patchValue(tokenPayload.deptCode);
      this.f.userId.patchValue(tokenPayload.userId);
      this.f.cname.patchValue(tokenPayload.cname);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.getHours();
    this.subs.sink = this.codeService.getCodeList('B01').subscribe((d) => {
      this.types = d.map((element: any) => {
        return { value: element.codeNo, label: element.codeName };
      });
      this.f.leaveType.patchValue(this.types.find((v) => v.value == '03')); //休假
    });

    this.f.startHour.valueChanges.subscribe(() => this.getHours());
    this.f.startMin.valueChanges.subscribe(() => this.getHours());
    this.f.endHour.valueChanges.subscribe(() => this.getHours());
    this.f.endMin.valueChanges.subscribe(() => this.getHours());
  }

  createForm(): FormGroup {
    const d = new Date();

    return this.fb.group({
      orgCode: '',
      deptCode: '',
      userId: '',
      cname: '',
      leaveType: [null, Validators.required],
      startDate: [this.dateUtil.toRocDate(d), Validators.required],
      startHour: ['08', Validators.required],
      startMin: ['30', Validators.required],
      endDate: [this.dateUtil.toRocDate(d), Validators.required],
      endHour: ['17', Validators.required],
      endMin: ['30', Validators.required],
      hours: '',
      reason: ''
    });
  }

  get f() {
    return this.form.controls;
  }

  getHours() {
    const sdate: any = this.dateUtil.toDatetime(
      this.f.startDate.value + ' ' + this.f.startHour.value + ':' + this.f.startMin.value
    );
    const edate: any = this.dateUtil.toDatetime(
      this.f.endDate.value + ' ' + this.f.endHour.value + ':' + this.f.endMin.value
    );
    const sts = new Date(sdate).getTime();
    const ets = new Date(edate).getTime();

    this.leaveService.getHours(this.f.userId.value, sts, ets).subscribe((d) => {
      this.f.hours.patchValue(d);
    });
  }

  confirm() {
    this.submit = true;
    if (this.form.invalid) {
      return;
    }
    const sdate: any = this.dateUtil.toDatetime(
      this.f.startDate.value + ' ' + this.f.startHour.value + ':' + this.f.startMin.value
    );
    const edate: any = this.dateUtil.toDatetime(
      this.f.endDate.value + ' ' + this.f.endHour.value + ':' + this.f.endMin.value
    );
    const sts = new Date(sdate).getTime();
    const ets = new Date(edate).getTime();

    const formModel = this.form.value;
    const leaveMain = {
      orgCode: formModel.orgCode,
      deptCode: formModel.deptCode,
      userId: formModel.userId,
      leaveType: formModel.leaveType.value,
      startDate: sts,
      endDate: ets,
      hours: formModel.hours,
      reason: formModel.reason,
      flowStages: this.items
    };

    this.dataStoreService.loading(true);
    this.subs.sink = this.leaveService.applyLeave(leaveMain).subscribe(
      () => {
        this.dataStoreService.loading(false);
        Swal.fire(Global.swalSuccess);
        this.router.navigate(['/home/flow/sent']);
      },
      (error) => {
        this.dataStoreService.loading(false);
        Swal.fire(error.message);
      }
    );
  }

  openModal(template: any): void {
    this.modalRef = this.modalService.show(template, { ...Global.modalConfig, class: 'modal-lg' });
  }

  confirmModal(event: any): void {
    this.items = event;
    this.modalRef.hide();
  }
}
