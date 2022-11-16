import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { ContentComponent } from './components/content/content.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: ContentComponent, canActivate: [AuthGuard] },
      {
        path: 'system',
        loadChildren: () => import('../system/system.module').then((m) => m.SystemModule)
      },
      { path: 'flow', loadChildren: () => import('../flow/flow.module').then((m) => m.FlowModule) },
      {
        path: 'leave',
        loadChildren: () => import('../leave/leave.module').then((m) => m.LeaveModule)
      },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'noAuthority', redirectTo: '/noAuthority' },
      { path: '**', redirectTo: '/notFound' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
