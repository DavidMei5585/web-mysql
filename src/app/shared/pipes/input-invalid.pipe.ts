import { Pipe, PipeTransform } from '@angular/core';

/**
 * 表單欄位狀態 Pipe (判斷是否帶入 css class 樣式 is-invalid)
 * @author David
 */
@Pipe({
  name: 'inputInvalid'
})
export class InputInvalidPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value && args[0]) return 'is-invalid';
    return '';
  }
}
