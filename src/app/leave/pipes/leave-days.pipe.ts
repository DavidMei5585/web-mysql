import { Pipe, PipeTransform } from '@angular/core';

/**
 * 時數轉換 (將時數轉換為日時-8小時基準)
 * @author David
 */
@Pipe({
  name: 'leaveDays'
})
export class LeaveDaysPipe implements PipeTransform {
  transform(value: any): any {
    if (value == 0) return '0 天';

    const d: string = Math.floor(value / 8).toString();
    const h: string = (value % 8).toString();

    return (d != '0' ? d + ' 天 ' : '') + (h != '0' ? h + ' 小時' : '');
  }
}
