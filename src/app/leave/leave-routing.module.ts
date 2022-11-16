import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { LeaveAnnualComponent } from './components/leave-annual/leave-annual.component';
import { LeaveApplyComponent } from './components/leave-apply/leave-apply.component';
import { LeaveListComponent } from './components/leave-list/leave-list.component';

const routes: Routes = [
  { path: 'annual', component: LeaveAnnualComponent, canActivate: [AuthGuard] },
  { path: 'apply', component: LeaveApplyComponent, canActivate: [AuthGuard] },
  { path: 'list', component: LeaveListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule {}
