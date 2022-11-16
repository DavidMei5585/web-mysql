import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

declare let $: any;

@Directive({
  selector: '[appDatepicker]'
})
export class DatepickerDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    $(this.el.nativeElement)
      .datepicker({
        format: 'twy/mm/dd',
        language: 'zh-TW',
        todayHighlight: true
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
