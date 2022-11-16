import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { from, Observable } from 'rxjs';
import { groupBy, map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { Global } from 'src/app/core/common/constant';
import { FlowService } from 'src/app/flow/services/flow.service';
import { LineService } from 'src/app/flow/services/line.service';
import { CodePipe } from 'src/app/shared/pipes/code.pipe';
import { CodeService } from 'src/app/system/services/code.service';
import { PersonService } from 'src/app/system/services/person.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-flow-stage',
  templateUrl: './flow-stage.component.html',
  styleUrls: ['./flow-stage.component.scss'],
  providers: [CodePipe]
})
export class FlowStageComponent implements OnInit {
  @Input() userId = '';
  @Input() flowType = '';
  @Input() flowId = '';
  @Input() step = -1;
  @Input() items: any[] = [];
  @Output() hide = new EventEmitter<boolean>();
  @Output() confirmModal = new EventEmitter<any>();
  subs = new SubSink();
  stageCodes: any;
  deptCodes: any;
  personOpts: any;
  modalRef!: BsModalRef;
  editItem: any;
  orgOpts: any;
  deptOpts: any;
  form: FormGroup = this.createForm();
  submit = false;
  returnOpts: any;
  returnId: any;
  selectedItem: any;
  drawTimeout = 300;
  isSelf = false;

  constructor(
    private fb: FormBuilder,
    private codeService: CodeService,
    private flowService: FlowService,
    private personService: PersonService,
    private modalService: BsModalService,
    private codePipe: CodePipe,
    private lineService: LineService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.codeService.getCodeList('F01').subscribe((res) => {
      this.stageCodes = res.filter((d: any) => d.codePno == 'F01');
    });
    this.subs.sink = this.codeService.getCodeLike('D').subscribe((res) => {
      this.deptCodes = res;

      this.orgOpts = res
        .filter((c: any) => c.codePno == 'D')
        .map((element: any) => {
          return {
            value: element.codeNo,
            label: element.codeName,
            children: res
              .filter((c: any) => c.codePno == element.codePno + element.codeNo)
              .map((element: any) => {
                return {
                  value: element.codeNo,
                  label: element.codeName
                };
              })
          };
        });

      this.loadFlowStage();
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      orgCode: [null, Validators.required],
      deptCode: [null, Validators.required],
      userId: [null, Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  loadFlowStage(): void {
    this.selectedItem = null;

    if (this.items != null && this.items.length > 0) {
      setTimeout(() => this.drawLine(), this.drawTimeout);
    } else {
      let observable$: Observable<any>;

      if (this.flowId !== '') {
        observable$ = this.flowService.getFlowStage(this.flowId);
      } else {
        observable$ = this.flowService.getStages(this.userId, this.flowType);
      }

      observable$
        .pipe(
          switchMap((d) =>
            from(d).pipe(
              groupBy((item: any) => item.step),
              mergeMap((group$) => group$.pipe(toArray())),
              map((item) => {
                return {
                  id: item[0].id,
                  stageCode: item[0].stageCode,
                  step: item[0].step,
                  returnId:
                    item[0].returnStep == null
                      ? null
                      : d.find((x: any) => x.step == item[0].returnStep).id,
                  stages: item,
                  selected: false
                };
              }),
              toArray()
            )
          )
        )
        .subscribe((d) => {
          this.items = d;
          setTimeout(() => this.drawLine(), this.drawTimeout);
        });
    }
  }

  selectItem(item: any): void {
    this.isSelf = false;
    this.selectedItem = null;
    this.items.filter((d) => d.id != item.id).forEach((d) => (d.selected = false));
    if (item.step < this.step) {
      return;
    } else if (item.step === this.step) {
      this.isSelf = true;
    }
    this.items.find((d) => d.id == item.id).selected = !item.selected;
    this.selectedItem = this.items.find((d) => d.id == item.id).selected ? item : null;
  }

  onSelect(event: any): void {
    if (event != null) {
      this.deptOpts = this.orgOpts.find((d: any) => d.value == event.value).children;
    }
  }

  onSelectDept(event: any, isDefault = false): void {
    if (event != null) {
      const orgCode = this.f.orgCode.value ? this.f.orgCode.value.value : '';
      const deptCode = this.f.deptCode.value ? this.f.deptCode.value.value : '';
      this.subs.sink = this.personService
        .getPersons(orgCode, deptCode, '', '', '', '')
        .subscribe((d) => {
          this.personOpts = d.map((element: any) => {
            return { value: element.userId, label: element.cname };
          });

          if (isDefault)
            this.f.userId.patchValue(
              this.personOpts.find((d: any) =>
                this.editItem.stages.some((x: any) => x.userId == d.value)
              )
            );
        });
    }
  }

  openModal(template: TemplateRef<any>, action: string): void {
    this.modalRef = this.modalService.show(template, Global.modalConfig);
    this.editItem = Object.assign({}, this.selectedItem);

    if (action == 'add') {
      this.editItem.id = Guid.create().toString();
      this.editItem.stageCode = '04';
      this.editItem.stages = [];
      this.editItem.step += 1;
      this.editItem.returnId = '';
    } else if (action == 'return') {
      //set option
      this.returnOpts = this.items
        .filter((d) => d.id !== this.editItem.id)
        .map((d, i) => {
          return {
            value: d.id,
            label: `#${i + 1} ${this.codePipe.transform(d.stageCode, this.stageCodes)}`
          };
        });
      //指定退回
      this.returnId = this.returnOpts.find((d: any) => d.value == this.editItem.returnId);
    }
  }

  returnConfirm(): void {
    const returnItem = this.items.find((d) => d.id == this.returnId.value);
    const editItem = this.items.find((d) => d.id == this.editItem.id);
    if (editItem) {
      // 項目的return id
      editItem.returnId = this.returnId.value;
      editItem.stages.forEach((stage: any) => {
        stage.returnId = this.returnId.value;
        stage.returnStep = returnItem?.step;
      });
    }

    this.modalRef.hide();
    setTimeout(() => this.drawLine(), this.drawTimeout);
  }

  deleteReturn(): void {
    this.items.find((d) => d.id === this.editItem.id).returnId = null;
    this.modalRef.hide();
    this.drawLine();
  }

  addStagePerson(): void {
    if (
      this.form.invalid ||
      this.editItem.stages.some((d: any) => d.userId == this.f.userId.value.value)
    ) {
      return;
    }

    const tempStage = {
      id: null,
      flowId: this.flowId,
      groupId: null,
      orgCode: this.f.orgCode.value.value,
      deptCode: this.f.deptCode.value.value,
      userId: this.f.userId.value.value,
      cname: this.f.userId.value.label,
      titleCode: null,
      stageCode: this.editItem.stageCode,
      step: this.editItem.step,
      returnStep: null
    };

    this.editItem.stages = [...this.editItem.stages, tempStage];
  }

  delStagePerson(stage: any): void {
    this.editItem.stages = [...this.editItem.stages.filter((d: any) => d.userId != stage.userId)];
  }

  editConfirm(): void {
    if (this.editItem.stages == null || this.editItem.stages.length <= 0) {
      return;
    }

    const tempItem = this.items.find((d) => d.id == this.editItem.id);
    if (tempItem) {
      //edit item
      tempItem.stages = this.editItem.stages;
    } else {
      //add item
      const idx = this.editItem.step;
      this.items = [
        ...this.items.slice(0, idx),
        this.editItem,
        ...this.items.slice(idx, this.items.length)
      ];
      this.setStep();
    }
    this.modalRef.hide();
    this.form.reset();
    this.items.forEach((d) => (d.selected = false));
    this.selectedItem = null;
    setTimeout(() => this.drawLine(), this.drawTimeout);
  }

  setStep(): void {
    this.items.forEach((item, i) => {
      item.step = i;
      item.stages.forEach((stage: any) => {
        stage.step = item.step;
      });
    });
  }

  delItem(): void {
    this.items = this.items.filter((d) => d.id !== this.selectedItem.id);
    this.setStep();
    setTimeout(() => this.drawLine(), this.drawTimeout);
    this.selectedItem = null;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.currentIndex == 0 || event.currentIndex <= this.step) {
      return;
    }
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    this.setStep();
    setTimeout(() => {}, this.drawTimeout);
  }

  hideModal(): void {
    this.submit = false;
    this.hide.emit(true);
    this.lineService.clear();
  }

  confirm(): void {
    if (this.flowId !== '') {
      this.subs.sink = this.flowService.updStages(this.items).subscribe(
        () => {
          Swal.fire(Global.swalSuccess);
          this.hide.emit(true);
        },
        (error) => {
          Swal.fire(error.message);
        }
      );
    } else {
      this.confirmModal.emit(this.items);
    }
    this.lineService.clear();
  }

  drawLine(): void {
    this.lineService.draw(this.items);
    $('.leader-line').addClass('line-z-index');
  }
}
