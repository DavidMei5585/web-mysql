import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Global } from 'src/app/core/common/constant';
import { TokenPayload } from '../models/token-payload.model';

/**
 * Token相關Service
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class TokenStoreService {
  /**
   * 儲存 Token
   * @param token token
   */
  setToken(token: string): void {
    sessionStorage.setItem(Global.StorageToken, token);
  }

  /**
   * 取 Token
   * @returns token
   */
  getToken(): string {
    return sessionStorage.getItem(Global.StorageToken);
  }

  /**
   * 移除 Token
   */
  removeToken(): void {
    sessionStorage.removeItem(Global.StorageToken);
  }

  /**
   * 取 Token Payload
   * @returns Token Payload
   */
  getTokenPayload(): TokenPayload {
    const token = this.getToken();
    return jwt_decode(token);
  }
}
