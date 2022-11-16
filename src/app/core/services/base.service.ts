import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Global } from '../common/constant';

/**
 * 基礎 HttpClient
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(protected http: HttpClient) {}

  /**
   * 錯誤控制
   * @param serviceName
   * @param operator
   * @param extraData
   * @returns
   */
  protected handleError(serviceName = '', operator = '', extraData?: any) {
    let errMsg = `Service Name: ${serviceName}, Operator: ${operator}`;

    return (error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error(`${errMsg}, An error occurred:${error.error.message}`);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        // switch (error.status) {
        //   case 401:
        //     break;
        //   case 403:
        //     break;
        //   case 404:
        //     break;
        //   case 500:
        //     break;
        //   default:
        //     break;
        // }
        console.error(`${errMsg}, Backend returned code ${error.status}`);
      }

      errMsg += `, extraData: ${JSON.stringify(extraData)}`;

      // return an observable with a user-facing error message
      //return throwError('Something bad happened; please try again later.');
      return throwError(error.error);
    };
  }

  /**
   * Http 參數設定
   * @param obj
   * @returns
   */
  protected transHttpParams(obj: any): HttpParams | null {
    if (obj === null) {
      return null;
    }

    let httpParams = new HttpParams();
    Object.keys(obj).forEach((key) => {
      if (obj[key]) {
        httpParams = httpParams.set(key, obj[key]);
      }
    });
    return httpParams;
  }

  //#region base rest api(get, post, put, delete)
  public get<T>(
    url: string,
    serviceName?: string,
    operator?: string,
    options?: { headers?: HttpHeaders; params?: HttpParams; responseType?: any }
  ): Observable<T> {
    return this.http
      .get<T>(url, options)
      .pipe(retry(Global.RetryCount), catchError(this.handleError(serviceName, operator, options)));
  }

  public post<T>(
    url: string,
    body: any,
    serviceName?: string,
    operator?: string,
    options?: { headers?: HttpHeaders; params?: HttpParams; responseType?: any }
  ): Observable<T> {
    return this.http
      .post<T>(url, body, options)
      .pipe(retry(Global.RetryCount), catchError(this.handleError(serviceName, operator, options)));
  }

  public put<T>(
    url: string,
    body: any,
    serviceName?: string,
    operator?: string,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.http
      .put<T>(url, body, options)
      .pipe(retry(Global.RetryCount), catchError(this.handleError(serviceName, operator, options)));
  }

  public delete<T>(
    url: string,
    serviceName?: string,
    operator?: string,
    options?: { headers?: HttpHeaders; params?: HttpParams }
  ): Observable<T> {
    return this.http
      .delete<T>(url, options)
      .pipe(retry(Global.RetryCount), catchError(this.handleError(serviceName, operator, options)));
  }
  //#endregion base rest api
}
