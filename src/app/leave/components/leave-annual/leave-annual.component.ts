import { Component, OnInit, OnDestroy } from '@angular/core';
import { LeaveService } from 'src/app/leave/services/leave.service';
import { SubSink } from 'subsink';
import { CodeService } from 'src/app/system/services/code.service';
import { switchMap, groupBy, mergeMap, toArray, map } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-leave-annual',
  templateUrl: './leave-annual.component.html',
  styleUrls: ['./leave-annual.component.scss']
})
export class LeaveAnnualComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  list: any;
  leaveTypes: any;

  constructor(private leaveService: LeaveService, private codeService: CodeService) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.codeService.getCodeList('B01').subscribe((d) => (this.leaveTypes = d));
    this.subs.sink = this.leaveService
      .getAnnual()
      .pipe(
        switchMap((d) =>
          from(d).pipe(
            groupBy((item: any) => item.startDate),
            mergeMap((group$) => group$.pipe(toArray())),
            mergeMap((array) => {
              // Take each from above array and group each array by manDate
              return from(array).pipe(
                groupBy((item: any) => item.startDate),
                mergeMap((group$) => group$.pipe(toArray()))
              );
            }),
            map((array) => {
              return {
                startDate: array[0].startDate,
                endDate: array[0].endDate,
                data: array
              };
            }),
            toArray()
          )
        )
      )
      .subscribe((d) => {
        this.list = d;
      });
  }
}
