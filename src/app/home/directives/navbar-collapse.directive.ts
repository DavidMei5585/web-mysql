import { Directive, HostListener } from '@angular/core';

declare let $: any;

@Directive({
  selector: '[appNavbarCollapse]'
})
export class NavbarCollapseDirective {
  constructor() {}

  @HostListener('click') onClick() {
    $('.navbar-collapse').collapse('hide');
    $('#navbarCollapse').removeClass('show');
  }
}
