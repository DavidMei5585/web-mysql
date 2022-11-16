import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-mini';

/**
 * 日期轉換 (將西元年日期轉換台灣日期)
 * @author David
 */
@Pipe({
  name: 'taiwanDate'
})
export class TaiwanDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value == null) return '';
    let format = 'tYY/MM/DD';
    if (args[0] != null) format = args[0];
    return (
      String(+moment(value).format('YYYY') - 1911) + moment(value).format(format.replace('tYY', ''))
    );
  }
}
