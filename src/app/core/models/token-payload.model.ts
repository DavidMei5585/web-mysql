export interface TokenPayload {
  /** 組織代碼 */
  orgCode: string;
  /** 單位代碼 */
  deptCode: string;
  /** 人員Id */
  userId: string;
  /** 英文姓名 (AD 帳號) */
  name: string;
  /** 中文姓名 */
  cname: string;
  /** 角色 */
  role: string;
  /** 開始時間 */
  iat: number;
  /** 到期時間 */
  exp: number;
}
