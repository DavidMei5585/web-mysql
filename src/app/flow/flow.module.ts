import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowRoutingModule } from './flow-routing.module';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { FlowCtrlComponent } from '../flow/components/flow-ctrl/flow-ctrl.component';
import { FlowCtrlEditComponent } from '../flow/components/flow-ctrl-edit/flow-ctrl-edit.component';
import { FlowDetailComponent } from './components/flow-detail/flow-detail.component';
import { SentListComponent } from './components/sent-list/sent-list.component';
import { PersonStageComponent } from './components/person-stage/person-stage.component';
import { FlowExtModule } from '../flow-ext/flow-ext.module';

@NgModule({
  declarations: [
    TodoListComponent,
    FlowCtrlComponent,
    FlowCtrlEditComponent,
    FlowDetailComponent,
    SentListComponent,
    PersonStageComponent
  ],
  imports: [CommonModule, FlowRoutingModule, SharedModule, FlowExtModule]
})
export class FlowModule {}
