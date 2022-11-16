import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { BaseService } from 'src/app/core/services/base.service';

/**
 * 問題回饋 HttpClient
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class FeedbackService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * 儲存
   * @param formData
   * @returns
   */
  save(formData: FormData): Observable<any> {
    const url = `${Backend.Host}/feedbacks`;
    return this.post(url, formData, 'FeedbackService', 'save');
  }
}
