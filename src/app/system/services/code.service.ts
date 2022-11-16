import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from '../../core/services/base.service';
import { HttpUtil } from '../../core/utils/http-util';

/**
 * 代碼相關 HttpClient
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class CodeService extends BaseService {
  constructor(protected http: HttpClient, private httpUtil: HttpUtil) {
    super(http);
  }

  /**
   * 取代碼資料
   * @param pno 父代碼
   * @returns
   */
  getCodes(pno: string): Observable<any> {
    const url = `${Backend.Host}/codes?pno=${pno}`;
    return this.get(url, 'CodeService', 'getCodes');
  }

  /**
   * 取代碼資料
   * @param pno 父代碼
   * @returns
   */
  getCodeLike(pno: string): Observable<any> {
    const url = `${Backend.Host}/codes/like?pno=${pno}`;
    return this.get(url, 'CodeService', 'getCodes');
  }

  /**
   * 取代碼資料
   * @param pno 父代碼1,父代碼2,父代碼3...
   * @returns
   */
  getCodeList(pno: string): Observable<any> {
    const url = `${Backend.Host}/codes/list?pno=${pno}`;
    return this.get(url, 'CodeService', 'getCodes');
  }

  /**
   * 取一筆代碼資料
   * @param id uuid
   * @returns
   */
  getCode(id: string): Observable<any> {
    const url = `${Backend.Host}/codes/${id}`;
    return this.get(url, 'CodeService', 'getCode');
  }

  /**
   * 儲存代碼資料
   * @param code
   * @returns
   */
  saveCode(code: any): Observable<any> {
    const url = `${Backend.Host}/codes`;
    return this.post(url, code, 'CodeService', 'saveCode');
  }

  /**
   * 刪除代碼
   * @param id uuid
   * @returns
   */
  delCode(id: string): Observable<any> {
    const url = `${Backend.Host}/codes/${id}`;
    return this.delete(url, 'CodeService', 'delCode');
  }
}
