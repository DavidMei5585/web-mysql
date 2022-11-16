import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { from } from 'rxjs';
import { groupBy, map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { Global } from 'src/app/core/common/constant';
import { FlowService } from 'src/app/flow/services/flow.service';
import { CodeService } from 'src/app/system/services/code.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sent-list',
  templateUrl: './sent-list.component.html',
  styleUrls: ['./sent-list.component.scss']
})
export class SentListComponent implements OnInit {
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
  pagination = {
    limit: 10,
    offset: 1,
    count: -1
  };

  constructor(
    private modalService: BsModalService,
    private flowService: FlowService,
    private codeService: CodeService
  ) {}

  ngOnInit() {
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
    this.columns = [
      { key: 'flowId', title: '表單編號', width: '10%' },
      { key: 'flowType', title: '流程名稱', width: '10%' },
      { key: 'sentDate', title: '送出日期', width: '10%' },
      { key: '', title: '審核人員', width: '20%' },
      { key: 'summary', title: '摘要', width: '40%' },
      { key: 'status', title: '狀態', width: '10%' }
    ];

    this.getData();
  }

  eventEmitted($event: { event: string; value: any }): void {
    if ($event.event == 'onPagination') {
      this.pagination.limit = $event.value.limit ? $event.value.limit : this.pagination.limit;
      this.pagination.offset = $event.value.page ? $event.value.page : this.pagination.offset;
      this.pagination = { ...this.pagination };
      this.getData();
    }
  }

  getData() {
    this.configuration.isLoading = true;

    this.subs.sink = this.flowService
      .getSents(this.pagination.offset, this.pagination.limit)
      .pipe(
        switchMap((d) => {
          this.pagination.count = d.total;
          return from(d.list).pipe(
            groupBy((item: any) => item.flowId),
            mergeMap((group$) => group$.pipe(toArray())),
            map((item) => {
              return {
                flowId: item[0].flowId,
                flowType: item[0].flowType,
                sentDate: item[0].sentDate,
                summary: item[0].summary,
                status: item[0].status,
                step: item[0].step,
                flows: item
              };
            }),
            toArray()
          );
        })
      )
      .subscribe((d) => {
        this.list = d;
        this.pagination = { ...this.pagination };
        this.configuration.isLoading = false;
      });

    // this.subs.sink = this.flowService.getSents(this.pagination.offset, this.pagination.limit).subscribe(d => {
    //   this.list = d.list;
    //   this.pagination.count = d.total;
    //   this.pagination = { ...this.pagination };
    //   this.configuration.isLoading = false;
    // });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openModal(template: TemplateRef<any>, todo: any) {
    this.modalRef = this.modalService.show(template, { ...Global.modalConfig, class: 'modal-lg' });
    this.todo = todo;
  }
}
