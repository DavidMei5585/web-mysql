import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LeaveService } from 'src/app/leave/services/leave.service';
import { CodeService } from 'src/app/system/services/code.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-leave-main',
  templateUrl: './leave-main.component.html',
  styleUrls: ['./leave-main.component.scss']
})
export class LeaveMainComponent implements OnInit, OnDestroy {
  @Input() flowId = '';
  subs = new SubSink();
  data: any = Object.assign({});
  types: any;

  constructor(private leaveService: LeaveService, private codeService: CodeService) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.subs.sink = this.leaveService.getByFlowId(this.flowId).subscribe((d) => {
      this.data = d[0];
    });
    this.subs.sink = this.codeService.getCodeList('B01').subscribe((d) => {
      this.types = d;
    });
  }
}
