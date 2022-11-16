import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from '../../core/services/base.service';
import { Func } from '../models/func.model';

/**
 * 選單相關 HttpClient
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class FuncService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * 取選單資料
   * @returns 排序欄位
   */
  getFuncs(): Observable<Func[]> {
    const url = `${Backend.Host}/funcs?sort=sort`;
    return this.get(url, 'FuncService', 'getFuncs');
  }

  /**
   * 刪除選單資料
   * @param id uuid
   * @returns
   */
  delFunc(id: string): Observable<any> {
    const url = `${Backend.Host}/funcs/${id}`;
    return this.delete(url, 'FuncService', 'delFunc');
  }

  /**
   * 儲存選單資料
   * @param func
   * @returns
   */
  saveFunc(func: any): Observable<any> {
    const url = `${Backend.Host}/funcs`;
    return this.post(url, func, 'FuncService', 'saveFunc');
  }

  /**
   * 儲存多筆選單資料
   * @param funcs
   * @returns
   */
  saveFuncs(funcs: any[]): Observable<any> {
    const url = `${Backend.Host}/funcs/list`;
    return this.put(url, funcs, 'FuncService', 'updFuncs');
  }

  /**
   * 取一筆選單資料
   * @param id uuid
   * @returns
   */
  getFunc(id: string): Observable<any> {
    const url = `${Backend.Host}/funcs/${id}`;
    return this.get(url, 'FuncService', 'getFunc');
  }
}
