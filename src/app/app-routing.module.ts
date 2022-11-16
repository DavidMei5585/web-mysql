import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { NoAuthorityComponent } from './core/components/no-authority/no-authority.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { RegisterComponent } from './core/components/register/register.component';
import { ResetPwdComponent } from './core/components/reset-pwd/reset-pwd.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
  { path: 'notFound', component: NotFoundComponent },
  { path: 'noAuthority', component: NoAuthorityComponent },
  { path: 'resetPwd/:tk', component: ResetPwdComponent },
  { path: '**', redirectTo: 'notFound' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      //enableTracing: true,
      useHash: true,
      // preloadingStrategy: PreloadAllModules
      onSameUrlNavigation: 'reload',
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
