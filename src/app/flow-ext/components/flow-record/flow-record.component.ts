import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FlowService } from 'src/app/flow/services/flow.service';
import { CodeService } from 'src/app/system/services/code.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-flow-record',
  templateUrl: './flow-record.component.html',
  styleUrls: ['./flow-record.component.scss']
})
export class FlowRecordComponent implements OnInit {
  @Input() flowId = ''; //input parameter
  @Output() hide = new EventEmitter<boolean>();
  subs = new SubSink();
  records$: Observable<any> = new Observable<any>();
  current$: Observable<any> = new Observable<any>();
  deptCodes: any[] = [];
  actionCodes: any[] = [];

  constructor(private flowService: FlowService, private codeService: CodeService) {}

  ngOnInit(): void {
    this.subs.sink = this.codeService.getCodeList('F04').subscribe((res) => {
      this.actionCodes = res.filter((d: any) => d.codePno == 'F04');
    });
    this.subs.sink = this.codeService.getCodeLike('D').subscribe((res) => {
      this.deptCodes = res;
    });
    this.records$ = this.flowService.getFlowRecord(this.flowId);
    this.current$ = this.flowService.getFlowCurrent(this.flowId);
  }

  hideModal() {
    this.hide.emit(true);
  }
}
