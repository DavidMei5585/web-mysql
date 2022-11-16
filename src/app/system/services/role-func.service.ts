import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from '../../core/services/base.service';
import { RoleFunc } from '../models/role-func.model';

/**
 * 角色選單相關 HttpClient
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class RoleFuncService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * 依角色取選單資料
   * @param roleId 角色Id
   * @returns
   */
  getFuncs(roleId: string): Observable<RoleFunc[]> {
    const url = `${Backend.Host}/roles/funcs?roleId=${roleId}`;
    return this.get(url, 'RoleService', 'getFuncs');
  }

  /**
   * 儲存角色選單資料
   * @param roleFunc
   * @returns
   */
  saveFuncs(roleFunc: any): Observable<RoleFunc> {
    const url = `${Backend.Host}/roles/funcs`;
    return this.post(url, roleFunc, 'RoleService', 'saveFuncs');
  }
}
