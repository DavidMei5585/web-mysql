export interface Func {
  /** uuid */
  id: string;
  /** 選單名稱 */
  funcCname: string;
  /** 選單英文名稱 */
  funcEname: string;
  /** 選單網址 */
  funcUrl: string;
  /** 父選單 uuid */
  parentId: string;
  /** 選單路徑 (FUNC_VIEW 產生) */
  funcPath: string;
  /** 子選單 */
  funcs: Func[];
}
