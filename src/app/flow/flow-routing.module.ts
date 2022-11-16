import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { FlowCtrlEditComponent } from './components/flow-ctrl-edit/flow-ctrl-edit.component';
import { FlowCtrlComponent } from './components/flow-ctrl/flow-ctrl.component';
import { PersonStageComponent } from './components/person-stage/person-stage.component';
import { SentListComponent } from './components/sent-list/sent-list.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';

const routes: Routes = [
  { path: 'todo', component: TodoListComponent, canActivate: [AuthGuard] },
  { path: 'sent', component: SentListComponent, canActivate: [AuthGuard] },
  { path: 'ctrl', component: FlowCtrlComponent, canActivate: [AuthGuard] },
  { path: 'ctrl/add', component: FlowCtrlEditComponent, canActivate: [AuthGuard] },
  { path: 'ctrl/edit/:type', component: FlowCtrlEditComponent, canActivate: [AuthGuard] },
  { path: 'stage', component: PersonStageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowRoutingModule {}
