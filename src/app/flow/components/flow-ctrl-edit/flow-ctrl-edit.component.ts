import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { switchMap, tap } from 'rxjs/operators';
import { Global } from 'src/app/core/common/constant';
import { StageItem } from 'src/app/flow/models/stage-item';
import { CodePipe } from 'src/app/shared/pipes/code.pipe';
import { CodeService } from 'src/app/system/services/code.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { FlowCtrlService } from '../../services/flow-ctrl.service';
import { LineService } from '../../services/line.service';

@Component({
  selector: 'app-flow-ctrl-edit',
  templateUrl: './flow-ctrl-edit.component.html',
  styleUrls: ['./flow-ctrl-edit.component.scss'],
  providers: [CodePipe]
})
export class FlowCtrlEditComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  form: FormGroup = this.createForm();
  submit = false;
  added = false;
  modalRef!: BsModalRef;
  items: StageItem[] = [];
  selectedItem: any;
  stageCodes: any[] = [];
  stageOpts: any[] = [];
  stage: any;
  returnOpts: any[] = [];
  returnId: any;
  typeCodes: any[] = [];
  flagCodes: any[] = [];
  flagList: any[] = [];
  flag: any;
  drawTimeout = 150;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private codeService: CodeService,
    private flowCtrlService: FlowCtrlService,
    private codePipe: CodePipe,
    private lineService: LineService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.route.params
      .pipe(
        tap((p) => this.f.type.patchValue(p['type'])),
        switchMap((p) => this.flowCtrlService.getFlowCtrls(p['type']))
      )
      .subscribe((d) => {
        if (d.length == 0) {
          this.selectedItem = {
            id: Guid.create().toString(),
            code: '00',
            flag: '',
            returnId: null,
            data: null,
            selected: true
          };
          this.items = [this.selectedItem];
        } else {
          this.items = d.map((element: any) => {
            return {
              id: element.id,
              code: element.stageCode,
              flag: element.flag,
              returnId:
                element.returnStep === null
                  ? null
                  : d.find((x: any) => x.step == element.returnStep).id,
              selected: false
            };
          });
          setTimeout(() => this.lineService.draw(this.items), this.drawTimeout);
        }
      });

    this.subs.sink = this.codeService.getCodeList('F01,F02,F05').subscribe((res) => {
      this.flagCodes = res.filter((d: any) => d.codePno == 'F05');
      this.flagList = this.flagCodes.map((element) => {
        return { value: element.codeNo, label: element.codeName };
      });

      this.stageCodes = res.filter((d: any) => d.codePno == 'F01');
      this.stageOpts = this.stageCodes
        .filter((d) => d.codeNo != '00' && d.codeNo != '04')
        .map((element) => {
          return { value: element.codeNo, label: element.codeName };
        });
      this.typeCodes = res.filter((d: any) => d.codePno == 'F02');
      this.f.typeName.patchValue(this.codePipe.transform(this.f.type.value, this.typeCodes));
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      type: '',
      typeName: ['', Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.currentIndex == 0) {
      return;
    }
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    setTimeout(() => this.lineService.draw(this.items), this.drawTimeout);
  }

  openModal(template: TemplateRef<any>, isReturn = false): void {
    this.modalRef = this.modalService.show(template, Global.modalConfig);

    //指定退回
    if (isReturn) {
      this.returnId = this.returnOpts.find((d) => d.value == this.selectedItem.returnId);
      //set option
      this.returnOpts = this.items
        .filter((d) => d.id !== this.selectedItem.id)
        .map((d, i) => {
          return {
            value: d.id,
            label: `#${i + 1} ${this.codePipe.transform(d.code, this.stageCodes)}`
          };
        });
    }
  }

  selectItem(item: any): void {
    this.items.filter((d) => d.id != item.id).forEach((d) => (d.selected = false));
    this.items.find((d) => d.id == item.id)!.selected = !item.selected;
    this.selectedItem = this.items.find((d) => d.id == item.id)?.selected ? item : null;
  }

  addItem(): void {
    this.added = true;
    if (this.stage == null) {
      return;
    }
    const item: StageItem = {
      id: Guid.create().toString(),
      code: this.stage.value,
      flag: this.flag ? this.flag.value : '',
      returnId: '',
      data: [],
      selected: true
    };

    const idx =
      this.selectedItem === null ? -1 : this.items.findIndex((d) => d.id === this.selectedItem.id);
    if (idx === -1) {
      this.items = [item, ...this.items];
    } else {
      this.items = [
        ...this.items.slice(0, idx + 1),
        item,
        ...this.items.slice(idx + 1, this.items.length)
      ];
    }

    this.modalRef.hide();
    this.selectedItem = item;
    this.items.filter((d) => d.id != item.id).forEach((d) => (d.selected = false));
    this.added = false;
    setTimeout(() => this.lineService.draw(this.items), this.drawTimeout);
  }

  delItem(): void {
    this.items = this.items.filter((d) => d.id !== this.selectedItem.id);
    setTimeout(() => this.lineService.draw(this.items), this.drawTimeout);
    this.selectedItem = null;
  }

  ngOnDestroy(): void {
    this.lineService.clear();
    this.subs.unsubscribe();
  }

  confirm(): void {
    this.submit = true;

    if (this.form.invalid) {
      return;
    }

    const flowCtrls = this.items.map((item, i) => {
      return {
        flowType: this.f.type.value,
        typeName: this.f.typeName.value,
        step: i,
        stageCode: item.code,
        flag: item.flag,
        returnStep:
          item.returnId == null ? null : this.items.findIndex((d) => d.id === item.returnId)
      };
    });

    this.subs.sink = this.flowCtrlService.saveFlowCtrls(flowCtrls).subscribe(
      () => {
        Swal.fire(Global.swalSuccess);
        this.router.navigate(['/home/flow/ctrl']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  returnConfirm(): void {
    if (this.returnId == null) return;
    this.selectedItem.returnId = this.returnId.value;
    this.modalRef.hide();
    this.lineService.draw(this.items);
  }

  deleteReturn(): void {
    this.items.find((d) => d.id === this.selectedItem.id)!.returnId = '';
    this.modalRef.hide();
    this.lineService.draw(this.items);
  }
}
