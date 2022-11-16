import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITreeOptions, TREE_ACTIONS } from '@circlon/angular-tree-component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { switchMap } from 'rxjs/operators';
import { Global } from 'src/app/core/common/constant';
import { FuncService } from 'src/app/system/services/func.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

/**
 * 選單維護 頁面
 * @author David
 */
@Component({
  selector: 'app-func',
  templateUrl: './func.component.html',
  styleUrls: ['./func.component.scss']
})
export class FuncComponent implements OnInit, OnDestroy {
  /** @circlon/angular-tree-component */
  @ViewChild('tree') tree: any;
  /** 響應式表單 */
  form: FormGroup = this.createForm();
  /** SubSink */
  subs = new SubSink();
  /** 選單資料 */
  funcs: any[] = [];
  /** @circlon/angular-tree-component node資料 */
  nodes: any[] = [];
  /** 排序後 node資料 */
  seqNodes: any[] = [];
  /** 父 id */
  pid = '';
  /** 選單 uuid */
  id = '';
  /** ngx-bootstrap Modal */
  modalRef!: BsModalRef;
  /** 可否編輯狀態 */
  editable = false;
  /** submit狀態 */
  submit = false;
  /** @circlon/angular-tree-component 選項設定 */
  options: ITreeOptions = {
    allowDrag: true,
    actionMapping: {
      mouse: {
        click: (tree: any, node: any, $event: any) => {
          TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
          this.select(node);
        }
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private funcService: FuncService
  ) {}

  ngOnInit() {
    this.subs.sink = this.funcService.getFuncs().subscribe((d) => {
      this.funcs = d;
      this.genTree();
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * 顯示 modal
   * @param template
   */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Global.modalConfig);
  }

  /**
   * 建立樹狀選單
   */
  genTree(): void {
    const datas = this.funcs.filter((x) => x.parentId == null || x.parentId == ''); //get leave 1
    this.nodes = this.getNodes(datas);
    setTimeout(() => this.tree.treeModel.expandAll(), 100);
  }

  /**
   * 建立FormGroup
   */
  createForm(): FormGroup {
    return this.fb.group({
      id: null,
      parentFuncCname: '',
      parentId: '',
      funcCname: ['', Validators.required],
      funcEname: '',
      funcUrl: '',
      sort: 0
    });
  }

  get f() {
    return this.form.controls;
  }

  /**
   * 選取選單時
   * @param node
   */
  select(node: any): void {
    this.editable = node.isActive;
    this.pid = node.data.pid;
    this.id = node.data.id;
  }

  /**
   * 往編輯功能
   */
  toEdit(): void {
    this.submit = false;
    this.subs.sink = this.funcService.getFunc(this.id).subscribe((d) => {
      this.f.id.patchValue(d.id);
      this.f.funcCname.patchValue(d.funcCname);
      this.f.funcEname.patchValue(d.funcEname);
      this.f.funcUrl.patchValue(d.funcUrl);
      if (d.parentId != null) {
        this.f.parentId.patchValue(d.parentId);
        this.f.parentFuncCname.patchValue(this.funcs.find((f) => f.id === this.pid).funcCname);
      }
      this.f.sort.patchValue(d.sort);
    });
  }

  /**
   * 刪除
   */
  del(): void {
    this.subs.sink = this.funcService.delFunc(this.id).subscribe(() => {
      this.funcs = this.funcs.filter((d) => d.id !== this.id);
      Swal.fire(Global.swalDeleteSuccess);
      this.genTree();
    });
  }

  /**
   * 往新增功能
   */
  toAdd(): void {
    this.submit = false;
    this.form.reset();
    this.createForm();
    this.f.parentId.patchValue(this.id);
    this.f.parentFuncCname.patchValue(this.funcs.find((d) => d.id === this.id).funcCname);
  }

  /**
   * 儲存
   */
  save(): void {
    this.submit = true;
    if (this.form.invalid) {
      return;
    }

    const formModel = this.form.value;
    const func = {
      id: formModel.id,
      funcCname: formModel.funcCname,
      funcEname: formModel.funcEname,
      funcUrl: formModel.funcUrl,
      parentId: formModel.parentId,
      sort: formModel.sort
    };

    this.subs.sink = this.funcService.saveFunc(func).subscribe(
      (d) => {
        if (func.id !== null) {
          const idx = this.funcs.findIndex((f) => f.id === func.id);
          this.funcs = [
            ...this.funcs.slice(0, idx),
            d,
            ...this.funcs.slice(idx + 1, this.funcs.length)
          ];
        } else {
          this.funcs = [...this.funcs, d];
        }
        Swal.fire(Global.swalSuccess);
        this.form.reset();
        this.modalRef.hide();
        this.genTree();
      },
      () => {
        Swal.fire(Global.swalError);
      }
    );
  }

  /**
   * 設定選單排序
   * @param datas
   * @param pid
   */
  setSeqNodes(datas: any[], pid: string) {
    datas.forEach((d) => {
      if (d.id === pid) this.seqNodes = d.children;
      else this.setSeqNodes(d.children, pid);
    });
  }

  /**
   * 移動選單
   * @param $event
   */
  onMoveNode($event: any) {
    // 傳入$event 可用的屬性
    // console.log(
    //   "Moved",
    //   $event.node.name,
    //   "to",
    //   $event.to.parent.name,
    //   $event.to.parent.id,
    //   "at index",
    //   $event.to.index);

    this.setSeqNodes(this.nodes, $event.to.parent.id);

    const funcs = this.seqNodes.map((d, i) => {
      return {
        id: d.id,
        funcCname: d.name,
        funcEname: d.ename,
        funcUrl: d.url,
        parentId: $event.to.parent.id,
        sort: i
      };
    });

    this.subs.sink = this.funcService
      .saveFuncs(funcs)
      .pipe(switchMap(() => this.funcService.getFuncs()))
      .subscribe((d) => {
        this.funcs = d;
        this.genTree();
      });
  }

  /**
   * 遞迴建立node
   * @param datas
   * @returns
   */
  getNodes(datas: any[]): any {
    const node: any[] = [];

    datas.forEach((d) => {
      let children: any[] = [];
      const tmps = this.funcs.filter((x) => x.parentId === d.id);

      if (tmps.length > 0) children = this.getNodes(tmps);

      node.push({
        id: d.id,
        name: d.funcCname,
        ename: d.funcEname,
        url: d.funcUrl,
        pid: d.parentId,
        sort: d.sort,
        children: children
      });
    });

    return node;
  }
}
