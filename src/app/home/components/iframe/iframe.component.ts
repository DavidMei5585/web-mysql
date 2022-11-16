import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * iframe 內容 元件
 * @author David
 */
@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent implements OnInit {
  @Input() src: any;
  @ViewChild('frame') frameElement!: ElementRef;
  containerMinWidth = 0;
  containerMinHeight = 0;
  containerWidth: number = this.containerMinWidth;
  containerHeight: number = this.containerMinHeight;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl('');

    setTimeout(() => {
      this.onResize(window.innerWidth, window.innerHeight);
    }, 500);
  }

  @HostListener('window:resize', ['$event.target.innerWidth', '$event.target.innerHeight'])
  onResize(width: number, height: number): void {
    const top = this.frameElement.nativeElement.offsetTop;
    const left = this.frameElement.nativeElement.offsetLeft;

    console.log('width:' + width);
    console.log('height:' + height);

    console.log('top:' + top);
    console.log('left:' + left);

    console.log(this.containerWidth);
    console.log(this.containerHeight);

    this.containerWidth = Math.max(width - left, this.containerMinWidth);
    this.containerHeight = Math.max(height - top, this.containerMinHeight);

    console.log(this.containerWidth);
    console.log(this.containerHeight);
  }
}
