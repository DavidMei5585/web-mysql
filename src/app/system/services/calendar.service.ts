import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from 'src/app/core/services/base.service';
import { HttpUtil } from 'src/app/core/utils/http-util';

/**
 * 日曆相關 HttpClient
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarService extends BaseService {
  constructor(protected http: HttpClient, private httpUtil: HttpUtil) {
    super(http);
  }

  /**
   * 取日曆資料
   * @param year 年份, ex: 2020
   * @returns Observable
   */
  getCalendars(year: number): Observable<any> {
    const url = `${Backend.Host}/calendars/${year}`;
    return this.get(url, 'CalendarService', 'getCalendars');
  }

  /**
   * 刪除日曆資料
   * @param id uuid
   * @returns Observable
   */
  deleteById(id: string): Observable<any> {
    const url = `${Backend.Host}/calendars/${id}`;
    return this.delete(url, 'CalendarService', 'deleteById');
  }

  /**
   * 儲存日曆資料
   * @param calendar
   * @returns Observable
   */
  saveCalendar(calendar: any): Observable<any> {
    const url = `${Backend.Host}/calendars`;
    return this.post(url, calendar, 'CalendarService', 'saveCalendar');
  }
}
