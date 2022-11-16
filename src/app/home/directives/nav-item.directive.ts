import { Directive, ElementRef, Renderer2 } from '@angular/core';

declare let $: any;

/**
 * nav item 屬性型指令
 * @author David
 */
@Directive({
  selector: '[appNavItem]'
})
export class NavItemDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    $(this.el.nativeElement).on('click', () => {
      $('.nav-link').removeClass('active');
      $(this.el.nativeElement).addClass('active');
      $(this.el.nativeElement).parent().parent().parent().children('a').addClass('active');
    });
  }
}
