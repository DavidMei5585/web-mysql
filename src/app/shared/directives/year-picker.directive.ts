import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
declare let $: any;

@Directive({
  selector: '[appYearPicker]'
})
export class YearPickerDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    $(this.el.nativeElement)
      .datepicker({
        format: 'twy',
        language: 'zh-TW',
        viewMode: 'years',
        minViewMode: 'years'
      })
      .on('changeDate', () => {
        const inputEvent = document.createEvent('Event');
        inputEvent.initEvent('input', true, true);
        this.el.nativeElement.dispatchEvent(inputEvent);
      });
  }

  @HostListener('ngModelChange', ['$event']) onNgModelChange() {
    $(this.el.nativeElement).datepicker('update');
  }
}
