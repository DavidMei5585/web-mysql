import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Global } from 'src/app/core/common/constant';
import { TokenStoreService } from 'src/app/core/services/token-store.service';
import { FlowService } from 'src/app/flow/services/flow.service';
import { CodeService } from 'src/app/system/services/code.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  list: any;
  submit = false;
  modalRef!: BsModalRef;
  stageCodes: any[] = [];
  typeCodes: any[] = [];
  deptCodes: any[] = [];
  statusCodes: any[] = [];
  actionCodes: any[] = [];
  todo: any;
  configuration!: Config;
  columns: Columns[] = [];

  constructor(
    private modalService: BsModalService,
    private tokenStoreService: TokenStoreService,
    private flowService: FlowService,
    private codeService: CodeService
  ) {}

  ngOnInit() {
    this.subs.sink = this.flowService.getTodos().subscribe((res) => {
      this.list = res.map((d: any) => {
        return { checked: false, ...d };
      });
    });

    this.subs.sink = this.codeService.getCodeList('F01,F02,F03,F04').subscribe((res) => {
      this.stageCodes = res.filter((d: any) => d.codePno == 'F01');
      this.typeCodes = res.filter((d: any) => d.codePno == 'F02');
      this.statusCodes = res.filter((d: any) => d.codePno == 'F03');
      this.actionCodes = res.filter((d: any) => d.codePno == 'F04');
    });

    this.subs.sink = this.codeService.getCodeLike('D').subscribe((res) => {
      this.deptCodes = res;
    });

    this.configuration = { ...DefaultConfig };
    this.configuration.checkboxes = true;
    this.columns = [
      { key: 'flowId', title: '表單編號', width: '10%' },
      { key: 'flowType', title: '流程名稱', width: '10%' },
      { key: 'deptCode', title: '申請單位', width: '10%' },
      { key: 'titleCode', title: '申請人員', width: '10%' },
      { key: 'sentDate', title: '申請時間', width: '10%' },
      { key: 'summary', title: '摘要', width: '40%' },
      { key: 'status', title: '狀態', width: '8%' }
    ];
  }

  eventEmitted($event: { event: string; value: any }): void {
    if ($event.event == 'onSelectAll') {
      this.list.forEach((d: any) => {
        d.checked = $event.value;
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openModal(template: TemplateRef<any>, todo: any) {
    this.modalRef = this.modalService.show(template, { ...Global.modalConfig, class: 'modal-lg' });
    this.todo = todo;
  }

  confirm(action: string): void {
    const tokenPayload = this.tokenStoreService.getTokenPayload();
    const flowRecords: any[] = this.list
      .filter((d: any) => d.checked)
      .map((element: any) => {
        return {
          flowId: element.flowId,
          stageCode: element.stageCode,
          orgCode: tokenPayload.orgCode,
          deptCode: tokenPayload.deptCode,
          userId: tokenPayload.userId,
          step: element.step,
          returnStep: element.returnStep,
          groupId: element.groupId,
          action: action
        };
      });

    if (flowRecords == null || flowRecords.length <= 0) {
      return;
    }

    this.subs.sink = this.flowService.runFlow(flowRecords).subscribe(
      () => {
        this.list = this.list.filter((d: any) => !flowRecords.some((x) => x.flowId == d.flowId));
        Swal.fire(Global.swalSuccess);
      },
      (error) => {
        Swal.fire(error.message);
      }
    );
  }
}
