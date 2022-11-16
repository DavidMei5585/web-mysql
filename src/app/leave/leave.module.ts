import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlowExtModule } from '../flow-ext/flow-ext.module';
import { SharedModule } from '../shared/shared.module';
import { LeaveAnnualComponent } from './components/leave-annual/leave-annual.component';
import { LeaveApplyComponent } from './components/leave-apply/leave-apply.component';
import { LeaveListComponent } from './components/leave-list/leave-list.component';
import { LeaveRoutingModule } from './leave-routing.module';

@NgModule({
  declarations: [LeaveAnnualComponent, LeaveApplyComponent, LeaveListComponent],
  imports: [CommonModule, LeaveRoutingModule, SharedModule, FlowExtModule]
})
export class LeaveModule {}
