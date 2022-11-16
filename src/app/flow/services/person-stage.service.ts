import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from 'src/app/core/services/base.service';
import { HttpUtil } from 'src/app/core/utils/http-util';

@Injectable({
  providedIn: 'root'
})
export class PersonStageService extends BaseService {
  constructor(protected http: HttpClient, private httpUtil: HttpUtil) {
    super(http);
  }

  getPersonStage(): Observable<any> {
    const url = `${Backend.Host}/flows/persons`;
    return this.get(url, 'PersonStageService', 'getPersonStage');
  }

  deleteById(id: string): Observable<any> {
    const url = `${Backend.Host}/flows/persons/${id}`;
    return this.delete(url, 'PersonStageService', 'deleteById');
  }

  save(list: any): Observable<any> {
    const url = `${Backend.Host}/flows/persons`;
    return this.post(url, list, 'PersonStageService', 'save');
  }
}
