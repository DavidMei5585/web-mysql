import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemRoutingModule } from './system-routing.module';
import { SharedModule } from '../shared/shared.module';

import { RoleComponent } from './components/role/role.component';
import { FuncComponent } from './components/func/func.component';
import { RoleFuncComponent } from './components/role-func/role-func.component';
import { PersonComponent } from './components/person/person.component';
import { CodeComponent } from './components/code/code.component';
import { HelperComponent } from './components/helper/helper.component';
import { OnlineUserComponent } from './components/online-user/online-user.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TreeModule } from '@circlon/angular-tree-component';

@NgModule({
  declarations: [
    RoleComponent,
    FuncComponent,
    RoleFuncComponent,
    PersonComponent,
    CodeComponent,
    HelperComponent,
    OnlineUserComponent,
    CalendarComponent
  ],
  imports: [CommonModule, SystemRoutingModule, SharedModule, TreeModule]
})
export class SystemModule {}
