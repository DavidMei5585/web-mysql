import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as sha512 from 'js-sha512';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/core/common/constant';
import { HttpUtil } from '../utils/http-util';
import { BaseService } from './base.service';

/**
 * 登入（驗證相關）HttpClient
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService {
  constructor(protected http: HttpClient, private httpUtil: HttpUtil) {
    super(http);
  }

  /**
   * AD 登入
   * @param token (由 IIS AD 驗證產生傳入)
   * @returns
   */
  link(token: string): Observable<any> {
    const url = `${Backend.Host}/auth/link?token=${token}`;
    return this.get(url, 'AuthenticationService', 'link', {
      headers: this.httpUtil.GetReqHeaderWithoutToken()
    });
  }

  /**
   * 一般登入
   * @param userId 帳號
   * @param password 密碼
   * @param code 驗證碼(表單輸入)
   * @param verifyCode 驗證碼(系統產生)
   * @returns JwtInfo
   */
  login(userId: string, password: string, code: string, verifyCode: string): Observable<any> {
    const url = `${Backend.Host}/auth/login`;
    return this.post(
      url,
      {
        userId: userId,
        password: sha512.sha512(password),
        code: code,
        verifyCode: verifyCode
      },
      'AuthenticationService',
      'login',
      { headers: this.httpUtil.GetReqHeaderWithoutToken() }
    );
  }

  /**
   * 登出
   * @returns
   */
  logout(): Observable<any> {
    const url = `${Backend.Host}/auth/logout`;
    return this.put(url, 'AuthenticationService', 'logout');
  }

  /**
   * 重設 Token
   * @returns JwtInfo
   */
  refreshToken(): Observable<any> {
    const url = `${Backend.Host}/auth/refresh`;
    return this.put(url, null, 'AuthenticationService', 'refreshToken');
  }

  /**
   * 取得選單
   * @returns
   */
  getFunc(): Observable<any> {
    const url = `${Backend.Host}/auth/funcs`;
    return this.get(url, 'AuthenticationService', 'getFunc');
  }

  /**
   * 取路徑權限
   * @param path
   * @returns
   */
  getPermission(path: string): Observable<any> {
    const url = `${Backend.Host}/auth/permissions`;
    return this.post(url, { name: path }, 'AuthenticationService', 'getPermission');
  }

  /**
   * 取得線上人員名單
   * @returns
   */
  getOnlineUsers(): Observable<any> {
    const url = `${Backend.Host}/auth`;
    return this.get(url, 'AuthenticationService', 'getOnlineUsers');
  }

  /**
   * 中斷線上人員登入狀態
   * @param id uuid
   * @returns
   */
  suspendUser(id: string): Observable<any> {
    const url = `${Backend.Host}/auth/${id}`;
    return this.put(url, null, 'AuthenticationService', 'suspendUser');
  }

  /**
   * 發送重設密碼信件
   * @param userId
   * @returns
   */
  sendRestPwd(userId: string): Observable<any> {
    const url = `${Backend.Host}/auth/pwd`;
    return this.post(url, { userId: userId }, 'AuthenticationService', 'sendRestPwd');
  }

  /**
   * 驗證重設密碼token
   * @param token 重設密碼token
   * @returns
   */
  linkPwd(token: string): Observable<any> {
    const url = `${Backend.Host}/auth/pwd/${token}`;
    return this.get(url, 'AuthenticationService', 'linkPwd', {
      headers: this.httpUtil.GetReqHeaderWithoutToken()
    });
  }

  /**
   * 重設密碼
   * @param reset
   * @returns
   */
  restPwd(reset: any): Observable<any> {
    const url = `${Backend.Host}/auth/pwd`;
    return this.put(url, reset, 'AuthenticationService', 'restPwd');
  }

  /**
   * 人員註冊
   * @param person
   * @returns Observable
   */
  register(person: any): Observable<any> {
    const url = `${Backend.Host}/auth/register`;
    return this.post(url, person, 'AuthenticationService', 'register', {
      headers: this.httpUtil.GetReqHeaderWithoutToken()
    });
  }

  /**
   * 驗證碼
   * @returns Observable
   */
  imageCode(): Observable<any> {
    const url = `${Backend.Host}/auth/imageCode`;
    return this.get(url, 'AuthenticationService', 'imageCode');
  }
}
