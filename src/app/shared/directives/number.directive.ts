import { HostListener } from '@angular/core';
import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appNumber]'
})
export class NumberDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('ngModelChange') onNgModelChange() {
    this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^\d]/g, '');
  }
}
