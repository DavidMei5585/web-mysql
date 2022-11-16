import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStoreService } from 'src/app/core/services/token-store.service';

/**
 * Http Header Utility
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class HttpUtil {
  constructor(private tokenStoreService: TokenStoreService) {}

  /**
   * 取 Http Header
   * @returns
   */
  GetReqHeader(): HttpHeaders {
    return this.SetHeader(true, true);
  }

  /**
   * 取 Http Header
   * @returns
   */
  GetReqHeaderForPostData(): HttpHeaders {
    return this.SetHeader(true, false);
  }

  /**
   * 取 Http Header
   * @param token Token
   * @returns
   */
  GetReqHeaderforMailToken(token: string): HttpHeaders {
    return this.SetHeader(true, true, token);
  }

  /**
   * 取 Http Header (無token)
   * @returns
   */
  GetReqHeaderWithoutToken(): HttpHeaders {
    return this.SetHeader(false, true);
  }

  /**
   * 設定 Http Header
   * @param needToken 是否需 Token
   * @param sendAsJson 是否為 Json 格式
   * @param token Token
   * @returns
   */
  SetHeader(
    needToken: boolean,
    sendAsJson: boolean,
    token: string = this.tokenStoreService.getToken()
  ): HttpHeaders {
    let header = new HttpHeaders();

    if (needToken) {
      header = header.set('Authorization', 'Bearer ' + token);
    }
    if (sendAsJson) {
      header = header.set('Content-Type', 'application/json; charset=utf-8');
    }

    return header;
  }
}
