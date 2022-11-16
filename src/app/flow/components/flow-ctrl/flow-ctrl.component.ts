import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { from } from 'rxjs';
import { groupBy, map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { CodeService } from 'src/app/system/services/code.service';
import { SubSink } from 'subsink';
import { FlowCtrlService } from '../../services/flow-ctrl.service';

@Component({
  selector: 'app-flow-ctrl',
  templateUrl: './flow-ctrl.component.html',
  styleUrls: ['./flow-ctrl.component.scss']
})
export class FlowCtrlComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  queryForm: FormGroup = this.createForm();
  list: any[] = [];
  submit = false;
  typeCodes: any;
  stageCodes: any;
  configuration!: Config;
  columns: Columns[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private flowCtrlService: FlowCtrlService,
    private codeService: CodeService,
    private dataStoreService: DataStoreService
  ) {}

  ngOnInit() {
    this.subs.sink = this.codeService.getCodeList('F01,F02').subscribe((res) => {
      this.stageCodes = res.filter((d: any) => d.codePno == 'F01');
      this.typeCodes = res.filter((d: any) => d.codePno == 'F02');
    });

    this.configuration = { ...DefaultConfig };
    this.columns = [
      { key: 'type', title: '編號', width: '10%' },
      { key: '', title: '名稱', width: '10%' },
      { key: '', title: '流程', width: '60%' },
      { key: '', title: '維護', width: '20%' }
    ];

    this.route.queryParams
      .pipe(
        map((params) => {
          if (params['m'] == 'back') {
            this.dataStoreService.data$.subscribe((d: any) => {
              if (d != null) this.f.type.patchValue(d.type);
            });
            this.search();
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  createForm() {
    return this.fb.group({
      type: ''
    });
  }

  get f() {
    return this.queryForm.controls;
  }

  search(): void {
    this.submit = true;

    this.subs.sink = this.flowCtrlService
      .getFlowCtrls(this.f.type.value)
      .pipe(
        switchMap((d) =>
          from(d).pipe(
            groupBy((item: any) => item.flowType),
            mergeMap((group$) => group$.pipe(toArray())),
            map((array) => {
              return {
                type: array[0].flowType,
                typeName: array[0].typeName,
                stage: array
              };
            }),
            toArray()
          )
        )
      )
      .subscribe(
        (d) => {
          this.list = d;
          this.dataStoreService.fetch({ type: this.f.type.value });
        },
        (error) => console.log(error)
      );
  }

  del(type: string): void {
    this.subs.sink = this.flowCtrlService.deleteFlowCtrl(type).subscribe(
      () => {
        this.list = this.list.filter((d) => d.type !== type);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
