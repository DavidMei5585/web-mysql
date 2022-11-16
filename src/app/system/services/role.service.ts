import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from '../../core/services/base.service';
import { HttpUtil } from '../../core/utils/http-util';
import { Role } from '../models/role.model';

/**
 * 角色相關 HttpClient
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService {
  constructor(protected http: HttpClient, private httpUtil: HttpUtil) {
    super(http);
  }

  /**
   * 取角色資料
   * @returns
   */
  getRoles(): Observable<Role[]> {
    const url = `${Backend.Host}/roles`;
    return this.get(url, 'RoleService', 'getRoles');
  }

  /**
   * 取角色資料
   * @param id uuid
   * @returns
   */
  getRole(id: string): Observable<Role> {
    const url = `${Backend.Host}/roles/${id}`;
    return this.get(url, 'RoleService', 'getRole');
  }

  /**
   * 儲存角色資料
   * @param role
   * @returns
   */
  saveRole(role: Role): Observable<Role> {
    const url = `${Backend.Host}/roles`;
    return this.post(url, role, 'RoleService', 'saveRole');
  }

  /**
   * 刪除角色資料
   * @param id
   * @returns
   */
  delRole(id: string): Observable<any> {
    const url = `${Backend.Host}/roles/${id}`;
    return this.delete(url, 'RoleService', 'delRole');
  }

  /**
   * 下載角色清單PDF
   * @returns
   */
  download(): Observable<any> {
    const url = `${Backend.Host}/roles/download`;
    return this.get(url, 'RoleService', 'download', {
      headers: this.httpUtil.GetReqHeader(),
      responseType: 'blob'
    });
  }

  /**
   * 下載角色清單PDF
   * @returns
   */
  downloadWithFunc(): Observable<any> {
    const url = `${Backend.Host}/roles/downloadWithFunc`;
    return this.get(url, 'RoleService', 'downloadWithFunc', {
      headers: this.httpUtil.GetReqHeader(),
      responseType: 'blob'
    });
  }
}
