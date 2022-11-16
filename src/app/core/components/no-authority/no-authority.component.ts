import { Component, OnInit } from '@angular/core';
import { DataStoreService } from 'src/app/core/services/data-store.service';

/**
 * 無權限存取(401) 頁面
 * @author David
 */
@Component({
  selector: 'app-no-authority',
  templateUrl: './no-authority.component.html',
  styleUrls: ['./no-authority.component.scss']
})
export class NoAuthorityComponent implements OnInit {
  constructor(private dataStoreService: DataStoreService) {}

  ngOnInit() {
    this.dataStoreService.loading(false);
    console.log('No Authority...');
  }
}
