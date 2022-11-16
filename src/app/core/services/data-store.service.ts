import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * 資料存放 Service
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class DataStoreService {
  private readonly loadingSubject$ = new BehaviorSubject(false);
  readonly loading$ = this.loadingSubject$.asObservable();

  private readonly dataSubject$ = new BehaviorSubject(null);
  readonly data$ = this.dataSubject$.asObservable();

  /**
   * loading spinner
   * @param loading 是否顯示spinner
   */
  loading(loading: boolean): void {
    this.loadingSubject$.next(loading);
  }

  /**
   * 跨元件資料傳遞
   * @param data
   */
  fetch(data: any): void {
    this.dataSubject$.next(data);
  }
}
