import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicComponentDirective } from '../flow-ext/directives/dynamic-component.directive';
import { LeaveDaysPipe } from '../leave/pipes/leave-days.pipe';
import { SharedModule } from '../shared/shared.module';
import { FlowRecordComponent } from './components/flow-record/flow-record.component';
import { FlowStageComponent } from './components/flow-stage/flow-stage.component';
import { LeaveMainComponent } from './components/leave-main/leave-main.component';

@NgModule({
  declarations: [
    FlowStageComponent,
    FlowRecordComponent,
    LeaveMainComponent,
    DynamicComponentDirective,
    LeaveDaysPipe
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    FlowStageComponent,
    FlowRecordComponent,
    LeaveMainComponent,
    DynamicComponentDirective,
    LeaveDaysPipe
  ]
})
export class FlowExtModule {}
