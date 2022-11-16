import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { FuncComponent } from '../system/components/func/func.component';
import { RoleFuncComponent } from '../system/components/role-func/role-func.component';
import { RoleComponent } from '../system/components/role/role.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CodeComponent } from './components/code/code.component';
import { HelperComponent } from './components/helper/helper.component';
import { OnlineUserComponent } from './components/online-user/online-user.component';
import { PersonComponent } from './components/person/person.component';

const routes: Routes = [
  { path: 'role', component: RoleComponent, canActivate: [AuthGuard] },
  {
    path: 'role/func/:id/:roleCode/:roleName',
    component: RoleFuncComponent,
    canActivate: [AuthGuard]
  },
  { path: 'func', component: FuncComponent, canActivate: [AuthGuard] },
  { path: 'person', component: PersonComponent, canActivate: [AuthGuard] },
  { path: 'code', component: CodeComponent, canActivate: [AuthGuard] },
  { path: 'code/:pno/:name', component: CodeComponent, canActivate: [AuthGuard] },
  { path: 'helper', component: HelperComponent, canActivate: [AuthGuard] },
  { path: 'online', component: OnlineUserComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
