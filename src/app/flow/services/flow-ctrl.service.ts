import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from 'src/app/core/services/base.service';
import { HttpUtil } from 'src/app/core/utils/http-util';

@Injectable({
  providedIn: 'root'
})
export class FlowCtrlService extends BaseService {
  constructor(protected http: HttpClient, private httpUtil: HttpUtil) {
    super(http);
  }

  getFlowCtrls(flowType: string): Observable<any> {
    const url = `${Backend.Host}/flows/ctrls?flowType=${flowType}`;
    return this.get(url, 'FlowService', 'getFlowCtrls');
  }

  saveFlowCtrls(stages: any): Observable<any> {
    const url = `${Backend.Host}/flows/ctrls`;
    return this.post(url, stages, 'FlowService', 'saveFlowCtrls');
  }

  deleteFlowCtrl(flowType: string): Observable<any> {
    const url = `${Backend.Host}/flows/ctrls/${flowType}`;
    return this.delete(url, 'FlowService', 'deleteFlowCtrl');
  }
}
