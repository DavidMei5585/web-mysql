import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from '../../core/services/base.service';
import { HttpUtil } from '../../core/utils/http-util';

@Injectable({
  providedIn: 'root'
})
export class FlowService extends BaseService {
  constructor(protected http: HttpClient, private httpUtil: HttpUtil) {
    super(http);
  }

  getTodos(): Observable<any> {
    const url = `${Backend.Host}/flows/todos`;
    return this.get(url, 'FlowService', 'getTodos');
  }

  getFlowStage(flowId: string): Observable<any> {
    const url = `${Backend.Host}/flows/stages/${flowId}`;
    return this.get(url, 'FlowService', 'getFlowStage');
  }

  getStages(userId: string, flowType: string): Observable<any> {
    const url = `${Backend.Host}/flows/stages/${userId}/${flowType}`;
    return this.get(url, 'FlowService', 'getStages');
  }

  updStages(items: any): Observable<any> {
    const url = `${Backend.Host}/flows/stages`;
    return this.put(url, items, 'FlowService', 'updStages');
  }

  getFlowRecord(flowId: string): Observable<any> {
    const url = `${Backend.Host}/flows/records/${flowId}`;
    return this.get(url, 'FlowService', 'getFlowRecord');
  }

  getFlowCurrent(flowId: string): Observable<any> {
    const url = `${Backend.Host}/flows/currents/${flowId}`;
    return this.get(url, 'FlowService', 'getFlowCurrent');
  }

  runFlow(flowRecords: any[]): Observable<any> {
    const url = `${Backend.Host}/flows/todos`;
    return this.put(url, flowRecords, 'FlowService', 'runFlow');
  }

  getSents(page: number, size: number): Observable<any> {
    const url = `${Backend.Host}/flows/sents/${page}/${size}`;
    return this.get(url, 'FlowService', 'getSents');
  }
}
