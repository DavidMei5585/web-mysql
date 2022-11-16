import { Pipe, PipeTransform } from '@angular/core';

/**
 * 代碼 Pipe
 * @author David
 */
@Pipe({
  name: 'code'
})
export class CodePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value !== undefined && args != null && args[0] != null) {
      if (Array.isArray(value)) {
        let t = '';
        value.forEach((element) => {
          if (t != '') t += '、';
          t += args[0].find((d: any) => d.value == element.value)?.label;
        });
        return t;
      } else {
        const code = args[0].find((d: any) => d.codeNo == value);
        if (code == null) {
          const option = args[0].find((d: any) => d.value == value);
          return option ? option.label : '';
        } else {
          return code.codeName;
        }
      }
    } else return '';
  }
}
