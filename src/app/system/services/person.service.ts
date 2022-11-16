import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from '../../core/services/base.service';

/**
 * 人員資料相關 HttpClient
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class PersonService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * 取人員資料
   * @param userId 人員Id
   * @returns
   */
  getPerson(userId: string): Observable<any> {
    const url = `${Backend.Host}/persons/${userId}`;
    return this.get(url, 'RoleService', 'getPerson');
  }

  /**
   * 刪除人員資料
   * @param userId 人員Id
   * @returns
   */
  delPerson(userId: string): Observable<any> {
    const url = `${Backend.Host}/persons/${userId}`;
    return this.delete(url, 'RoleService', 'delPerson');
  }

  /**
   * 儲存人員資料
   * @param person
   * @returns
   */
  savePerson(person: any): Observable<any> {
    const url = `${Backend.Host}/persons`;
    return this.post(url, person, 'RoleService', 'savePerson');
  }

  /**
   * 取人員角色
   * @param userId 人員Id
   * @returns
   */
  getRoles(userId: string): Observable<any> {
    const url = `${Backend.Host}/persons/role/${userId}`;
    return this.get(url, 'RoleService', 'getRoles');
  }

  /**
   * 查詢人員資料
   * @param orgCode 組織代碼
   * @param deptCode 單位代碼
   * @param userId 人員Id
   * @param name 英文帳號
   * @param cname 中文姓名
   * @param roleId 角色Id
   * @returns
   */
  getPersons(
    orgCode: string,
    deptCode: string,
    userId: string,
    name: string,
    cname: string,
    roleId: string
  ): Observable<any> {
    const url = `${Backend.Host}/persons?orgCode=${orgCode}&deptCode=${deptCode}&userId=${userId}&name=${name}&cname=${cname}&roleId=${roleId}`;
    return this.get(url, 'RoleService', 'getPersonRole');
  }

  /**
   * 儲存人員角色
   * @param personRole
   * @returns
   */
  savePersonRole(personRole: any): Observable<any> {
    const url = `${Backend.Host}/persons/role`;
    return this.post(url, personRole, 'RoleService', 'savePersonRole');
  }
}
