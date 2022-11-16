import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from '../../core/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getAnnual(): Observable<any> {
    const url = `${Backend.Host}/leaves/annual`;
    return this.get(url, 'LeaveService', 'getAnnual');
  }

  applyLeave(leave: any): Observable<any> {
    const url = `${Backend.Host}/leaves/apply`;
    return this.post(url, leave, 'LeaveService', 'applyLeave');
  }

  getHours(userId: string, sts: number, ets: number): Observable<any> {
    const url = `${Backend.Host}/leaves/hours?userId=${userId}&sts=${sts}&ets=${ets}`;
    return this.get(url, 'LeaveService', 'getHours');
  }

  getByQuery(leaveType: string, sts: number, ets: number): Observable<any> {
    const url = `${Backend.Host}/leaves/list?leaveType=${leaveType}&startDate=${sts}&endDate=${ets}`;
    return this.get(url, 'LeaveService', 'getByQuery');
  }

  getByFlowId(flowId: string): Observable<any> {
    const url = `${Backend.Host}/leaves/${flowId}`;
    return this.get(url, 'LeaveService', 'getByFlowId');
  }
}
