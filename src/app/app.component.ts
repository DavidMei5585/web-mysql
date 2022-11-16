import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { DataStoreService } from './core/services/data-store.service';
// declare var device;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web';
  loading$: Observable<boolean> = new Observable<boolean>();

  constructor(private dataStoreService: DataStoreService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.dataStoreService.loading$.subscribe((b) => {
      if (b) this.spinner.show();
      else this.spinner.hide();
    });

    // document.addEventListener("deviceread", function() {
    //   alert(device.platform);
    //   }, false);
  }
}
