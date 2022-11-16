import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Func } from '../system/models/func.model';

/**
 * Layout 頁面
 * @author David
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  funcs: Func[] = [];

  constructor(private authenticationService: AuthenticationService) {
    // do nothing
  }

  ngOnInit(): void {
    this.authenticationService.getFunc().subscribe((d) => {
      this.funcs = d;
    });
  }
}
