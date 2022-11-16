import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from '../../core/services/base.service';

/**
 * 個人資訊 HttpClient
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * 取個人資訊
   * @returns
   */
  getProfile(): Observable<any> {
    const url = `${Backend.Host}/profiles`;
    return this.get(url, 'ProfileService', 'getProfile');
  }

  /**
   * 更新個人資訊
   * @param profile
   * @returns
   */
  updProfile(profile: any): Observable<any> {
    const url = `${Backend.Host}/profiles`;
    return this.put(url, profile, 'ProfileService', 'updProfile');
  }
}
