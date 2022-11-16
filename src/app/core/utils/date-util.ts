import { Injectable } from '@angular/core';
import * as moment from 'moment-mini';

/**
 * 日期轉換 Utility
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class DateUtil {
  toDate(rocDate: string): Date | null {
    if (rocDate == null || rocDate == '') return null;
    const y = rocDate.split('/')[0];
    return new Date(moment(String(+y + 1911) + rocDate.substring(3), 'YYYY/MM/DD').format());
  }

  toDatetime(rocDatetime: string): Date | null {
    if (rocDatetime == null || rocDatetime == '') return null;
    const y = rocDatetime.split('/')[0];
    return new Date(
      moment(String(+y + 1911) + rocDatetime.substring(3), 'YYYY/MM/DD HH:mm').format()
    );
  }

  toRocDate(date: Date): string {
    if (date == null) return '';
    const m = moment(date);
    return String(+m.format('YYYY') - 1911) + m.format('/MM/DD');
  }

  toRocDateTime(date: Date): string {
    if (date == null) return '';
    const m = moment(date);
    return String(+m.format('YYYY') - 1911) + m.format('/MM/DD HH:mm');
  }
}
