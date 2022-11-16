import { Component, OnInit } from '@angular/core';
import { Backend } from 'src/app/core/common/constant';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { TokenStoreService } from 'src/app/core/services/token-store.service';

declare let $: any;

/**
 * 頁尾 元件
 * @author David
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  constructor(
    private tokenStoreService: TokenStoreService,
    private dataStoreService: DataStoreService
  ) {}

  ngOnInit(): void {
    const self = this;

    $.feedback({
      //initButtonText: '問題回報',
      feedbackButton: '.feedback',
      ajaxURL: `${Backend.Host}/feedbacks`,
      token: this.tokenStoreService.getToken(),
      html2canvasURL: '../../assets/js/html2canvas.min.js',
      onClose: function () {
        self.dataStoreService.loading(false);
      },
      onSubmit: function () {
        self.dataStoreService.loading(true);
      },
      afterSubmit: function () {
        self.dataStoreService.loading(false);
      }
    });
  }
}
