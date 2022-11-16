import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from '../../core/services/base.service';
import { HttpUtil } from '../../core/utils/http-util';

/**
 * 操作教學相關 HttpClient
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class HelperService extends BaseService {
  constructor(protected http: HttpClient, private httpUtil: HttpUtil) {
    super(http);
  }

  /**
   * 取操作教學
   * @returns
   */
  getHelpers(): Observable<any> {
    const url = `${Backend.Host}/helpers`;
    return this.get(url, 'HelperService', 'getHelpers');
  }

  /**
   * 刪除操作教學
   * @param id uuid
   * @returns
   */
  delHelper(id: string): Observable<any> {
    const url = `${Backend.Host}/helpers/${id}`;
    return this.delete(url, 'HelperService', 'delHelper');
  }

  /**
   * 取操作教學檔案
   * @param name 操作教學網址
   * @returns
   */
  getPdfByName(name: string): Observable<any> {
    const url = `${Backend.Host}/helpers/pdf?name=${name}`;
    return this.get(url, 'HelperService', 'getHelper', {
      headers: this.httpUtil.GetReqHeader(),
      responseType: 'blob'
    });
  }

  /**
   * 取操作教學檔案
   * @param id 操作教學uuid
   * @returns
   */
  getPdfById(id: string): Observable<any> {
    const url = `${Backend.Host}/helpers/pdf?id=${id}`;
    return this.get(url, 'HelperService', 'getHelper', {
      headers: this.httpUtil.GetReqHeader(),
      responseType: 'blob'
    });
  }

  /**
   * 儲存操作教學
   * @param data
   * @returns
   */
  uploadFile(data: FormData): Observable<any> {
    const url = `${Backend.Host}/helpers`;
    return this.post(url, data, 'FuncService', 'uploadFile');
  }
}
