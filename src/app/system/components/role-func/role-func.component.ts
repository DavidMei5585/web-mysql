import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITreeOptions } from '@circlon/angular-tree-component';
import { map, switchMap, tap } from 'rxjs/operators';
import { Global } from 'src/app/core/common/constant';
import { FuncService } from 'src/app/system/services/func.service';
import { RoleFuncService } from 'src/app/system/services/role-func.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { Func } from '../../models/func.model';

/**
 * 角色選單維護 頁面
 * @author David
 */
@Component({
  selector: 'app-role-func',
  templateUrl: './role-func.component.html',
  styleUrls: ['./role-func.component.scss']
})
export class RoleFuncComponent implements OnInit, OnDestroy {
  /** @circlon/angular-tree-component */
  @ViewChild('tree') tree: any;
  /** SubSink */
  subs = new SubSink();
  /** 角色 uuid */
  roleId = '';
  /** 角色 */
  roleCode = '';
  /** 角色名稱 */
  roleName = '';
  /** 選單資料 */
  funcs: Func[] = [];
  /** 擁有的角色選單 */
  hasRoleFuncs: any[] = [];
  /** node資料 */
  nodes: any[] = [];
  /** @circlon/angular-tree-component 選項設定 */
  options: ITreeOptions = {
    isExpandedField: 'expanded',
    actionMapping: {
      mouse: {
        click: (tree: any, node: any) => this.check(node, !node.data.checked)
      }
    }
  };
  /** root func's uuid */
  rootId = '';

  constructor(
    private route: ActivatedRoute,
    private roleFuncService: RoleFuncService,
    private funcService: FuncService
  ) {}

  ngOnInit() {
    this.subs.sink = this.route.params
      .pipe(
        switchMap((params) =>
          this.roleFuncService.getFuncs(params['id']).pipe(
            tap((d) => {
              this.roleId = params['id'];
              this.roleCode = params['roleCode'];
              this.roleName = params['roleName'];
              this.hasRoleFuncs = d;
            })
          )
        ),
        switchMap(() =>
          this.funcService.getFuncs().pipe(
            map((d) => {
              this.funcs = d;
              this.rootId =
                this.funcs.find((x) => x.parentId == null || x.parentId == '')?.id ?? '';
              const datas = this.funcs.filter((x) => x.parentId == this.rootId);
              this.nodes = this.getNodes(datas);
            })
          )
        )
      )
      .subscribe(() => {
        setTimeout(() => this.tree.treeModel.expandAll(), 100);
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * 儲存
   */
  confirm(): void {
    const roleFuncs: any[] = [];
    this.getRoleFunc(roleFuncs, this.nodes);

    // add root func
    roleFuncs.push({
      roleId: this.roleId,
      funcId: this.rootId
    });

    this.subs.sink = this.roleFuncService.saveFuncs(roleFuncs).subscribe(() => {
      Swal.fire(Global.swalSuccess);
    });
  }

  /**
   * 依核取取角色選單資料
   * @param roleFuncs
   * @param nodes
   */
  getRoleFunc(roleFuncs: any[], nodes: any): void {
    nodes
      .filter((d: any) => d.checked)
      .forEach((d: any) => {
        roleFuncs.push({
          roleId: this.roleId,
          funcId: d.id
        });

        if (d.children) {
          this.getRoleFunc(roleFuncs, d.children);
        }
      });
  }

  /**
   * 取 node
   * @param datas
   * @returns
   */
  getNodes(datas: any[]): any {
    const node: any[] = [];

    datas.forEach((d) => {
      let children: any[] = [];
      const tmps = this.funcs.filter((x) => x.parentId == d.id);
      const checked = this.hasRoleFuncs.findIndex((x) => x.id == d.id) >= 0;

      if (tmps.length > 0) children = this.getNodes(tmps);

      node.push({
        id: d.id,
        name: d.funcCname,
        checked: checked,
        children: children
      });
    });
    return node;
  }

  /**
   * 核取狀態變更
   * @param node
   * @param checked
   */
  public check(node: any, checked: any) {
    this.updateChildNodeCheckbox(node, checked);
    this.updateParentNodeCheckbox(node.realParent);
  }

  /**
   * 子選單核取狀態變更
   * @param node
   * @param checked
   */
  public updateChildNodeCheckbox(node: any, checked: any) {
    node.data.checked = checked;
    if (node.children) {
      node.children.forEach((child: any) => this.updateChildNodeCheckbox(child, checked));
    }
  }

  /**
   * 父選單核取狀態變更
   * @param node
   * @returns
   */
  public updateParentNodeCheckbox(node: any) {
    if (!node) {
      return;
    }

    let allChildrenChecked = true;
    let noChildChecked = true;

    for (const child of node.children) {
      if (!child.data.checked || child.data.indeterminate) {
        allChildrenChecked = false;
      }
      if (child.data.checked) {
        noChildChecked = false;
      }
    }

    if (allChildrenChecked) {
      node.data.checked = true;
      node.data.indeterminate = false;
    } else if (noChildChecked) {
      node.data.checked = false;
      node.data.indeterminate = false;
    } else {
      node.data.checked = true;
      node.data.indeterminate = true;
    }
    this.updateParentNodeCheckbox(node.parent);
  }
}
